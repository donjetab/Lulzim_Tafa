using LulzimTafa.Api.Data;
using LulzimTafa.Api.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace LulzimTafa.Api.Controllers;

[ApiController]
[Route("api/awards")]
public class AwardsController(AppDbContext db) : ControllerBase
{
    [HttpGet]
    public async Task<ActionResult<IEnumerable<Award>>> GetAwards()
    {
        return await db.Awards.OrderBy(award => award.DisplayOrder).ThenByDescending(award => award.Year).ToListAsync();
    }

    [HttpPost]
    public async Task<ActionResult<Award>> CreateAward(Award award)
    {
        db.Awards.Add(award);
        await db.SaveChangesAsync();
        return CreatedAtAction(nameof(GetAwards), new { id = award.Id }, award);
    }
}
