using System.Security.Claims;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace backend.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ContactController : ControllerBase
    {
        private readonly ApplicationDBContext _context;

        public ContactController(ApplicationDBContext context)
        {
            _context = context;
        }

        [Authorize]
        [HttpGet()]
        public async Task<IActionResult> GetContacts()
        {
            var idClaim = User.FindFirst(ClaimTypes.NameIdentifier);

            if (idClaim == null || !int.TryParse(idClaim.Value, out int userId))
                return Unauthorized(new { success = false, message = "Invalid user token" });

            var user = await _context.Users.FindAsync(userId);

            if (user == null) return NotFound(new { success = false, message = "User not found." });

            // Get all contact IDs for the user
            var contacts = await _context.Contacts
                .Where(c => c.User_id == userId)
                .Include(c => c.Contact_user)
                .ToListAsync();

            var contactIds = contacts.Select(c => c.Contact_user_id).ToList();

            // Fetch all latest messages in a single query
            var latestMessages = await _context.Messages
                .Where(m => (m.Sender == userId && contactIds.Contains(m.Receiver)) ||
                            (m.Receiver == userId && contactIds.Contains(m.Sender)))
                .GroupBy(m => m.Sender == userId ? m.Receiver : m.Sender)
                .Select(g => g.OrderByDescending(m => m.Date_time).FirstOrDefault())
                .ToListAsync();

            // Build the contacts list with the latest message
            var contactsList = contacts.Select(contact => {
                var latestMessage = latestMessages.FirstOrDefault(m =>
                    (m.Sender == userId && m.Receiver == contact.Contact_user_id) ||
                    (m.Sender == contact.Contact_user_id && m.Receiver == userId)
                );

                return new
                {
                    Id = contact.Id,
                    User_id = contact.User_id,
                    Contact_user_id = contact.Contact_user_id,
                    Contact_user = contact.Contact_user,
                    Last_chat = contact.Last_chat,
                    LatestMessage = latestMessage
                };
            }).OrderByDescending(c => c.Last_chat).ToList();

            return Ok(new { success = true, contacts = contactsList });
        }

    }
}
