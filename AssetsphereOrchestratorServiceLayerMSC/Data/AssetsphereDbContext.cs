using AssetsphereOrchestratorServiceLayerMSC.Constants;
using AssetsphereOrchestratorServiceLayerMSC.Models.Classes;
using AssetsphereOrchestratorServiceLayerMSC.Models.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace AssetsphereOrchestratorServiceLayerMSC.Data;

public class AssetsphereDbContext : DbContext
{
    public AssetsphereDbContext(DbContextOptions<AssetsphereDbContext> options) : base(options)
    {
    }

    public DbSet<UserEntityClass> Users => Set<UserEntityClass>();
    public DbSet<AssetEntityClass> Assets => Set<AssetEntityClass>();
    public DbSet<EmployeeEntityClass> Employees => Set<EmployeeEntityClass>();
    public DbSet<SoftwareLicenseEntityClass> SoftwareLicenses => Set<SoftwareLicenseEntityClass>();
    public DbSet<CloudResourceEntityClass> CloudResources => Set<CloudResourceEntityClass>();
    public DbSet<PurchaseOrderEntityClass> PurchaseOrders => Set<PurchaseOrderEntityClass>();
    public DbSet<VendorProfileEntityClass> VendorProfiles => Set<VendorProfileEntityClass>();
    public DbSet<ServiceTicketEntityClass> ServiceTickets => Set<ServiceTicketEntityClass>();
    public DbSet<VerificationCampaignEntityClass> VerificationCampaigns => Set<VerificationCampaignEntityClass>();
    public DbSet<SecurityComplianceFrameworkEntityClass> ComplianceFrameworks => Set<SecurityComplianceFrameworkEntityClass>();
    public DbSet<AIRecommendationEntityClass> AIRecommendations => Set<AIRecommendationEntityClass>();
    public DbSet<AuditLogEntityClass> AuditLogs => Set<AuditLogEntityClass>();
    public DbSet<ConfigurationConstantEntityClass> ConfigurationConstants => Set<ConfigurationConstantEntityClass>();

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);

        // Global Soft-Delete Query Filters
        modelBuilder.Entity<UserEntityClass>().HasQueryFilter(e => !e.IsDeleted);
        modelBuilder.Entity<AssetEntityClass>().HasQueryFilter(e => !e.IsDeleted);
        modelBuilder.Entity<EmployeeEntityClass>().HasQueryFilter(e => !e.IsDeleted);
        modelBuilder.Entity<SoftwareLicenseEntityClass>().HasQueryFilter(e => !e.IsDeleted);
        modelBuilder.Entity<CloudResourceEntityClass>().HasQueryFilter(e => !e.IsDeleted);
        modelBuilder.Entity<PurchaseOrderEntityClass>().HasQueryFilter(e => !e.IsDeleted);
        modelBuilder.Entity<VendorProfileEntityClass>().HasQueryFilter(e => !e.IsDeleted);
        modelBuilder.Entity<ServiceTicketEntityClass>().HasQueryFilter(e => !e.IsDeleted);
        modelBuilder.Entity<VerificationCampaignEntityClass>().HasQueryFilter(e => !e.IsDeleted);
        modelBuilder.Entity<SecurityComplianceFrameworkEntityClass>().HasQueryFilter(e => !e.IsDeleted);
        modelBuilder.Entity<AIRecommendationEntityClass>().HasQueryFilter(e => !e.IsDeleted);
        modelBuilder.Entity<AuditLogEntityClass>().HasQueryFilter(e => !e.IsDeleted);
        modelBuilder.Entity<ConfigurationConstantEntityClass>().HasQueryFilter(e => !e.IsDeleted);

        // Table Mapping & Indexes
        modelBuilder.Entity<UserEntityClass>(entity =>
        {
            entity.ToTable(DatabaseCON.UsersTable);
            entity.HasKey(e => e.Id);
            entity.HasIndex(e => e.Email).IsUnique();
            entity.HasIndex(e => e.IsVerified);
            entity.Property(e => e.Role).HasConversion<string>();
            entity.Property(e => e.Department).HasConversion<string>();
            entity.Property(e => e.IsVerified).HasColumnName("is_verified").HasDefaultValue(false);
        });

        modelBuilder.Entity<AssetEntityClass>(entity =>
        {
            entity.ToTable(DatabaseCON.AssetsTable);
            entity.HasKey(e => e.Id);
            entity.HasIndex(e => e.AssetTag).IsUnique();
            entity.HasIndex(e => e.SerialNumber);
            entity.HasIndex(e => e.Category);
            entity.HasIndex(e => e.Status);
            entity.HasIndex(e => e.AssignedEmployeeId);
            entity.Property(e => e.AssignedDepartment).HasConversion<string>();
        });

        modelBuilder.Entity<EmployeeEntityClass>(entity =>
        {
            entity.ToTable(DatabaseCON.EmployeesTable);
            entity.HasKey(e => e.Id);
            entity.HasIndex(e => e.EmployeeId).IsUnique();
            entity.HasIndex(e => e.Email);
            entity.Property(e => e.Department).HasConversion<string>();
        });

        modelBuilder.Entity<SoftwareLicenseEntityClass>(entity =>
        {
            entity.ToTable(DatabaseCON.SoftwareLicensesTable);
            entity.HasKey(e => e.Id);
        });

        modelBuilder.Entity<CloudResourceEntityClass>(entity =>
        {
            entity.ToTable(DatabaseCON.CloudResourcesTable);
            entity.HasKey(e => e.Id);
        });

        modelBuilder.Entity<PurchaseOrderEntityClass>(entity =>
        {
            entity.ToTable(DatabaseCON.PurchaseOrdersTable);
            entity.HasKey(e => e.Id);
            entity.HasIndex(e => e.PoNumber).IsUnique();
        });

        modelBuilder.Entity<VendorProfileEntityClass>(entity =>
        {
            entity.ToTable(DatabaseCON.VendorProfilesTable);
            entity.HasKey(e => e.Id);
        });

        modelBuilder.Entity<ServiceTicketEntityClass>(entity =>
        {
            entity.ToTable(DatabaseCON.ServiceTicketsTable);
            entity.HasKey(e => e.Id);
            entity.HasIndex(e => e.TicketNumber).IsUnique();
        });

        modelBuilder.Entity<VerificationCampaignEntityClass>(entity =>
        {
            entity.ToTable(DatabaseCON.VerificationCampaignsTable);
            entity.HasKey(e => e.Id);
        });

        modelBuilder.Entity<SecurityComplianceFrameworkEntityClass>(entity =>
        {
            entity.ToTable(DatabaseCON.ComplianceFrameworksTable);
            entity.HasKey(e => e.Id);
        });

        modelBuilder.Entity<AIRecommendationEntityClass>(entity =>
        {
            entity.ToTable(DatabaseCON.AIRecommendationsTable);
            entity.HasKey(e => e.Id);
        });

        modelBuilder.Entity<AuditLogEntityClass>(entity =>
        {
            entity.ToTable(DatabaseCON.AuditLogsTable);
            entity.HasKey(e => e.Id);
        });

        modelBuilder.Entity<ConfigurationConstantEntityClass>(entity =>
        {
            entity.ToTable(DatabaseCON.ConfigurationConstantsTable);
            entity.HasKey(e => e.Id);
            entity.HasIndex(e => e.ConfigurationKey).IsUnique();
        });

        // Map all entity properties to snake_case column names for PostgreSQL/Supabase compatibility
        foreach (var entity in modelBuilder.Model.GetEntityTypes())
        {
            foreach (var property in entity.GetProperties())
            {
                string propertyName = property.Name;
                string snakeCase = string.Concat(propertyName.Select((x, i) => i > 0 && char.IsUpper(x) ? "_" + x.ToString() : x.ToString())).ToLower();
                property.SetColumnName(snakeCase);
            }
        }
    }

    public override Task<int> SaveChangesAsync(CancellationToken cancellationToken = default)
    {
        DateTime utcNow = DateTime.UtcNow;

        foreach (var entry in ChangeTracker.Entries<IAuditableInterface>())
        {
            if (entry.State == EntityState.Added)
            {
                entry.Entity.CreatedAt = utcNow;
            }
            else if (entry.State == EntityState.Modified)
            {
                entry.Entity.UpdatedAt = utcNow;
            }
            else if (entry.State == EntityState.Deleted)
            {
                // Soft delete
                entry.State = EntityState.Modified;
                entry.Entity.IsDeleted = true;
                entry.Entity.DeletedAt = utcNow;
                entry.Entity.UpdatedAt = utcNow;
            }
        }

        return base.SaveChangesAsync(cancellationToken);
    }
}
