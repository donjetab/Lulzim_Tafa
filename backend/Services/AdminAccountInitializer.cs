using LulzimTafa.Api.Data;
using LulzimTafa.Api.Models;
using Microsoft.EntityFrameworkCore;

namespace LulzimTafa.Api.Services;

public static class AdminAccountInitializer
{
    public static async Task InitializeAsync(IServiceProvider services)
    {
        using var scope = services.CreateScope();
        var db = scope.ServiceProvider.GetRequiredService<AppDbContext>();
        var configuration = scope.ServiceProvider.GetRequiredService<IConfiguration>();
        var logger = scope.ServiceProvider.GetRequiredService<ILoggerFactory>().CreateLogger("AdminAccountInitializer");

        await db.Database.ExecuteSqlRawAsync("""
            IF OBJECT_ID(N'[AdminUsers]', N'U') IS NULL
            BEGIN
                CREATE TABLE [AdminUsers] (
                    [Id] int NOT NULL IDENTITY,
                    [DisplayName] nvarchar(120) NOT NULL,
                    [Username] nvarchar(80) NOT NULL,
                    [PasswordHash] nvarchar(max) NOT NULL,
                    [CreatedAtUtc] datetime2 NOT NULL,
                    [PasswordChangedAtUtc] datetime2 NULL,
                    CONSTRAINT [PK_AdminUsers] PRIMARY KEY ([Id])
                );
                CREATE UNIQUE INDEX [IX_AdminUsers_Username] ON [AdminUsers] ([Username]);
            END
            """);
        await db.Database.ExecuteSqlRawAsync("""
            IF OBJECT_ID(N'[AdminUsers]', N'U') IS NOT NULL
                AND COL_LENGTH(N'[AdminUsers]', N'DisplayName') IS NULL
            BEGIN
                ALTER TABLE [AdminUsers] ADD [DisplayName] nvarchar(120) NOT NULL CONSTRAINT [DF_AdminUsers_DisplayName] DEFAULT N'Admin';
            END
            """);

        if (await db.AdminUsers.AnyAsync())
        {
            return;
        }

        var username = configuration["Admin:Username"] ?? "admin";
        var initialPassword = configuration["Admin:InitialPassword"];

        if (string.IsNullOrWhiteSpace(initialPassword))
        {
            throw new InvalidOperationException("No admin account exists. Set Admin:InitialPassword with an environment variable or user secret before first startup.");
        }

        db.AdminUsers.Add(new AdminUser
        {
            DisplayName = configuration["Admin:DisplayName"] ?? "Ardian Sallauka",
            Username = username,
            PasswordHash = PasswordHasher.Hash(initialPassword),
            CreatedAtUtc = DateTime.UtcNow
        });

        await db.SaveChangesAsync();
        logger.LogInformation("Created initial admin account '{Username}'.", username);
    }
}
