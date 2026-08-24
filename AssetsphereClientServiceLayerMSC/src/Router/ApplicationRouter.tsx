import React, { useState, useEffect } from 'react';
import {
  createRootRoute,
  createRoute,
  createRouter,
  RouterProvider,
  Outlet,
  useNavigate,
  useSearch,
  useRouterState,
  Navigate,
  redirect,
} from '@tanstack/react-router';
import ApplicationRouteCON from '../Constants/ApplicationRouteCON';
import { DashboardSearchSchema, DashboardSearchParams } from './RouterSearchParamsModel';
import MockDataSeederService from '@/src/Services/MockDataSeederService';
import {
  Asset,
  Employee,
  SoftwareLicense,
  PurchaseOrder,
  ServiceTicket,
  Vendor,
  VerificationCampaign,
  AIRecommendation,
  TabType,
} from '../Types';
import ApplicationThemeUtility from '../Utilities/ApplicationThemeUtility';
import UserPreferencesUtility from '../Utilities/UserPreferencesUtility';
import ExportUtility from '../Utilities/ExportUtility';

// Route Screen Components
import LoginScreenRoute from '../Routes/LoginScreenRoute';
import SignupScreenRoute from '../Routes/SignupScreenRoute';
import ForgotPasswordScreenRoute from '../Routes/ForgotPasswordScreenRoute';
import DashboardOverviewScreenRoute from '../Routes/DashboardOverviewScreenRoute';
import AssetInventoryScreenRoute from '../Routes/AssetInventoryScreenRoute';
import EmployeesScreenRoute from '../Routes/EmployeesScreenRoute';
import SoftwareLicensesScreenRoute from '../Routes/SoftwareLicensesScreenRoute';
import CloudInfrastructureScreenRoute from '../Routes/CloudInfrastructureScreenRoute';
import ProcurementScreenRoute from '../Routes/ProcurementScreenRoute';
import ServiceDeskScreenRoute from '../Routes/ServiceDeskScreenRoute';
import VendorsScreenRoute from '../Routes/VendorsScreenRoute';
import ComplianceScreenRoute from '../Routes/ComplianceScreenRoute';
import VerificationCampaignScreenRoute from '../Routes/VerificationCampaignScreenRoute';
import AIAssistantScreenRoute from '../Routes/AIAssistantScreenRoute';
import AnalyticsScreenRoute from '../Routes/AnalyticsScreenRoute';
import SettingsScreenRoute from '../Routes/SettingsScreenRoute';
import DevDashboardScreenRoute from '../Routes/DevDashboardScreenRoute';

// Modals
import NavigationController from '../Features/Navigation/NavigationController';
import AssetDetailModalController from '../Features/AssetDetail/AssetDetailModalController';
import AssetFormModalController from '../Features/AssetForm/AssetFormModalController';
import QRBadgeModalController from '../Features/QRScanner/QRBadgeModalController';
import QRScannerModalController from '../Features/QRScanner/QRScannerModalController';
import ConfirmationModalSharedComponent from '../Shared/Components/ConfirmationModalSharedComponent';
import { LogOut } from 'lucide-react';
import { toast } from 'sonner';
import LoginScreenService from '../Features/LoginScreen/Services/LoginScreenService';
import { LoginAuthState } from '../Features/LoginScreen/Models/LoginScreenModel';
import ApplicationPermissionService from '@/src/Services/ApplicationPermissionService';

// ==========================================
// 1. Root Route Definition
// ==========================================
const rootRoute = createRootRoute({
  component: RootLayout,
});

function RootLayout(): React.JSX.Element {
  return <Outlet />;
}

// ==========================================
// 1.1 Dashboard Shared Context
// ==========================================
export interface DashboardContextType {
  showMockData: boolean;
  assets: Asset[];
  employees: Employee[];
  licenses: SoftwareLicense[];
  orders: PurchaseOrder[];
  tickets: ServiceTicket[];
  vendors: Vendor[];
  recommendations: AIRecommendation[];
  campaign: VerificationCampaign;
  onImportAssets: (importedAssets: Asset[]) => void;
  onSaveAsset: (asset: Partial<Asset>) => void;
  onDeleteAsset: (asset: Asset) => void;
}

export const DashboardContext = React.createContext<DashboardContextType | null>(null);

export function useDashboard(): DashboardContextType {
  const ctx = React.useContext(DashboardContext);
  if (!ctx) {
    const showMockData = UserPreferencesUtility.current.getShowMockData(true);
    const mockAssets = MockDataSeederService.current.getAssets();
    return {
      showMockData,
      assets: showMockData ? mockAssets : [],
      employees: showMockData ? MockDataSeederService.current.getEmployees() : [],
      licenses: showMockData ? MockDataSeederService.current.getSoftwareLicenses() : [],
      orders: showMockData ? MockDataSeederService.current.getPurchaseOrders() : [],
      tickets: showMockData ? MockDataSeederService.current.getServiceTickets() : [],
      vendors: showMockData ? MockDataSeederService.current.getVendors() : [],
      recommendations: showMockData ? MockDataSeederService.current.getAIRecommendations() : [],
      campaign: MockDataSeederService.current.getVerificationCampaigns()[0],
      onImportAssets: () => {},
      onSaveAsset: () => {},
      onDeleteAsset: () => {},
    };
  }
  return ctx;
}

// ==========================================
// 2. Auth State & Global Data Shell
// ==========================================
export function DashboardShell(): React.JSX.Element {
  const navigate = useNavigate();
  const routerState = useRouterState();
  const search = useSearch({ strict: false }) as DashboardSearchParams;

  // Theme State
  const [currentTheme, setCurrentTheme] = useState<string>(() => {
    const saved = ApplicationThemeUtility.current.getSavedTheme();
    ApplicationThemeUtility.current.applyTheme(saved);
    return saved;
  });

  useEffect(() => {
    ApplicationThemeUtility.current.applyTheme(currentTheme);
  }, [currentTheme]);

  const handleToggleTheme = () => {
    const next = ApplicationThemeUtility.current.toggleTheme(currentTheme);
    setCurrentTheme(next);
  };

  // Auth Session State
  const [authSession, setAuthSession] = useState<LoginAuthState | null>(() =>
    LoginScreenService.current.getSavedSession()
  );

  const handleSignOut = () => {
    LoginScreenService.current.clearSession();
    setAuthSession(null);
    navigate({ to: ApplicationRouteCON.LOGIN });
  };

  // Deployment Mode
  const [deploymentMode, setDeploymentMode] = useState<
    'Self-Hosted Air-Gapped' | 'Enterprise Cloud Sync'
  >('Enterprise Cloud Sync');

  const handleToggleDeploymentMode = () => {
    setDeploymentMode((prev) =>
      prev === 'Self-Hosted Air-Gapped' ? 'Enterprise Cloud Sync' : 'Self-Hosted Air-Gapped'
    );
  };

  // Show Mock Data Toggle State
  const [showMockData, setShowMockDataState] = useState<boolean>(() =>
    UserPreferencesUtility.current.getShowMockData(true)
  );

  const handleToggleShowMockData = () => {
    const next = !showMockData;
    setShowMockDataState(next);
    UserPreferencesUtility.current.setShowMockData(next);
  };

  // Notification states
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [isSignOutModalOpen, setIsSignOutModalOpen] = useState(false);

  // Portfolio State Sourced from MockDataSeederService
  const [mockAssetsList, setMockAssetsList] = useState<Asset[]>(() =>
    MockDataSeederService.current.getAssets()
  );

  const assets = showMockData ? mockAssetsList : [];
  const employees = showMockData ? MockDataSeederService.current.getEmployees() : [];
  const licenses = showMockData ? MockDataSeederService.current.getSoftwareLicenses() : [];
  const orders = showMockData ? MockDataSeederService.current.getPurchaseOrders() : [];
  const tickets = showMockData ? MockDataSeederService.current.getServiceTickets() : [];
  const vendors = showMockData ? MockDataSeederService.current.getVendors() : [];
  const recommendations = showMockData ? MockDataSeederService.current.getAIRecommendations() : [];
  const campaign = showMockData
    ? MockDataSeederService.current.getVerificationCampaigns()[0]
    : {
        id: 'CMP-EMPTY',
        title: 'No Active Verification Campaign',
        targetDepartment: 'N/A',
        startDate: 'N/A',
        endDate: 'N/A',
        totalTargetAssets: 0,
        verifiedAssetsCount: 0,
        flaggedDiscrepancies: 0,
        status: 'Draft' as const,
        description: 'Mock data is currently hidden.',
      };

  const nonCompliantCount = assets.filter((a) => !a.security?.isCompliant).length;
  const openTicketCount = tickets.filter(
    (t) => t.status !== 'Closed' && t.status !== 'Resolved'
  ).length;
  const unreadAlertCount = nonCompliantCount + (openTicketCount > 0 ? 1 : 0);

  // Derive Active Tab from Pathname
  const pathname = routerState.location.pathname;
  let activeTab: TabType = 'dashboard';
  if (pathname.includes('asset-inventory')) activeTab = 'inventory';
  else if (pathname.includes('employees')) activeTab = 'employees';
  else if (pathname.includes('software-licenses')) activeTab = 'licenses';
  else if (pathname.includes('cloud-resources')) activeTab = 'cloud';
  else if (pathname.includes('procurement')) activeTab = 'procurement';
  else if (pathname.includes('service-desk')) activeTab = 'servicedesk';
  else if (pathname.includes('vendors')) activeTab = 'vendors';
  else if (pathname.includes('compliance')) activeTab = 'compliance';
  else if (pathname.includes('verification-campaign')) activeTab = 'verification';
  else if (pathname.includes('ai-copilot')) activeTab = 'ai_assistant';
  else if (pathname.includes('analytics')) activeTab = 'analytics';
  else if (pathname.includes('settings')) activeTab = 'settings';

  const handleSelectTab = (tab: TabType) => {
    // Validate module permissions
    if (tab !== 'dashboard' && !ApplicationPermissionService.current.canAccessTab(tab)) {
      toast.error('Access Denied', {
        description: 'You do not have permission to access this module. Redirecting to Dashboard.',
      });
      return;
    }

    const routeMap: Record<TabType, string> = {
      dashboard: ApplicationRouteCON.DASHBOARD_OVERVIEW,
      inventory: ApplicationRouteCON.DASHBOARD_INVENTORY,
      employees: ApplicationRouteCON.DASHBOARD_EMPLOYEES,
      licenses: ApplicationRouteCON.DASHBOARD_LICENSES,
      cloud: ApplicationRouteCON.DASHBOARD_CLOUD,
      procurement: ApplicationRouteCON.DASHBOARD_PROCUREMENT,
      servicedesk: ApplicationRouteCON.DASHBOARD_SERVICEDESK,
      vendors: ApplicationRouteCON.DASHBOARD_VENDORS,
      compliance: ApplicationRouteCON.DASHBOARD_COMPLIANCE,
      verification: ApplicationRouteCON.DASHBOARD_VERIFICATION,
      ai_assistant: ApplicationRouteCON.DASHBOARD_AI_COPILOT,
      analytics: ApplicationRouteCON.DASHBOARD_ANALYTICS,
      settings: ApplicationRouteCON.DASHBOARD_SETTINGS,
    };
    navigate({
      to: routeMap[tab] || ApplicationRouteCON.DASHBOARD_OVERVIEW,
      search: (prev: any) => prev,
    });
  };

  // Guard activeTab on route changes or direct URL deep-links
  useEffect(() => {
    if (activeTab !== 'dashboard' && !ApplicationPermissionService.current.canAccessTab(activeTab)) {
      toast.error('Access Denied', {
        description: 'You do not have permission to access this module. Redirecting to Dashboard.',
      });
      handleSelectTab('dashboard');
    }
  }, [activeTab]);

  // Search Param Handlers for URL State Sharing
  const handleSearchChange = (query: string) => {
    navigate({
      to: '.',
      search: (prev: any) => ({
        ...prev,
        search: query.trim() ? query : undefined,
      }),
    });
  };

  const handleOpenAssetDetail = (asset: Asset) => {
    navigate({
      to: '.',
      search: (prev: any) => ({
        ...prev,
        selectedAssetId: asset.id,
      }),
    });
  };

  const handleCloseAssetDetail = () => {
    navigate({
      to: '.',
      search: (prev: any) => ({
        ...prev,
        selectedAssetId: undefined,
        assetTab: undefined,
      }),
    });
  };

  const handleOpenAddAsset = () => {
    navigate({
      to: '.',
      search: (prev: any) => ({
        ...prev,
        newAsset: true,
      }),
    });
  };

  const handleCloseAddAsset = () => {
    navigate({
      to: '.',
      search: (prev: any) => ({
        ...prev,
        newAsset: undefined,
      }),
    });
  };

  const handleOpenScanner = () => {
    navigate({
      to: '.',
      search: (prev: any) => ({
        ...prev,
        scanner: true,
      }),
    });
  };

  const handleCloseScanner = () => {
    navigate({
      to: '.',
      search: (prev: any) => ({
        ...prev,
        scanner: undefined,
      }),
    });
  };

  const handleOpenQRBadge = (asset: Asset) => {
    navigate({
      to: '.',
      search: (prev: any) => ({
        ...prev,
        selectedAssetId: undefined,
        qrAssetId: asset.id,
      }),
    });
  };

  const handleCloseQRBadge = () => {
    navigate({
      to: '.',
      search: (prev: any) => ({
        ...prev,
        qrAssetId: undefined,
      }),
    });
  };

  const handleExportCSV = () => {
    ExportUtility.current.exportAssetsToCSV(assets);
  };

  const handleSaveAsset = (assetData: Partial<Asset>) => {
    if (assetData.id) {
      setMockAssetsList((prev) =>
        prev.map((a) => (a.id === assetData.id ? ({ ...a, ...assetData } as Asset) : a))
      );
    } else {
      const newAsset: Asset = {
        id: `AST-${Date.now().toString().slice(-4)}`,
        assetNumber: `AST-${Date.now().toString().slice(-4)}`,
        deviceName: assetData.deviceName || 'New Hardware Node',
        category: assetData.category || 'Laptops',
        manufacturer: assetData.manufacturer || 'Dell',
        model: assetData.model || 'Enterprise Spec',
        serialNumber: assetData.serialNumber || `SN-${Math.random().toString(36).substring(2, 8).toUpperCase()}`,
        barcodeValue: `BAR-${Math.floor(100000 + Math.random() * 900000)}`,
        lifecycleStatus: assetData.lifecycleStatus || 'In Use',
        currentLocation: assetData.currentLocation || 'HQ-Floor 2',
        assignedToEmployeeName: assetData.assignedToEmployeeName || 'Unassigned',
        department: assetData.department || 'Engineering',
        businessUnit: 'Technology Infrastructure',
        costCenter: 'CC-ENG-402',
        currentValue: 1800,
        ...assetData,
      } as Asset;
      setMockAssetsList((prev) => [newAsset, ...prev]);
    }
    handleCloseAddAsset();
  };

  const handleImportAssets = (importedAssets: Asset[]) => {
    setMockAssetsList(importedAssets);
    MockDataSeederService.current.setAssets(importedAssets);
  };

  const handleDeleteAsset = (asset: Asset) => {
    setMockAssetsList((prev) => prev.filter((a) => a.id !== asset.id));
  };

  // Selected entities for modals derived from search params
  const selectedAssetForDetail = search.selectedAssetId
    ? assets.find((a) => a.id === search.selectedAssetId || a.assetNumber === search.selectedAssetId) || null
    : null;

  const selectedAssetForQR = search.qrAssetId
    ? assets.find((a) => a.id === search.qrAssetId || a.assetNumber === search.qrAssetId) || null
    : null;

  const isAssetFormOpen = Boolean(search.newAsset);
  const isQRScannerOpen = Boolean(search.scanner);

  return (
    <DashboardContext.Provider
      value={{
        showMockData,
        assets,
        employees,
        licenses,
        orders,
        tickets,
        vendors,
        recommendations,
        campaign,
        onImportAssets: handleImportAssets,
        onSaveAsset: handleSaveAsset,
        onDeleteAsset: handleDeleteAsset,
      }}
    >
      <NavigationController
        activeTab={activeTab}
        onSelectTab={handleSelectTab}
        globalSearch={search.search || ''}
        onSearchChange={handleSearchChange}
        onOpenNewAsset={handleOpenAddAsset}
        onOpenScanner={handleOpenScanner}
        currentTheme={currentTheme}
        onToggleTheme={handleToggleTheme}
        deploymentMode={deploymentMode}
        onToggleDeploymentMode={handleToggleDeploymentMode}
        unreadCount={unreadAlertCount}
        isNotificationsOpen={isNotificationsOpen}
        onToggleNotifications={() => setIsNotificationsOpen(!isNotificationsOpen)}
        nonCompliantCount={nonCompliantCount}
        openTicketCount={openTicketCount}
        unreadAlertCount={unreadAlertCount}
        showMockData={showMockData}
        onToggleShowMockData={handleToggleShowMockData}
        onNavigateDevDashboard={() => navigate({ to: ApplicationRouteCON.DEV_DASHBOARD })}
        onSignOut={() => setIsSignOutModalOpen(true)}
      >
        <Outlet />

        {/* Global Asset Detail Modal (Synchronized with URL search params) */}
        <AssetDetailModalController
          asset={selectedAssetForDetail}
          onClose={handleCloseAssetDetail}
          onOpenQRBadgeModal={(ast) => handleOpenQRBadge(ast)}
          onEditAsset={(ast) => {
            handleCloseAssetDetail();
            handleOpenAddAsset();
          }}
        />

        {/* Global Asset Form Modal */}
        <AssetFormModalController
          isOpen={isAssetFormOpen}
          onClose={handleCloseAddAsset}
          onSave={handleSaveAsset}
          initialAsset={null}
        />

        {/* Global QR Badge Modal */}
        <QRBadgeModalController
          asset={selectedAssetForQR}
          onClose={handleCloseQRBadge}
        />

        {/* Global QR Scanner Modal */}
        <QRScannerModalController
          isOpen={isQRScannerOpen}
          onClose={handleCloseScanner}
          assets={assets}
          onVerifyAsset={(assetId) => {
            handleCloseScanner();
            navigate({
              to: '.',
              search: (prev: any) => ({
                ...prev,
                selectedAssetId: assetId,
              }),
            });
          }}
        />

        {/* Sign Out Confirmation Modal */}
        <ConfirmationModalSharedComponent
          isOpen={isSignOutModalOpen}
          onClose={() => setIsSignOutModalOpen(false)}
          onConfirm={() => {
            setIsSignOutModalOpen(false);
            handleSignOut();
          }}
          title="Sign Out of AssetSphere Enterprise"
          subtitle="Active Session Management & Security Lock"
          description="Are you sure you want to terminate your active session? You will need to re-authenticate with your corporate credentials to access asset registries, telemetry, and service desks."
          confirmText="Sign Out"
          cancelText="Stay Logged In"
          variant="danger"
        />
      </NavigationController>
    </DashboardContext.Provider>
  );
}

// ==========================================
// 3. Child Routes Configuration
// ==========================================

// Login Route
const loginRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: ApplicationRouteCON.LOGIN,
  beforeLoad: () => {
    const session = LoginScreenService.current.getSavedSession();
    if (session) {
      throw redirect({ to: ApplicationRouteCON.DASHBOARD_OVERVIEW });
    }
  },
  component: function LoginComponent() {
    const navigate = useNavigate();
    const savedTheme = ApplicationThemeUtility.current.getSavedTheme();
    const [theme, setTheme] = useState<string>(savedTheme);

    const handleToggle = () => {
      const next = ApplicationThemeUtility.current.toggleTheme(theme);
      setTheme(next);
    };

    const handleNavigateSignup = () => {
      if (typeof document !== 'undefined' && 'startViewTransition' in document) {
        (document as any).startViewTransition(() => {
          navigate({ to: ApplicationRouteCON.SIGNUP });
        });
      } else {
        navigate({ to: ApplicationRouteCON.SIGNUP });
      }
    };

    const handleNavigateForgotPassword = () => {
      if (typeof document !== 'undefined' && 'startViewTransition' in document) {
        (document as any).startViewTransition(() => {
          navigate({ to: ApplicationRouteCON.FORGOT_PASSWORD });
        });
      } else {
        navigate({ to: ApplicationRouteCON.FORGOT_PASSWORD });
      }
    };

    return (
      <LoginScreenRoute
        currentTheme={theme}
        onToggleTheme={handleToggle}
        onNavigateSignup={handleNavigateSignup}
        onNavigateForgotPassword={handleNavigateForgotPassword}
        onLoginSuccess={(authState) => {
          LoginScreenService.current.authenticateWithCredentials({
            email: authState.userEmail || '',
            password: '***',
            rememberMe: true,
          });
          navigate({ to: ApplicationRouteCON.DASHBOARD_OVERVIEW });
        }}
      />
    );
  },
});

// Signup / Registration Route
const signupRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: ApplicationRouteCON.SIGNUP,
  beforeLoad: () => {
    const session = LoginScreenService.current.getSavedSession();
    if (session) {
      throw redirect({ to: ApplicationRouteCON.DASHBOARD_OVERVIEW });
    }
  },
  component: function SignupComponent() {
    const navigate = useNavigate();
    const savedTheme = ApplicationThemeUtility.current.getSavedTheme();
    const [theme, setTheme] = useState<string>(savedTheme);

    const handleToggle = () => {
      const next = ApplicationThemeUtility.current.toggleTheme(theme);
      setTheme(next);
    };

    const handleNavigateLogin = () => {
      if (typeof document !== 'undefined' && 'startViewTransition' in document) {
        (document as any).startViewTransition(() => {
          navigate({ to: ApplicationRouteCON.LOGIN });
        });
      } else {
        navigate({ to: ApplicationRouteCON.LOGIN });
      }
    };

    return (
      <SignupScreenRoute
        currentTheme={theme}
        onToggleTheme={handleToggle}
        onNavigateLogin={handleNavigateLogin}
        onSignupSuccess={(authState) => {
          LoginScreenService.current.authenticateWithCredentials({
            email: authState.userEmail || '',
            password: '***',
            rememberMe: true,
          });
          navigate({ to: ApplicationRouteCON.DASHBOARD_OVERVIEW });
        }}
      />
    );
  },
});

// Forgot Password Route
const forgotPasswordRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: ApplicationRouteCON.FORGOT_PASSWORD,
  beforeLoad: () => {
    const session = LoginScreenService.current.getSavedSession();
    if (session) {
      throw redirect({ to: ApplicationRouteCON.DASHBOARD_OVERVIEW });
    }
  },
  component: function ForgotPasswordComponent() {
    const navigate = useNavigate();
    const savedTheme = ApplicationThemeUtility.current.getSavedTheme();
    const [theme, setTheme] = useState<string>(savedTheme);

    const handleToggle = () => {
      const next = ApplicationThemeUtility.current.toggleTheme(theme);
      setTheme(next);
    };

    const handleNavigateLogin = () => {
      if (typeof document !== 'undefined' && 'startViewTransition' in document) {
        (document as any).startViewTransition(() => {
          navigate({ to: ApplicationRouteCON.LOGIN });
        });
      } else {
        navigate({ to: ApplicationRouteCON.LOGIN });
      }
    };

    return (
      <ForgotPasswordScreenRoute
        currentTheme={theme}
        onToggleTheme={handleToggle}
        onNavigateLogin={handleNavigateLogin}
      />
    );
  },
});

// Index Route (Redirect to /dashboard or /login based on session)
const indexRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: ApplicationRouteCON.ROOT,
  beforeLoad: () => {
    const session = LoginScreenService.current.getSavedSession();
    if (!session) {
      throw redirect({ to: ApplicationRouteCON.LOGIN });
    }
    throw redirect({ to: ApplicationRouteCON.DASHBOARD_OVERVIEW });
  },
});

// Dashboard Parent Layout Route
const dashboardLayoutRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: ApplicationRouteCON.DASHBOARD_ROOT,
  validateSearch: (rawSearch: Record<string, unknown>) => DashboardSearchSchema.parse(rawSearch),
  beforeLoad: () => {
    const session = LoginScreenService.current.getSavedSession();
    if (!session) {
      throw redirect({ to: ApplicationRouteCON.LOGIN });
    }
  },
  component: DashboardShell,
});

// Dashboard Overview (Index)
const dashboardOverviewRoute = createRoute({
  getParentRoute: () => dashboardLayoutRoute,
  path: '/',
  component: function DashboardOverviewComponent() {
    const navigate = useNavigate();
    const { assets, tickets, recommendations, campaign } = useDashboard();

    return (
      <DashboardOverviewScreenRoute
        assets={assets}
        tickets={tickets}
        recommendations={recommendations}
        campaign={campaign}
        onSelectAsset={(asset) =>
          navigate({
            to: '.',
            search: (prev: any) => ({
              ...prev,
              selectedAssetId: asset.id,
            }),
          })
        }
        onOpenAIAssistant={() =>
          navigate({ to: ApplicationRouteCON.DASHBOARD_AI_COPILOT })
        }
        onNavigateTab={(tab) => {
          if (tab === 'assets') navigate({ to: ApplicationRouteCON.DASHBOARD_INVENTORY });
          else if (tab === 'compliance') navigate({ to: ApplicationRouteCON.DASHBOARD_COMPLIANCE });
          else if (tab === 'servicedesk') navigate({ to: ApplicationRouteCON.DASHBOARD_SERVICEDESK });
          else if (tab === 'campaign') navigate({ to: ApplicationRouteCON.DASHBOARD_VERIFICATION });
        }}
      />
    );
  },
});

// Asset Inventory Route
const assetInventoryRoute = createRoute({
  getParentRoute: () => dashboardLayoutRoute,
  path: 'asset-inventory',
  component: function AssetInventoryComponent() {
    const navigate = useNavigate();
    const search = useSearch({ strict: false }) as DashboardSearchParams;
    const { assets, onImportAssets, onDeleteAsset } = useDashboard();

    return (
      <AssetInventoryScreenRoute
        assets={assets}
        onImportAssets={onImportAssets}
        onDeleteAsset={onDeleteAsset}
        onSelectAsset={(asset) =>
          navigate({
            to: '.',
            search: (prev: any) => ({
              ...prev,
              selectedAssetId: asset.id,
            }),
          })
        }
        onOpenAddModal={() =>
          navigate({
            to: '.',
            search: (prev: any) => ({
              ...prev,
              newAsset: true,
            }),
          })
        }
        onOpenQRBadgeModal={(asset) =>
          navigate({
            to: '.',
            search: (prev: any) => ({
              ...prev,
              qrAssetId: asset.id,
            }),
          })
        }
        onExportCSV={() => ExportUtility.current.exportAssetsToCSV(assets)}
        overrideViewMode={search.view as 'table' | 'grid' | 'kanban' | undefined}
        overrideGridColumns={search.cols}
        overrideSingleLine={search.singleLine}
        overrideComplianceFilter={search.status}
        overrideSearchQuery={search.search}
        onViewModeChange={(mode) =>
          navigate({
            to: '.',
            search: (prev: any) => ({ ...prev, view: mode }),
          })
        }
        onGridColumnsChange={(cols) =>
          navigate({
            to: '.',
            search: (prev: any) => ({ ...prev, cols }),
          })
        }
        onSingleLineChange={(singleLine) =>
          navigate({
            to: '.',
            search: (prev: any) => ({ ...prev, singleLine }),
          })
        }
      />
    );
  },
});

// Employees Route
const employeesRoute = createRoute({
  getParentRoute: () => dashboardLayoutRoute,
  path: 'employees',
  component: function EmployeesComponent() {
    const { employees, assets } = useDashboard();
    return <EmployeesScreenRoute employees={employees} assets={assets} />;
  },
});

// Software Licenses Route
const softwareLicensesRoute = createRoute({
  getParentRoute: () => dashboardLayoutRoute,
  path: 'software-licenses',
  component: function SoftwareLicensesComponent() {
    const { licenses } = useDashboard();
    return <SoftwareLicensesScreenRoute licenses={licenses} />;
  },
});

// Cloud Infrastructure Route
const cloudInfrastructureRoute = createRoute({
  getParentRoute: () => dashboardLayoutRoute,
  path: 'cloud-resources',
  component: function CloudComponent() {
    return <CloudInfrastructureScreenRoute />;
  },
});

// Procurement Route
const procurementRoute = createRoute({
  getParentRoute: () => dashboardLayoutRoute,
  path: 'procurement',
  component: function ProcurementComponent() {
    const { orders } = useDashboard();
    return <ProcurementScreenRoute orders={orders} />;
  },
});

// Service Desk Route
const serviceDeskRoute = createRoute({
  getParentRoute: () => dashboardLayoutRoute,
  path: 'service-desk',
  component: function ServiceDeskComponent() {
    const { tickets } = useDashboard();
    return <ServiceDeskScreenRoute tickets={tickets} />;
  },
});

// Vendors Route
const vendorsRoute = createRoute({
  getParentRoute: () => dashboardLayoutRoute,
  path: 'vendors',
  component: function VendorsComponent() {
    const { vendors } = useDashboard();
    return <VendorsScreenRoute vendors={vendors} />;
  },
});

// Compliance Route
const complianceRoute = createRoute({
  getParentRoute: () => dashboardLayoutRoute,
  path: 'compliance',
  component: function ComplianceComponent() {
    const { assets } = useDashboard();
    return <ComplianceScreenRoute assets={assets} />;
  },
});

// Verification Campaign Route
const verificationCampaignRoute = createRoute({
  getParentRoute: () => dashboardLayoutRoute,
  path: 'verification-campaign',
  component: function CampaignComponent() {
    const navigate = useNavigate();
    const { campaign } = useDashboard();
    return (
      <VerificationCampaignScreenRoute
        campaign={campaign}
        onOpenScanner={() =>
          navigate({
            to: '.',
            search: (prev: any) => ({ ...prev, scanner: true }),
          })
        }
      />
    );
  },
});

// AI Copilot Route
const aiCopilotRoute = createRoute({
  getParentRoute: () => dashboardLayoutRoute,
  path: 'ai-copilot',
  component: function AIAssistantComponent() {
    const { assets } = useDashboard();
    return <AIAssistantScreenRoute assets={assets} />;
  },
});

// Analytics Route
const analyticsRoute = createRoute({
  getParentRoute: () => dashboardLayoutRoute,
  path: 'analytics',
  component: function AnalyticsComponent() {
    const { assets } = useDashboard();
    return <AnalyticsScreenRoute assets={assets} />;
  },
});

// Settings Route
const settingsRoute = createRoute({
  getParentRoute: () => dashboardLayoutRoute,
  path: 'settings',
  component: function SettingsComponent() {
    const savedTheme = ApplicationThemeUtility.current.getSavedTheme();
    const [theme, setTheme] = useState(savedTheme);
    const [deploymentMode, setDeploymentMode] = useState<
      'Self-Hosted Air-Gapped' | 'Enterprise Cloud Sync'
    >('Enterprise Cloud Sync');

    return (
      <SettingsScreenRoute
        deploymentMode={deploymentMode}
        onToggleDeploymentMode={() =>
          setDeploymentMode((p) =>
            p === 'Self-Hosted Air-Gapped' ? 'Enterprise Cloud Sync' : 'Self-Hosted Air-Gapped'
          )
        }
        currentTheme={theme}
        onToggleTheme={() => {
          const next = ApplicationThemeUtility.current.toggleTheme(theme);
          setTheme(next);
        }}
      />
    );
  },
});

// Developer Dashboard Standalone Route (/dev/dashboard)
const devDashboardRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: 'dev/dashboard',
  beforeLoad: () => {
    const session = LoginScreenService.current.getSavedSession();
    if (!session) {
      throw redirect({ to: ApplicationRouteCON.LOGIN });
    }
    if (!ApplicationPermissionService.current.canAccessDevDashboard()) {
      throw redirect({ to: ApplicationRouteCON.DASHBOARD_OVERVIEW });
    }
  },
  component: function DevDashboardComponent() {
    const navigate = useNavigate();

    const savedTheme = ApplicationThemeUtility.current.getSavedTheme();
    const [theme, setTheme] = useState(savedTheme);
    const [deploymentMode, setDeploymentMode] = useState<
      'Self-Hosted Air-Gapped' | 'Enterprise Cloud Sync'
    >('Enterprise Cloud Sync');
    const [showMockData, setShowMockDataState] = useState<boolean>(() =>
      UserPreferencesUtility.current.getShowMockData(true)
    );

    return (
      <DevDashboardScreenRoute
        currentTheme={theme}
        onToggleTheme={() => {
          const next = ApplicationThemeUtility.current.toggleTheme(theme);
          setTheme(next);
        }}
        deploymentMode={deploymentMode}
        onToggleDeploymentMode={() =>
          setDeploymentMode((p) =>
            p === 'Self-Hosted Air-Gapped' ? 'Enterprise Cloud Sync' : 'Self-Hosted Air-Gapped'
          )
        }
        showMockData={showMockData}
        onToggleShowMockData={() => {
          const next = !showMockData;
          setShowMockDataState(next);
          UserPreferencesUtility.current.setShowMockData(next);
        }}
        onNavigateAppDashboard={() => navigate({ to: ApplicationRouteCON.DASHBOARD_OVERVIEW })}
        onNavigateSettings={() => navigate({ to: ApplicationRouteCON.DASHBOARD_SETTINGS })}
        onSignOut={() => {
          LoginScreenService.current.clearSession();
          navigate({ to: ApplicationRouteCON.LOGIN });
        }}
      />
    );
  },
});

// ==========================================
// 4. Construct Router Tree
// ==========================================
const routeTree = rootRoute.addChildren([
  indexRoute,
  loginRoute,
  signupRoute,
  forgotPasswordRoute,
  devDashboardRoute,
  dashboardLayoutRoute.addChildren([
    dashboardOverviewRoute,
    assetInventoryRoute,
    employeesRoute,
    softwareLicensesRoute,
    cloudInfrastructureRoute,
    procurementRoute,
    serviceDeskRoute,
    vendorsRoute,
    complianceRoute,
    verificationCampaignRoute,
    aiCopilotRoute,
    analyticsRoute,
    settingsRoute,
  ]),
]);

export const applicationRouter = createRouter({
  routeTree,
  defaultPreload: 'intent',
  defaultViewTransition: true,
});

declare module '@tanstack/react-router' {
  interface Register {
    router: typeof applicationRouter;
  }
}

export default function ApplicationRouter(): React.JSX.Element {
  return <RouterProvider router={applicationRouter} />;
}
