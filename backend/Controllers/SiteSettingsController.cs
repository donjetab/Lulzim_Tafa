using LulzimTafa.Api.Data;
using LulzimTafa.Api.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace LulzimTafa.Api.Controllers;

[ApiController]
[Route("api/site-settings")]
public class SiteSettingsController(AppDbContext db) : ControllerBase
{
    [HttpGet]
    public async Task<ActionResult<IEnumerable<SiteSetting>>> GetSettings()
    {
        return await db.SiteSettings.AsNoTracking().OrderBy(setting => setting.Key).ToListAsync();
    }

    [HttpGet("social-links")]
    public async Task<ActionResult<IEnumerable<SocialLink>>> GetSocialLinks()
    {
        return await db.SocialLinks.AsNoTracking().OrderBy(link => link.DisplayOrder).ToListAsync();
    }

    [HttpPost]
    public async Task<ActionResult<SiteSetting>> CreateSetting(SiteSetting setting)
    {
        db.SiteSettings.Add(setting);
        await db.SaveChangesAsync();
        return CreatedAtAction(nameof(GetSettings), new { id = setting.Id }, setting);
    }

    [HttpPut("{id:int}")]
    public async Task<IActionResult> UpdateSetting(int id, SiteSetting setting)
    {
        if (id != setting.Id) return BadRequest();
        db.Entry(setting).State = EntityState.Modified;
        await db.SaveChangesAsync();
        return NoContent();
    }

    [HttpDelete("{id:int}")]
    public async Task<IActionResult> DeleteSetting(int id)
    {
        var setting = await db.SiteSettings.FindAsync(id);
        if (setting is null) return NotFound();
        db.SiteSettings.Remove(setting);
        await db.SaveChangesAsync();
        return NoContent();
    }
}
