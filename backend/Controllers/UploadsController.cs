using LulzimTafa.Api.Services;
using Microsoft.AspNetCore.Mvc;

namespace LulzimTafa.Api.Controllers;

[ApiController]
[Route("api/uploads")]
public class UploadsController(IWebHostEnvironment environment) : ControllerBase
{
    [HttpPost("{folder}")]
    [RequestSizeLimit(10_000_000)]
    public async Task<ActionResult<object>> Upload(string folder, IFormFile file)
    {
        if (file.Length == 0) return BadRequest("No file uploaded.");

        var safeFolder = string.Concat(folder.Where(char.IsLetterOrDigit)).ToLowerInvariant();
        if (string.IsNullOrWhiteSpace(safeFolder)) return BadRequest("Invalid folder.");

        var path = await UploadService.SaveAsync(file, environment, safeFolder);
        return Ok(new { path });
    }
}
