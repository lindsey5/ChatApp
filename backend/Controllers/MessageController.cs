using System.Security.Claims;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace backend.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class MessageController : ControllerBase
    {
        private readonly ApplicationDBContext _context;

        public MessageController(ApplicationDBContext context)
        {
            _context = context;
        }

        [Authorize]
        [HttpPut("seen")]
        public async Task<IActionResult> UpdateUnseenMessages([FromQuery] string senderEmail)
        {
            var idClaim = User.FindFirst(ClaimTypes.NameIdentifier);

            if (idClaim == null || !int.TryParse(idClaim.Value, out int userId))
                return Unauthorized(new { success = false, message = "Invalid user token" });

            var user = await _context.Users.FindAsync(userId);

            if (user == null) return NotFound(new { success = false, message = "User not found." });

            if (senderEmail == null) return BadRequest(new { success = false, message = "Sender email is requried." });

            var sender = await _context.Users.FirstOrDefaultAsync(u => u.Email == senderEmail);

            if (sender == null) return NotFound(new { success = false, message = "Sender email not found" });

            var unseenMessages = await _context.Messages
                .Where(m => m.Sender == sender.Id && m.Receiver == userId)
                .ToListAsync();

            foreach (var message in unseenMessages)
            {
                message.Is_seen = true;
            }
            await _context.SaveChangesAsync();
            return Ok(new { success = true, message = "Messages successfully seen"});
        }

        [Authorize]
        [HttpGet("{email}")]
        public async Task<IActionResult> GetMessages(string email)
        {
            var idClaim = User.FindFirst(ClaimTypes.NameIdentifier);

            if (idClaim == null || !int.TryParse(idClaim.Value, out int userId))
                return Unauthorized(new { success = false, message = "Invalid user token" });

            var user = await _context.Users.FindAsync(userId);

            if (user == null) return NotFound(new { success = false, message = "User not found." });

            var receiver = await _context.Users.FirstOrDefaultAsync(u => u.Email == email);

            if (receiver == null) return NotFound(new { success = false, message = "Email not found"});

            var messages = await _context.Messages.Where(m => (m.Sender == userId && m.Receiver == receiver.Id) ||
                (m.Sender == receiver.Id  && m.Receiver == userId))
                .ToListAsync();

            return Ok(new { success = true, messages });
        }
    }
}
