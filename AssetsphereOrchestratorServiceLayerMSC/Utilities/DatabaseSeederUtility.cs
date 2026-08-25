using AssetsphereOrchestratorServiceLayerMSC.Constants;
using AssetsphereOrchestratorServiceLayerMSC.Data;
using AssetsphereOrchestratorServiceLayerMSC.Helpers;
using AssetsphereOrchestratorServiceLayerMSC.Models.Classes;
using AssetsphereOrchestratorServiceLayerMSC.Models.Types;
using AssetsphereOrchestratorServiceLayerMSC.Utilities;
using Microsoft.EntityFrameworkCore;

namespace AssetsphereOrchestratorServiceLayerMSC.Utilities;

public static class DatabaseSeederUtility
{
    public static async Task SeedInitialDataAsync(AssetsphereDbContext context)
    {
        // 1. Seed Configuration Constants (WORK_LOCATIONS)
        try
        {
            var workLocationsConfig = await context.ConfigurationConstants.FirstOrDefaultAsync(c => c.ConfigurationKey == "WORK_LOCATIONS");
            if (workLocationsConfig == null)
            {
                await context.ConfigurationConstants.AddAsync(new ConfigurationConstantEntityClass
                {
                    Id = Guid.NewGuid(),
                    ConfigurationKey = "WORK_LOCATIONS",
                    ConfigurationValue = "[\"Pune, Maharastra\"]",
                    Notes = "Primary enterprise physical and remote work locations directory",
                    CreatedAt = DateTime.UtcNow,
                    CreatedBy = "seeder"
                });
                await context.SaveChangesAsync();
            }

            var designationsConfig = await context.ConfigurationConstants.FirstOrDefaultAsync(c => c.ConfigurationKey == "EMPLOYEE_DESIGNATIONS");
            if (designationsConfig == null)
            {
                await context.ConfigurationConstants.AddAsync(new ConfigurationConstantEntityClass
                {
                    Id = Guid.NewGuid(),
                    ConfigurationKey = "EMPLOYEE_DESIGNATIONS",
                    ConfigurationValue = "{\"Engineering\": [\"Software Engineer\"], \"Product Design\": [\"Product Designer\"], \"Operations\": [\"Operations Manager\"]}",
                    Notes = "Enterprise employee organizational designations mapped by department",
                    CreatedAt = DateTime.UtcNow,
                    CreatedBy = "seeder"
                });
                await context.SaveChangesAsync();
            }
        }
        catch
        {
            // Ignore if already seeded
        }

        // 2. Seed Initial Users (Admin, User, Operator, Developer)
        try
        {
            string adminEmail = ENValidator.Current.GetValueOrDefault("ASSETSPHERE_ADMIN_EMAIL", "admin@assetsphere.internal");
            string adminPassword = ENValidator.Current.GetValueOrDefault("ASSETSPHERE_ADMIN_PASSWORD", "AssetsphereAdmin2026!");

            var existingAdmin = await context.Users.FirstOrDefaultAsync(u => u.Email == adminEmail);
            if (existingAdmin == null)
            {
                UserEntityClass adminUser = new UserEntityClass
                {
                    Id = Guid.NewGuid(),
                    Email = adminEmail,
                    PasswordHash = PasswordHashHelper.Current.HashPassword(adminPassword),
                    FirstName = "Jett",
                    LastName = "Administrator",
                    Role = UserRoleType.ADMIN,
                    Department = DepartmentType.ITInfrastructure,
                    AvatarUrl = "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80",
                    IsActive = true,
                    IsVerified = true,
                    CreatedAt = DateTime.UtcNow,
                    CreatedBy = "seeder"
                };

                await context.Users.AddAsync(adminUser);
            }
            else
            {
                existingAdmin.PasswordHash = PasswordHashHelper.Current.HashPassword(adminPassword);
                existingAdmin.Role = UserRoleType.ADMIN;
                existingAdmin.IsActive = true;
                existingAdmin.IsVerified = true;
            }

            string userEmail = "user@assetsphere.internal";
            string userPassword = "AssetsphereUser2026!";

            var existingUser = await context.Users.FirstOrDefaultAsync(u => u.Email == userEmail);
            if (existingUser == null)
            {
                UserEntityClass standardUser = new UserEntityClass
                {
                    Id = Guid.NewGuid(),
                    Email = userEmail,
                    PasswordHash = PasswordHashHelper.Current.HashPassword(userPassword),
                    FirstName = "Alex",
                    LastName = "Taylor",
                    Role = UserRoleType.USER, // Least Role
                    Department = DepartmentType.Operations,
                    AvatarUrl = "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80",
                    IsActive = true,
                    IsVerified = true,
                    CreatedAt = DateTime.UtcNow,
                    CreatedBy = "seeder"
                };

                await context.Users.AddAsync(standardUser);
            }
            else
            {
                existingUser.IsVerified = true;
            }

            string operatorEmail = "operator@assetsphere.internal";
            string operatorPassword = "AssetsphereOperator2026!";

            var existingOperator = await context.Users.FirstOrDefaultAsync(u => u.Email == operatorEmail);
            if (existingOperator == null)
            {
                UserEntityClass operatorUser = new UserEntityClass
                {
                    Id = Guid.NewGuid(),
                    Email = operatorEmail,
                    PasswordHash = PasswordHashHelper.Current.HashPassword(operatorPassword),
                    FirstName = "Morgan",
                    LastName = "Reed",
                    Role = UserRoleType.OPERATOR,
                    Department = DepartmentType.ITInfrastructure,
                    AvatarUrl = "https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?w=150&auto=format&fit=crop&q=80",
                    IsActive = true,
                    IsVerified = true,
                    CreatedAt = DateTime.UtcNow,
                    CreatedBy = "seeder"
                };

                await context.Users.AddAsync(operatorUser);
            }
            else
            {
                existingOperator.IsVerified = true;
            }

            string developerEmail = "developer@assetsphere.internal";
            string developerPassword = "AssetsphereDeveloper2026!";

            var existingDev = await context.Users.FirstOrDefaultAsync(u => u.Email == developerEmail);
            if (existingDev == null)
            {
                UserEntityClass developerUser = new UserEntityClass
                {
                    Id = Guid.NewGuid(),
                    Email = developerEmail,
                    PasswordHash = PasswordHashHelper.Current.HashPassword(developerPassword),
                    FirstName = "Devon",
                    LastName = "Vance",
                    Role = UserRoleType.DEVELOPER,
                    Department = DepartmentType.Engineering,
                    AvatarUrl = "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80",
                    IsActive = true,
                    IsVerified = true,
                    CreatedAt = DateTime.UtcNow,
                    CreatedBy = "seeder"
                };

                await context.Users.AddAsync(developerUser);
            }
            else
            {
                existingDev.IsVerified = true;
            }

            await context.SaveChangesAsync();
        }
        catch
        {
            // Ignore if users already seeded
        }

        // 3. Seed Employees
        try
        {
            if (!await context.Employees.AnyAsync())
            {
                List<EmployeeEntityClass> employees = new List<EmployeeEntityClass>
                {
                    new EmployeeEntityClass
                    {
                        Id = Guid.NewGuid(),
                        EmployeeId = "EMP-1001",
                        FullName = "Sophia Sterling",
                        Email = "sophia.sterling@assetsphere.internal",
                        Department = "Engineering",
                        Designation = "Principal Architect",
                        Location = "HQ Floor 4",
                        Status = "Active",
                        ManagerName = "David Marcus",
                        ContactPhone = "+1 (555) 019-2834",
                        AvatarUrl = "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80",
                        AllocatedAssetCount = 3,
                        CreatedAt = DateTime.UtcNow,
                        CreatedBy = "seeder"
                    },
                    new EmployeeEntityClass
                    {
                        Id = Guid.NewGuid(),
                        EmployeeId = "EMP-1002",
                        FullName = "Liam Vance",
                        Email = "liam.vance@assetsphere.internal",
                        Department = "Security Operations",
                        Designation = "Lead SecOps Engineer",
                        Location = "Austin Tech Hub",
                        Status = "Active",
                        ManagerName = "Sarah Connor",
                        ContactPhone = "+1 (555) 018-9921",
                        AvatarUrl = "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80",
                        AllocatedAssetCount = 2,
                        CreatedAt = DateTime.UtcNow,
                        CreatedBy = "seeder"
                    },
                    new EmployeeEntityClass
                    {
                        Id = Guid.NewGuid(),
                        EmployeeId = "EMP-1003",
                        FullName = "Elena Rostova",
                        Email = "elena.rostova@assetsphere.internal",
                        Department = "Finance & Procurement",
                        Designation = "Director of Financial Controls",
                        Location = "London Regional Office",
                        Status = "Active",
                        ManagerName = "Arthur Pendelton",
                        ContactPhone = "+44 20 7946 0912",
                        AvatarUrl = "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80",
                        AllocatedAssetCount = 2,
                        CreatedAt = DateTime.UtcNow,
                        CreatedBy = "seeder"
                    },
                    new EmployeeEntityClass
                    {
                        Id = Guid.NewGuid(),
                        EmployeeId = "EMP-1004",
                        FullName = "Marcus Chen",
                        Email = "marcus.chen@assetsphere.internal",
                        Department = "Product Design",
                        Designation = "Senior Staff UX Designer",
                        Location = "HQ Floor 3",
                        Status = "Active",
                        ManagerName = "Sophia Sterling",
                        ContactPhone = "+1 (555) 014-4411",
                        AvatarUrl = "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80",
                        AllocatedAssetCount = 3,
                        CreatedAt = DateTime.UtcNow,
                        CreatedBy = "seeder"
                    }
                };

                await context.Employees.AddRangeAsync(employees);
                await context.SaveChangesAsync();
            }
        }
        catch
        {
            // Ignore if employees already seeded
        }

        // 4. Seed Software Licenses
        try
        {
            if (!await context.SoftwareLicenses.AnyAsync())
            {
                List<SoftwareLicenseEntityClass> licenses = new List<SoftwareLicenseEntityClass>
                {
                    new SoftwareLicenseEntityClass
                    {
                        Id = Guid.NewGuid(),
                        SoftwareName = "Microsoft 365 E5 Enterprise Suite",
                        Publisher = "Microsoft Corporation",
                        Version = "2026 Cloud",
                        LicenseType = "Subscription",
                        LicenseKey = "MSFT-E5-8839-4412-9901-PROD",
                        TotalSeats = 500,
                        AssignedSeats = 412,
                        AnnualCost = 216000.00m,
                        ExpiryDate = DateTime.UtcNow.AddMonths(10),
                        ComplianceStatus = "Compliant",
                        Category = "Productivity & Collaboration",
                        CreatedAt = DateTime.UtcNow,
                        CreatedBy = "seeder"
                    },
                    new SoftwareLicenseEntityClass
                    {
                        Id = Guid.NewGuid(),
                        SoftwareName = "JetBrains All Products Pack Enterprise",
                        Publisher = "JetBrains s.r.o.",
                        Version = "2026.1",
                        LicenseType = "Subscription",
                        LicenseKey = "JB-ALL-2026-COMM-992144",
                        TotalSeats = 120,
                        AssignedSeats = 114,
                        AnnualCost = 74400.00m,
                        ExpiryDate = DateTime.UtcNow.AddMonths(8),
                        ComplianceStatus = "Compliant",
                        Category = "Development IDEs",
                        CreatedAt = DateTime.UtcNow,
                        CreatedBy = "seeder"
                    },
                    new SoftwareLicenseEntityClass
                    {
                        Id = Guid.NewGuid(),
                        SoftwareName = "Figma Enterprise Organization",
                        Publisher = "Figma Inc.",
                        Version = "Cloud Enterprise",
                        LicenseType = "Subscription",
                        LicenseKey = "FIG-ORG-ASSETSPHERE-2026",
                        TotalSeats = 60,
                        AssignedSeats = 58,
                        AnnualCost = 32400.00m,
                        ExpiryDate = DateTime.UtcNow.AddMonths(4),
                        ComplianceStatus = "Expiring Soon",
                        Category = "Design & UI/UX",
                        CreatedAt = DateTime.UtcNow,
                        CreatedBy = "seeder"
                    }
                };

                await context.SoftwareLicenses.AddRangeAsync(licenses);
                await context.SaveChangesAsync();
            }
        }
        catch
        {
            // Ignore
        }

        // 5. Seed Cloud Resources
        try
        {
            if (!await context.CloudResources.AnyAsync())
            {
                List<CloudResourceEntityClass> cloudResources = new List<CloudResourceEntityClass>
                {
                    new CloudResourceEntityClass
                    {
                        Id = Guid.NewGuid(),
                        ResourceName = "eks-prod-eu-central-cluster-01",
                        Provider = "AWS",
                        ServiceType = "EKS",
                        Region = "eu-central-1",
                        Status = "Running",
                        MonthlyCost = 4250.00m,
                        Environment = "Production",
                        OwnerEmail = "infra-core@assetsphere.internal",
                        CreatedAt = DateTime.UtcNow,
                        CreatedBy = "seeder"
                    },
                    new CloudResourceEntityClass
                    {
                        Id = Guid.NewGuid(),
                        ResourceName = "rds-postgres-primary-db-m6g",
                        Provider = "AWS",
                        ServiceType = "RDS",
                        Region = "eu-central-1",
                        Status = "Running",
                        MonthlyCost = 1890.00m,
                        Environment = "Production",
                        OwnerEmail = "dba@assetsphere.internal",
                        CreatedAt = DateTime.UtcNow,
                        CreatedBy = "seeder"
                    }
                };

                await context.CloudResources.AddRangeAsync(cloudResources);
                await context.SaveChangesAsync();
            }
        }
        catch
        {
            // Ignore
        }

        // 6. Seed Purchase Orders & Vendors
        try
        {
            if (!await context.VendorProfiles.AnyAsync())
            {
                List<VendorProfileEntityClass> vendors = new List<VendorProfileEntityClass>
                {
                    new VendorProfileEntityClass
                    {
                        Id = Guid.NewGuid(),
                        VendorName = "Dell Premier Direct",
                        Category = "Enterprise Hardware",
                        ContactPerson = "Rachel Miller",
                        Email = "rachel.miller@dell.enterprise.com",
                        Phone = "+1 (800) 456-3355",
                        Address = "One Dell Way, Round Rock, TX 78682",
                        GstNumber = "US-DEL-7788992",
                        Status = "Preferred",
                        Rating = 4.9m,
                        ResponseTimeHours = 2,
                        SlaDetails = "4-Hour Onsite Mission Critical Support",
                        CreatedAt = DateTime.UtcNow,
                        CreatedBy = "seeder"
                    },
                    new VendorProfileEntityClass
                    {
                        Id = Guid.NewGuid(),
                        VendorName = "Apple Corporate Procurement",
                        Category = "Laptops & Mobile Workstations",
                        ContactPerson = "Jonathan Craig",
                        Email = "jcraig@apple-enterprise.com",
                        Phone = "+1 (800) 692-7753",
                        Address = "1 Apple Park Way, Cupertino, CA 95014",
                        GstNumber = "US-AAPL-100234",
                        Status = "Active",
                        Rating = 4.8m,
                        ResponseTimeHours = 4,
                        SlaDetails = "AppleCare for Enterprise 24/7 Priority Support",
                        CreatedAt = DateTime.UtcNow,
                        CreatedBy = "seeder"
                    }
                };

                await context.VendorProfiles.AddRangeAsync(vendors);
                await context.SaveChangesAsync();
            }
        }
        catch
        {
            // Ignore
        }

        // 7. Seed Service Tickets
        try
        {
            if (!await context.ServiceTickets.AnyAsync())
            {
                List<ServiceTicketEntityClass> tickets = new List<ServiceTicketEntityClass>
                {
                    new ServiceTicketEntityClass
                    {
                        Id = Guid.NewGuid(),
                        TicketNumber = "TKT-2026-1042",
                        Title = "Screen flickering on UltraWide monitor",
                        Description = "LG Curved 38 monitor intermittently loses HDMI signal during video render spikes.",
                        Priority = "Medium",
                        Status = "In Progress",
                        IssueCategory = "Hardware Repair",
                        AssetTag = "AST-2026-005",
                        RequestedByEmployeeId = "EMP-1004",
                        RequestedByEmployeeName = "Marcus Chen",
                        AssignedTechnicianName = "Alex Bradley",
                        CreatedAt = DateTime.UtcNow.AddDays(-2),
                        CreatedBy = "seeder"
                    }
                };

                await context.ServiceTickets.AddRangeAsync(tickets);
                await context.SaveChangesAsync();
            }
        }
        catch
        {
            // Ignore
        }

        // 8. Seed Compliance & Verification
        try
        {
            if (!await context.ComplianceFrameworks.AnyAsync())
            {
                List<SecurityComplianceFrameworkEntityClass> frameworks = new List<SecurityComplianceFrameworkEntityClass>
                {
                    new SecurityComplianceFrameworkEntityClass
                    {
                        Id = Guid.NewGuid(),
                        FrameworkName = "SOC 2 Type II - Security & Confidentiality",
                        Version = "Trust Services Criteria 2024",
                        ComplianceScore = 96.2m,
                        TotalControls = 52,
                        PassedControls = 50,
                        FailedControls = 1,
                        PendingControls = 1,
                        Status = "Compliant",
                        CreatedAt = DateTime.UtcNow,
                        CreatedBy = "seeder"
                    }
                };

                await context.ComplianceFrameworks.AddRangeAsync(frameworks);
                await context.SaveChangesAsync();
            }
        }
        catch
        {
            // Ignore
        }

        // 9. Seed Verification Campaign
        try
        {
            if (!await context.VerificationCampaigns.AnyAsync())
            {
                VerificationCampaignEntityClass campaign = new VerificationCampaignEntityClass
                {
                    Id = Guid.NewGuid(),
                    Title = "Q3 2026 Global Physical Asset Audit & QR Verification",
                    Description = "Annual comprehensive barcode/QR audit across HQ Floor 1-5, London Office, and Austin Tech Hub.",
                    Location = "All Locations",
                    Department = "All Departments",
                    Status = "Active",
                    StartDate = DateTime.UtcNow.AddDays(-10),
                    EndDate = DateTime.UtcNow.AddDays(20),
                    TargetAssetCount = 1450,
                    VerifiedAssetCount = 1180,
                    DiscrepancyCount = 8,
                    CreatedAt = DateTime.UtcNow,
                    CreatedBy = "seeder"
                };

                await context.VerificationCampaigns.AddAsync(campaign);
                await context.SaveChangesAsync();
            }
        }
        catch
        {
            // Ignore
        }

        // 10. Seed AI Recommendations
        try
        {
            if (!await context.AIRecommendations.AnyAsync())
            {
                List<AIRecommendationEntityClass> recommendations = new List<AIRecommendationEntityClass>
                {
                    new AIRecommendationEntityClass
                    {
                        Id = Guid.NewGuid(),
                        Category = "Cost Optimization",
                        Title = "Reclaim 18 Unassigned Figma Enterprise Seats",
                        ImpactLevel = "High",
                        EstimatedSavings = 9720.00m,
                        RecommendationText = "18 Figma Enterprise licenses have shown zero login or edit activity for > 90 days across Marketing and Design contractors.",
                        ActionType = "Reallocate",
                        IsApplied = false,
                        IsDismissed = false,
                        CreatedAt = DateTime.UtcNow,
                        CreatedBy = "ai-engine"
                    }
                };

                await context.AIRecommendations.AddRangeAsync(recommendations);
                await context.SaveChangesAsync();
            }
        }
        catch
        {
            // Ignore
        }
    }
}
