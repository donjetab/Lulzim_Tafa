using LulzimTafa.Api.Data;
using LulzimTafa.Api.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace LulzimTafa.Api.Controllers;

[ApiController]
[Route("api/gallery")]
public class GalleryController(AppDbContext db) : ControllerBase
{
    [HttpGet]
    public async Task<ActionResult<IEnumerable<GalleryImage>>> GetGallery()
    {
        return await db.GalleryImages.OrderBy(image => image.DisplayOrder).ToListAsync();
    }

    [HttpPost]
    public async Task<ActionResult<GalleryImage>> CreateGalleryImage(GalleryImage image)
    {
        db.GalleryImages.Add(image);
        await db.SaveChangesAsync();
        return CreatedAtAction(nameof(GetGallery), new { id = image.Id }, image);
    }
}
