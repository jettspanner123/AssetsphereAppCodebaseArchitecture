using System.Text;
using System.Text.Json;
using AssetsphereOrchestratorServiceLayerMSC.Data;
using AssetsphereOrchestratorServiceLayerMSC.Features.AIAssistant.Services;
using AssetsphereOrchestratorServiceLayerMSC.Features.AssetInventory.Services;
using AssetsphereOrchestratorServiceLayerMSC.Features.Authentication.Services;
using AssetsphereOrchestratorServiceLayerMSC.Features.CloudInfrastructure.Services;
using AssetsphereOrchestratorServiceLayerMSC.Features.Compliance.Services;
using AssetsphereOrchestratorServiceLayerMSC.Features.Dashboard.Services;
using AssetsphereOrchestratorServiceLayerMSC.Features.Employees.Services;
using AssetsphereOrchestratorServiceLayerMSC.Features.Procurement.Services;
using AssetsphereOrchestratorServiceLayerMSC.Features.ServiceDesk.Services;
using AssetsphereOrchestratorServiceLayerMSC.Features.SoftwareLicenses.Services;
using AssetsphereOrchestratorServiceLayerMSC.Features.Vendors.Services;
using AssetsphereOrchestratorServiceLayerMSC.Features.VerificationCampaign.Services;
using AssetsphereOrchestratorServiceLayerMSC.Middlewares;
using AssetsphereOrchestratorServiceLayerMSC.Utilities;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;

WebApplicationBuilder builder = WebApplication.CreateBuilder(args);

// 1. Environment & Configuration Validation
string dbConnectionString = ENValidator.Current.GetValueOrDefault("ASSETSPHERE_DATABASE_CONNECTION_STRING", "");
string jwtSecret = ENValidator.Current.GetValueOrDefault("ASSETSPHERE_JWT_SECRET", "AssetsphereSuperSecretKey2026SecureLongJwtTokenSigningKey!");
string jwtIssuer = ENValidator.Current.GetValueOrDefault("ASSETSPHERE_JWT_ISSUER", "AssetsphereOrchestrator");
string jwtAudience = ENValidator.Current.GetValueOrDefault("ASSETSPHERE_JWT_AUDIENCE", "AssetsphereClient");
string allowedOriginsString = ENValidator.Current.GetValueOrDefault("ASSETSPHERE_ALLOWED_ORIGINS", "http://localhost:5173,http://localhost:3000,http://localhost:5000");

string[] allowedOrigins = allowedOriginsString.Split(',', StringSplitOptions.RemoveEmptyEntries | StringSplitOptions.TrimEntries);

// 2. Database Context Registration (PostgreSQL with Supabase support & fallback)
builder.Services.AddDbContext<AssetsphereDbContext>(options =>
{
    if (!string.IsNullOrWhiteSpace(dbConnectionString) &&
        dbConnectionString.Contains("Host=", StringComparison.OrdinalIgnoreCase) &&
        !dbConnectionString.Contains("[YOUR-DATABASE-PASSWORD]", StringComparison.OrdinalIgnoreCase))
    {
        try
        {
            options.UseNpgsql(dbConnectionString, npgsqlOptions =>
            {
                npgsqlOptions.EnableRetryOnFailure(maxRetryCount: 3, maxRetryDelay: TimeSpan.FromSeconds(5), errorCodesToAdd: null);
            });
        }
        catch
        {
            options.UseInMemoryDatabase("AssetsphereInMemoryDb");
        }
    }
    else
    {
        options.UseInMemoryDatabase("AssetsphereInMemoryDb");
    }
});

// 3. Register Feature Services (MSC Layer)
builder.Services.AddScoped<AuthenticationService>();
builder.Services.AddScoped<AssetInventoryService>();
builder.Services.AddScoped<EmployeesService>();
builder.Services.AddScoped<SoftwareLicensesService>();
builder.Services.AddScoped<CloudInfrastructureService>();
builder.Services.AddScoped<ProcurementService>();
builder.Services.AddScoped<VendorsService>();
builder.Services.AddScoped<ServiceDeskService>();
builder.Services.AddScoped<ComplianceService>();
builder.Services.AddScoped<VerificationCampaignService>();
builder.Services.AddScoped<AIAssistantService>();
builder.Services.AddScoped<DashboardService>();
builder.Services.AddScoped<AssetsphereOrchestratorServiceLayerMSC.Features.Configuration.Services.ConfigurationConstantService>();

// 4. JWT Authentication Configuration
byte[] secretBytes = Encoding.UTF8.GetBytes(jwtSecret);
builder.Services.AddAuthentication(options =>
{
    options.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
    options.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
})
.AddJwtBearer(options =>
{
    options.RequireHttpsMetadata = false;
    options.SaveToken = true;
    options.TokenValidationParameters = new TokenValidationParameters
    {
        ValidateIssuerSigningKey = true,
        IssuerSigningKey = new SymmetricSecurityKey(secretBytes),
        ValidateIssuer = true,
        ValidIssuer = jwtIssuer,
        ValidateAudience = true,
        ValidAudience = jwtAudience,
        ValidateLifetime = true,
        ClockSkew = TimeSpan.Zero
    };
});

builder.Services.AddAuthorization();

// 5. CORS Policy
builder.Services.AddCors(options =>
{
    options.AddPolicy("AssetsphereCorsPolicy", policy =>
    {
        policy.WithOrigins(allowedOrigins)
              .AllowAnyHeader()
              .AllowAnyMethod()
              .AllowCredentials();
    });
});

// 6. Controllers & JSON Formatting
builder.Services.AddControllers()
    .AddJsonOptions(options =>
    {
        options.JsonSerializerOptions.PropertyNamingPolicy = JsonNamingPolicy.CamelCase;
        options.JsonSerializerOptions.DictionaryKeyPolicy = JsonNamingPolicy.CamelCase;
        options.JsonSerializerOptions.Converters.Add(new System.Text.Json.Serialization.JsonStringEnumConverter());
        options.JsonSerializerOptions.WriteIndented = true;
    });

builder.Services.AddOpenApi();

WebApplication app = builder.Build();

// 7. Middlewares
app.UseMiddleware<GlobalExceptionHandlingMiddleware>();
app.UseMiddleware<RequestLoggingMiddleware>();

if (app.Environment.IsDevelopment())
{
    app.MapOpenApi();
}

app.UseCors("AssetsphereCorsPolicy");
app.UseAuthentication();
app.UseAuthorization();

app.MapControllers();

// 8. Auto-migrate / Ensure Created & Seed Initial Data
using (IServiceScope scope = app.Services.CreateScope())
{
    AssetsphereDbContext dbContext = scope.ServiceProvider.GetRequiredService<AssetsphereDbContext>();
    try
    {
        dbContext.Database.EnsureCreated();
        await DatabaseSeederUtility.SeedInitialDataAsync(dbContext);
    }
    catch (Exception ex)
    {
        ILogger<Program> logger = scope.ServiceProvider.GetRequiredService<ILogger<Program>>();
        logger.LogWarning(ex, "Initial database connection or migration deferred: {Message}", ex.Message);
    }
}

app.Run();
