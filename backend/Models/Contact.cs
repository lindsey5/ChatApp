using System;
using System.ComponentModel.DataAnnotations.Schema;

namespace backend.Models;

public class Contact
{
    public int Id { get; set; }
    public int User_id { get; set; }
    public int Contact_user_id { get; set; }
    public DateTime Last_chat { get; set; } = DateTime.Now;

    [ForeignKey(nameof(Contact_user_id))]
    public User? Contact_user { get; set; }

}
