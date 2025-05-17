using System.Security.Claims;
using backend.Models;
using Microsoft.AspNetCore.Authorization;

using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace backend.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class UserController : ControllerBase
    {

        private readonly ApplicationDBContext _context;

        public UserController(ApplicationDBContext context)
        {
            _context = context;
        }

        [Authorize]
        [HttpGet()]
        public async Task<IActionResult> GetProfile()
        {
            var idClaim = User.FindFirst(ClaimTypes.NameIdentifier);

            if (idClaim == null || !int.TryParse(idClaim.Value, out int userId))
                return Unauthorized(new { success = false, message = "Invalid user token" });

            var user = await _context.Users.FindAsync(userId);

            if (user == null) return NotFound(new { success = false, message = "User not found." });

            var base64Image = user.Image != null ? Convert.ToBase64String(user.Image) : null;

            return Ok(new
            {
                id = user.Id,
                email = user.Email,
                firstname = user.Firstname,
                lastname = user.Lastname,
                image = $"data:image/jpeg;base64,{base64Image}"
            });
        }

        [Authorize]
        [HttpGet("users")]
        public async Task<IActionResult> GetAllUsers(string? searchTerm = null)
        {
            var idClaim = User.FindFirst(ClaimTypes.NameIdentifier);

            if (idClaim == null || !int.TryParse(idClaim.Value, out int userId))
                return Unauthorized(new { success = false, message = "Invalid user token" });

            var user = await _context.Users.FindAsync(userId);

            if (user == null) return NotFound(new { success = false, message = "User not found." });

            IQueryable<User> query = _context.Users;

            if (!string.IsNullOrWhiteSpace(searchTerm))
            {
                query = query.Where(u =>
                   u.Id != userId && (u.Email.Contains(searchTerm) ||
                    u.Firstname.Contains(searchTerm) ||
                    u.Lastname.Contains(searchTerm)));
            }

            var users = await query
                .ToListAsync();

            return Ok(new
            {
                users,
                success = true
            });
        }

        public class UserUpdateDto
        {
            public string Firstname { get; set; } = string.Empty;
            public string Lastname { get; set; } = string.Empty;
            public byte[]? Image { get; set; }

        }
        
        [Authorize]
        [HttpPut()]
        public async Task<IActionResult> UpdateProfile([FromBody] UserUpdateDto userUpdateDto)
        {
            var idClaim = User.FindFirst(ClaimTypes.NameIdentifier);

            if (idClaim == null || !int.TryParse(idClaim.Value, out int userId))
                        return Unauthorized(new { success = false, message = "Invalid user token" });

            var user = await _context.Users.FindAsync(userId);

            if(user == null) return NotFound(new { success = false, message = "User not found."}); 

            user.Firstname = userUpdateDto.Firstname;
            user.Lastname = userUpdateDto.Lastname;

            if (userUpdateDto.Image != null && userUpdateDto.Image.Length > 0)
            {
                user.Image = userUpdateDto.Image;
            }

            await _context.SaveChangesAsync();
            
            return Ok(new { 
                success = true,
                user
            });
        }


    }
}
