using System;
using System.ComponentModel.DataAnnotations;

namespace backend.Models;

public class User
{
    public int Id { get; set; }
    [EmailAddress(ErrorMessage = "Invalid email address.")]
    public string Email { get; set; } = string.Empty;
    public string Password { get; set; } = string.Empty;

    [MaxLength(100, ErrorMessage = "First name cannot exceed 100 characters.")]
    public string Firstname { get; set; } = string.Empty;

    [MaxLength(100, ErrorMessage = "Last name cannot exceed 100 characters.")]
    public string Lastname { get; set; } = string.Empty;
    public byte[]? Image { get; set; }

}
