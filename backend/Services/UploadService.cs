namespace LulzimTafa.Api.Services;

public static class UploadService
{
    private static readonly HashSet<string> AllowedExtensions = new(StringComparer.OrdinalIgnoreCase)
    {
        ".jpg",
        ".jpeg",
        ".png",
        ".webp"
    };

    public static async Task<string> SaveAsync(IFormFile file, IWebHostEnvironment environment, string folder)
    {
        var extension = Path.GetExtension(file.FileName);
        if (!AllowedExtensions.Contains(extension))
        {
            throw new InvalidOperationException("Unsupported image format.");
        }

        var uploadsRoot = Path.Combine(environment.WebRootPath ?? "wwwroot", "uploads", folder);
        Directory.CreateDirectory(uploadsRoot);

        var fileName = $"{Guid.NewGuid():N}{extension}";
        var fullPath = Path.Combine(uploadsRoot, fileName);
        await using var stream = File.Create(fullPath);
        await file.CopyToAsync(stream);

        return $"/uploads/{folder}/{fileName}";
    }
}
