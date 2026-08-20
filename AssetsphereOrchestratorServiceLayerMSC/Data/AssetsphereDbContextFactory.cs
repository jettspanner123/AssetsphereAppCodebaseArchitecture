using AssetsphereOrchestratorServiceLayerMSC.Utilities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Design;

namespace AssetsphereOrchestratorServiceLayerMSC.Data;

public sealed class AssetsphereDbContextFactory : IDesignTimeDbContextFactory<AssetsphereDbContext>
{
    public AssetsphereDbContext CreateDbContext(string[] args)
    {
        DbContextOptionsBuilder<AssetsphereDbContext> optionsBuilder = new DbContextOptionsBuilder<AssetsphereDbContext>();
        string connectionString = ENValidator.Current.GetValueOrDefault(
            "ASSETSPHERE_DATABASE_CONNECTION_STRING", 
            "Host=db.ygcuihwpjeibxuvyjjbe.supabase.co;Port=5432;Database=postgres;Username=postgres;Password=dummy;"
        );

        // Always configure Npgsql for design-time migrations
        optionsBuilder.UseNpgsql(connectionString);

        return new AssetsphereDbContext(optionsBuilder.Options);
    }
}
