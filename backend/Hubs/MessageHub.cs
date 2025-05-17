using System.Collections.Concurrent;
using backend.Models;
using Microsoft.AspNetCore.SignalR;
using Microsoft.EntityFrameworkCore;
using Task = System.Threading.Tasks.Task;

public class MessageHub : Hub
{
    private readonly ApplicationDBContext _context;

    public MessageHub(ApplicationDBContext context)
    {
        _context = context;
    }

    private static ConcurrentDictionary<string, string> userConnections = new();

    private void AddConnection(string email, string connectionId)
    {
        userConnections[email] = connectionId;
    }

    private void RemoveConnection(string connectionId)
    {
        var email = userConnections.FirstOrDefault(x => x.Value == connectionId).Key;
        if (email != null)
        {
            userConnections.TryRemove(email, out _);
        }
    }

    public override Task OnConnectedAsync()
    {
        var context = Context;
        if (context != null)
        {
            var httpContext = context.GetHttpContext();
            var email = httpContext?.Request.Query["email"].ToString();

            if (!string.IsNullOrEmpty(email))
            {
                AddConnection(email, context.ConnectionId);
            }
        }

        return base.OnConnectedAsync();
    }

    public override Task OnDisconnectedAsync(Exception exception)
    {
        RemoveConnection(Context.ConnectionId);

        return base.OnDisconnectedAsync(exception);
    }
    
     public async Task SendMessage(string email, string senderEmail, string message)
    {
        if (email != null && message != null)
        {
            var receiver = await _context.Users.FirstOrDefaultAsync(u => u.Email == email);
            var sender = await _context.Users.FirstOrDefaultAsync(u => u.Email == senderEmail);
            if (receiver != null && sender != null)
            {
                var isContactExist = await _context.Contacts.AnyAsync(c => (
                    c.User_id == sender.Id && c.Contact_user_id == receiver.Id) ||
                    (c.User_id == receiver.Id && c.Contact_user_id == sender.Id));

                if (!isContactExist)
                {
                    _context.Contacts.AddRange([
                        new Contact{
                            User_id = sender.Id,
                            Contact_user_id = receiver.Id,
                        },
                        new Contact{
                            User_id = receiver.Id,
                            Contact_user_id = sender.Id,
                        }
                    ]);
                }
                else
                {
                    var senderContact = await _context.Contacts.FirstOrDefaultAsync(c => c.User_id == sender.Id && c.Contact_user_id == receiver.Id);
                    var receiverContact = await _context.Contacts.FirstOrDefaultAsync(c => c.User_id == receiver.Id && c.Contact_user_id == sender.Id);
                    if (senderContact != null && receiverContact != null)
                    {
                        senderContact.Last_chat = DateTime.Now;
                        receiverContact.Last_chat = DateTime.Now;
                    }
                }

                var newMessage = new Message
                {
                    Sender = sender.Id,
                    Receiver = receiver.Id,
                    Content = message
                };

                _context.Messages.Add(newMessage);
                await _context.SaveChangesAsync();
                if (userConnections.TryGetValue(email, out var connectionId))
                    await Clients.Client(connectionId).SendAsync("ReceiveMessage", newMessage);
            }

        }
        
    }
}