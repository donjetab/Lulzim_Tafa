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
        return await db.SiteSettings.OrderBy(setting => setting.Key).ToListAsync();
    }

    [HttpGet("social-links")]
    public async Task<ActionResult<IEnumerable<SocialLink>>> GetSocialLinks()
    {
        return await db.SocialLinks.OrderBy(link => link.DisplayOrder).ToListAsync();
    }
}
