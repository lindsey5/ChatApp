using System;

namespace backend.Models;

public class Message
{
    public int Id { get; set; }
    public int Sender { get; set; }
    public int Receiver { get; set; }
    public string Content { get; set; } = string.Empty;
    public DateTime Date_time { get; set; } = DateTime.Now;
    public bool Is_seen { get; set; } = false;
}
