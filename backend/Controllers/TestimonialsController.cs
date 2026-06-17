using LulzimTafa.Api.Data;
using LulzimTafa.Api.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace LulzimTafa.Api.Controllers;

[ApiController]
[Route("api/testimonials")]
public class TestimonialsController(AppDbContext db) : ControllerBase
{
    [HttpGet]
    public async Task<ActionResult<IEnumerable<Testimonial>>> GetTestimonials()
    {
        return await db.Testimonials.OrderBy(testimonial => testimonial.DisplayOrder).ToListAsync();
    }

    [HttpPost]
    public async Task<ActionResult<Testimonial>> CreateTestimonial(Testimonial testimonial)
    {
        db.Testimonials.Add(testimonial);
        await db.SaveChangesAsync();
        return CreatedAtAction(nameof(GetTestimonials), new { id = testimonial.Id }, testimonial);
    }
}
