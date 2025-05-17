using System.Security.Claims;
using backend.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.Http;

namespace backend.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class Chatbot_messageController : ControllerBase
    {
        private readonly ApplicationDBContext _context;

        public Chatbot_messageController(ApplicationDBContext context)
        {
            _context = context;
        }

        [Authorize]
        [HttpPost()]
        public async Task<IActionResult> SaveMessage([FromBody] Chatbot_message message)
        {
            var idClaim = User.FindFirst(ClaimTypes.NameIdentifier);

            if (idClaim == null || !int.TryParse(idClaim.Value, out int userId))
                return Unauthorized(new { success = false, message = "Invalid user token" });

            var user = await _context.Users.FindAsync(userId);

            if (user == null) return NotFound(new { success = false, message = "User not found." });

            message.User_id = userId;
            _context.chatbot_Messages.Add(message);
            await _context.SaveChangesAsync();

            return Ok(new { success = true, message = "Message successfully saved" });
        }
        
        [Authorize]
        [HttpGet()]
        public async Task<IActionResult> GetMessages()
        {
            var idClaim = User.FindFirst(ClaimTypes.NameIdentifier);

            if (idClaim == null || !int.TryParse(idClaim.Value, out int userId))
                return Unauthorized(new { success = false, message = "Invalid user token" });

            var user = await _context.Users.FindAsync(userId);

            if (user == null) return NotFound(new { success = false, message = "User not found." });

            var messages = await _context.chatbot_Messages.Where(m => m.User_id == userId).ToListAsync();

            return Ok(new { success = true, messages});
        }
    }
}
