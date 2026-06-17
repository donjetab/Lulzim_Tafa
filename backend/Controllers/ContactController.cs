using LulzimTafa.Api.Data;
using LulzimTafa.Api.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace LulzimTafa.Api.Controllers;

[ApiController]
[Route("api/contact")]
public class ContactController(AppDbContext db) : ControllerBase
{
    [HttpPost]
    public async Task<ActionResult<ContactMessage>> Submit(ContactMessage message)
    {
        message.CreatedAtUtc = DateTime.UtcNow;
        db.ContactMessages.Add(message);
        await db.SaveChangesAsync();
        return CreatedAtAction(nameof(GetMessages), new { id = message.Id }, message);
    }

    [HttpGet("messages")]
    public async Task<ActionResult<IEnumerable<ContactMessage>>> GetMessages()
    {
        return await db.ContactMessages.OrderByDescending(message => message.CreatedAtUtc).ToListAsync();
    }
}
