using LulzimTafa.Api.Data;
using LulzimTafa.Api.Services;
using Microsoft.AspNetCore.Authentication.Cookies;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.FileProviders;

var builder = WebApplication.CreateBuilder(args);

builder.Logging.ClearProviders();
builder.Logging.AddConsole();
builder.Logging.AddDebug();

builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddAuthentication(CookieAuthenticationDefaults.AuthenticationScheme)
    .AddCookie(options =>
    {
        options.Cookie.Name = "lulzim_tafa_admin";
        options.Cookie.HttpOnly = true;
        options.Cookie.SameSite = SameSiteMode.Lax;
        options.Cookie.SecurePolicy = CookieSecurePolicy.SameAsRequest;
        options.SlidingExpiration = true;
        options.ExpireTimeSpan = AdminSession.Duration;
        options.Events.OnRedirectToLogin = context =>
        {
            context.Response.StatusCode = StatusCodes.Status401Unauthorized;
            return Task.CompletedTask;
        };
        options.Events.OnRedirectToAccessDenied = context =>
        {
            context.Response.StatusCode = StatusCodes.Status403Forbidden;
            return Task.CompletedTask;
        };
    });
builder.Services.AddAuthorization();
builder.Services.AddCors(options =>
{
    options.AddPolicy("Frontend", policy =>
    {
        policy.WithOrigins(
                "http://127.0.0.1:5173",
                "http://localhost:5173",
                "http://127.0.0.1:5174",
                "http://localhost:5174")
            .AllowAnyHeader()
            .AllowAnyMethod()
            .AllowCredentials();
    });
});

builder.Services.AddDbContext<AppDbContext>(options =>
{
    options.UseSqlServer(builder.Configuration.GetConnectionString("DefaultConnection"));
});
builder.Services.AddHostedService<UnusedUploadCleanupService>();
builder.Services.AddScoped<SeoService>();

var app = builder.Build();

await MultilingualContentInitializer.InitializeAsync(app.Services);
await AdminAccountInitializer.InitializeAsync(app.Services);

app.UseHttpsRedirection();
app.UseStaticFiles();

var frontendDistPath = Path.GetFullPath(Path.Combine(app.Environment.ContentRootPath, "..", "frontend", "dist"));
if (Directory.Exists(frontendDistPath))
{
    app.UseDefaultFiles(new DefaultFilesOptions
    {
        FileProvider = new PhysicalFileProvider(frontendDistPath)
    });
    app.UseStaticFiles(new StaticFileOptions
    {
        FileProvider = new PhysicalFileProvider(frontendDistPath)
    });
}

app.UseCors("Frontend");

app.Use(async (context, next) =>
{
    try
    {
        await next();
    }
    catch (Exception exception) when (context.Request.Path.StartsWithSegments("/api"))
    {
        app.Logger.LogError(exception, "Unhandled API error for {Method} {Path}", context.Request.Method, context.Request.Path);

        if (!context.Response.HasStarted)
        {
            context.Response.Clear();
            context.Response.StatusCode = StatusCodes.Status500InternalServerError;
            context.Response.ContentType = "application/json";
            await context.Response.WriteAsJsonAsync(new { message = "An unexpected server error occurred." });
        }
    }
});

app.UseAuthentication();
app.UseAuthorization();

app.Use(async (context, next) =>
{
    var isAuthEndpoint = context.Request.Path.StartsWithSegments("/api/auth/login")
        || context.Request.Path.StartsWithSegments("/api/auth/me");
    var isPublicContact = HttpMethods.IsPost(context.Request.Method)
        && context.Request.Path.StartsWithSegments("/api/contact");
    var isUnsafeApiRequest = context.Request.Path.StartsWithSegments("/api")
        && !HttpMethods.IsGet(context.Request.Method)
        && !HttpMethods.IsHead(context.Request.Method)
        && !HttpMethods.IsOptions(context.Request.Method);

    if (isUnsafeApiRequest
        && !isAuthEndpoint
        && !isPublicContact
        && context.User.Identity?.IsAuthenticated != true)
    {
        context.Response.StatusCode = StatusCodes.Status401Unauthorized;
        await context.Response.WriteAsJsonAsync(new { message = "Admin login is required." });
        return;
    }

    if (context.Request.Path.StartsWithSegments("/admin")
        && !context.Request.Path.StartsWithSegments("/admin-login")
        && context.User.Identity?.IsAuthenticated != true)
    {
        context.Response.Redirect("/");
        return;
    }

    await next();
});
app.MapControllers();

app.MapGet("/robots.txt", (SeoService seo, HttpRequest request) =>
    Results.Text($"User-agent: *\nAllow: /\nDisallow: /admin\nDisallow: /api/\nSitemap: {seo.GetPublicOrigin(request)}/sitemap.xml\n", "text/plain"));

app.MapGet("/sitemap.xml", async (SeoService seo, HttpRequest request) =>
    Results.Text(await seo.BuildSitemapAsync(seo.GetPublicOrigin(request)), "application/xml"));

if (Directory.Exists(frontendDistPath))
{
    app.MapFallback(async (HttpContext context, SeoService seo) =>
    {
        if (context.Request.Path.StartsWithSegments("/api"))
        {
            context.Response.StatusCode = StatusCodes.Status404NotFound;
            context.Response.ContentType = "application/json";
            await context.Response.WriteAsync("""{"error":"API route not found."}""");
            return;
        }

        var indexHtml = await File.ReadAllTextAsync(Path.Combine(frontendDistPath, "index.html"));
        var html = await seo.InjectMetadataAsync(indexHtml, context.Request.Path, seo.GetPublicOrigin(context.Request));
        context.Response.ContentType = "text/html; charset=utf-8";
        await context.Response.WriteAsync(html);
    });
}
else
{
    app.MapGet("/", () => Results.Ok(new
    {
        message = "Lulzim Tafa API is running. Start the frontend with npm.cmd --prefix frontend run dev, or build it with npm.cmd --prefix frontend run build."
    }));
}

app.Run();
