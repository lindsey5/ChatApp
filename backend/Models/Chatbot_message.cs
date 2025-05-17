using System;

namespace backend.Models;

public class Chatbot_message
{
    public int Id { get; set; }
    public int User_id { get; set; }
    public string Sender { get; set; } = "user";
    public string Message { get; set; } = string.Empty;
    public string Type { get; set; } = "message";
    public DateTime Date_time { get; set; } = DateTime.Now;

}
