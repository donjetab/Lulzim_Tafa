using LulzimTafa.Api.Data;
using LulzimTafa.Api.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace LulzimTafa.Api.Controllers;

[ApiController]
[Route("api/interviews")]
public class InterviewsController(AppDbContext db) : ControllerBase
{
    [HttpGet]
    public async Task<ActionResult<IEnumerable<Interview>>> GetInterviews()
    {
        return await db.Interviews.OrderByDescending(interview => interview.Date).ToListAsync();
    }

    [HttpPost]
    public async Task<ActionResult<Interview>> CreateInterview(Interview interview)
    {
        db.Interviews.Add(interview);
        await db.SaveChangesAsync();
        return CreatedAtAction(nameof(GetInterviews), new { id = interview.Id }, interview);
    }
}
