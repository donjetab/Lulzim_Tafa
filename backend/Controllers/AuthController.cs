using System.Security.Claims;
using LulzimTafa.Api.Data;
using LulzimTafa.Api.Models;
using LulzimTafa.Api.Services;
using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.Authentication.Cookies;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace LulzimTafa.Api.Controllers;

[ApiController]
[Route("api/auth")]
public class AuthController(AppDbContext db) : ControllerBase
{
    private static readonly Func<string, bool> HasUppercase = value => value.Any(char.IsUpper);
    private static readonly Func<string, bool> HasLowercase = value => value.Any(char.IsLower);
    private static readonly Func<string, bool> HasNumber = value => value.Any(char.IsDigit);
    private static readonly Func<string, bool> HasSymbol = value => value.Any(character => !char.IsLetterOrDigit(character));

    [AllowAnonymous]
    [HttpPost("login")]
    public async Task<IActionResult> Login(LoginRequest request)
    {
        var admin = await db.AdminUsers.SingleOrDefaultAsync(user => user.Username == request.Username);
        if (admin is null || !PasswordHasher.Verify(request.Password, admin.PasswordHash))
        {
            return Unauthorized(new { message = "Invalid username or password." });
        }

        var claims = new List<Claim>
        {
            new(ClaimTypes.NameIdentifier, admin.Id.ToString()),
            new(ClaimTypes.Name, admin.Username),
            new("display_name", admin.DisplayName)
        };
        var identity = new ClaimsIdentity(claims, CookieAuthenticationDefaults.AuthenticationScheme);
        var principal = new ClaimsPrincipal(identity);

        await HttpContext.SignInAsync(CookieAuthenticationDefaults.AuthenticationScheme, principal, new AuthenticationProperties
        {
            IsPersistent = true,
            ExpiresUtc = DateTimeOffset.UtcNow.Add(AdminSession.Duration),
            AllowRefresh = true
        });

        return Ok(new { username = admin.Username, displayName = admin.DisplayName });
    }

    [AllowAnonymous]
    [HttpGet("me")]
    public async Task<IActionResult> Me()
    {
        if (User.Identity?.IsAuthenticated != true)
        {
            return Ok(new { isAuthenticated = false });
        }

        var admin = await GetCurrentAdmin();
        if (admin is null)
        {
            return Ok(new { isAuthenticated = false });
        }

        return Ok(new
        {
            isAuthenticated = true,
            username = admin.Username,
            displayName = admin.DisplayName
        });
    }

    [Authorize]
    [HttpPost("logout")]
    public async Task<IActionResult> Logout()
    {
        await HttpContext.SignOutAsync(CookieAuthenticationDefaults.AuthenticationScheme);
        return NoContent();
    }

    [Authorize]
    [HttpPut("me")]
    public async Task<IActionResult> UpdateProfile(UpdateAdminProfileRequest request)
    {
        var displayName = request.DisplayName.Trim();
        var username = request.Username.Trim();
        var newPassword = request.NewPassword?.Trim() ?? string.Empty;

        if (displayName.Length < 2)
        {
            return BadRequest(new { message = "Name must be at least 2 characters." });
        }

        if (username.Length < 3)
        {
            return BadRequest(new { message = "Username must be at least 3 characters." });
        }

        var admin = await GetCurrentAdmin();
        if (admin is null)
        {
            return Unauthorized();
        }

        if (!PasswordHasher.Verify(request.CurrentPassword, admin.PasswordHash))
        {
            return BadRequest(new { message = "Current password is incorrect." });
        }

        var usernameExists = await db.AdminUsers.AnyAsync(user => user.Id != admin.Id && user.Username == username);
        if (usernameExists)
        {
            return BadRequest(new { message = "Username is already in use." });
        }

        if (!string.IsNullOrWhiteSpace(newPassword))
        {
            var passwordError = ValidatePassword(newPassword);
            if (passwordError is not null)
            {
                return BadRequest(new { message = passwordError });
            }

            admin.PasswordHash = PasswordHasher.Hash(newPassword);
            admin.PasswordChangedAtUtc = DateTime.UtcNow;
        }

        admin.DisplayName = displayName;
        admin.Username = username;
        await db.SaveChangesAsync();

        await SignInAdmin(admin);

        return Ok(new { username = admin.Username, displayName = admin.DisplayName });
    }

    private async Task<AdminUser?> GetCurrentAdmin()
    {
        var adminId = int.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier) ?? "0");
        return adminId <= 0 ? null : await db.AdminUsers.FindAsync(adminId);
    }

    private async Task SignInAdmin(AdminUser admin)
    {
        var claims = new List<Claim>
        {
            new(ClaimTypes.NameIdentifier, admin.Id.ToString()),
            new(ClaimTypes.Name, admin.Username),
            new("display_name", admin.DisplayName)
        };
        var identity = new ClaimsIdentity(claims, CookieAuthenticationDefaults.AuthenticationScheme);
        await HttpContext.SignInAsync(CookieAuthenticationDefaults.AuthenticationScheme, new ClaimsPrincipal(identity), new AuthenticationProperties
        {
            IsPersistent = true,
            ExpiresUtc = DateTimeOffset.UtcNow.Add(AdminSession.Duration),
            AllowRefresh = true
        });
    }

    private static string? ValidatePassword(string password)
    {
        if (password.Length < 8) return "Password must be at least 8 characters.";
        if (!HasUppercase(password)) return "Password must include an uppercase letter.";
        if (!HasLowercase(password)) return "Password must include a lowercase letter.";
        if (!HasNumber(password)) return "Password must include a number.";
        if (!HasSymbol(password)) return "Password must include a symbol.";
        return null;
    }

    public sealed record LoginRequest(string Username, string Password);
    public sealed record UpdateAdminProfileRequest(string DisplayName, string Username, string CurrentPassword, string? NewPassword);
}
