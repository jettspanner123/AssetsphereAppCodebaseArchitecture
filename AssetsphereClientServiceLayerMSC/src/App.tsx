import React, { useState, useEffect } from 'react';
import MockDataSeederService from './services/MockDataSeederService';
import { Asset, Employee, SoftwareLicense, PurchaseOrder, ServiceTicket, Vendor } from './types';
import ApplicationThemeUtility from './Utilities/ApplicationThemeUtility';
import UserPreferencesUtility from './Utilities/UserPreferencesUtility';
import ExportUtility from './Utilities/ExportUtility';
import { TabType } from './components/Sidebar';

// Feature Controllers
import NavigationController from './Features/Navigation/NavigationController';
import DashboardScreenController from './Features/Dashboard/DashboardScreenController';
import AssetInventoryScreenController from './Features/AssetInventory/AssetInventoryScreenController';
import AssetDetailModalController from './Features/AssetDetail/AssetDetailModalController';
import AssetFormModalController from './Features/AssetForm/AssetFormModalController';
import AIAssistantScreenController from './Features/AIAssistant/AIAssistantScreenController';
import EmployeesScreenController from './Features/Employees/EmployeesScreenController';
import SoftwareLicensesScreenController from './Features/SoftwareLicenses/SoftwareLicensesScreenController';
import CloudInfrastructureScreenController from './Features/CloudInfrastructure/CloudInfrastructureScreenController';
import ProcurementScreenController from './Features/Procurement/ProcurementScreenController';
import ServiceDeskScreenController from './Features/ServiceDesk/ServiceDeskScreenController';
import VendorsScreenController from './Features/Vendors/VendorsScreenController';
import ComplianceScreenController from './Features/Compliance/ComplianceScreenController';
import VerificationCampaignScreenController from './Features/VerificationCampaign/VerificationCampaignScreenController';
import AnalyticsScreenController from './Features/Analytics/AnalyticsScreenController';
import SettingsScreenController from './Features/Settings/SettingsScreenController';
import QRBadgeModalController from './Features/QRScanner/QRBadgeModalController';
import QRScannerModalController from './Features/QRScanner/QRScannerModalController';
import ModalSharedComponent from './Shared/Components/ModalSharedComponent';

export default function App(): React.JSX.Element {
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

  // Show Mock Data Toggle State (Persisted via UserPreferencesUtility)
  const [showMockData, setShowMockDataState] = useState<boolean>(() =>
    UserPreferencesUtility.current.getShowMockData(true)
  );

  const handleToggleShowMockData = () => {
    const next = !showMockData;
    setShowMockDataState(next);
    UserPreferencesUtility.current.setShowMockData(next);
  };

  // Portfolio State Sourced from MockDataSeederService
  const [mockAssetsList, setMockAssetsList] = useState<Asset[]>(() => MockDataSeederService.current.getAssets());

  const assets = showMockData ? mockAssetsList : [];
  const employees = showMockData ? MockDataSeederService.current.getEmployees() : [];
  const licenses = showMockData ? MockDataSeederService.current.getSoftwareLicenses() : [];
  const orders = showMockData ? MockDataSeederService.current.getPurchaseOrders() : [];
  const tickets = showMockData ? MockDataSeederService.current.getServiceTickets() : [];
  const vendors = showMockData ? MockDataSeederService.current.getVendors() : [];
  const recommendations = showMockData ? MockDataSeederService.current.getAIRecommendations() : [];
  const campaign = showMockData ? MockDataSeederService.current.getVerificationCampaigns()[0] : {
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

  // Navigation State with localStorage Persistence
  const [activeTab, setActiveTabState] = useState<TabType>(() =>
    UserPreferencesUtility.current.getActiveTab('dashboard')
  );
  const [globalSearch, setGlobalSearch] = useState('');
  const [deploymentMode, setDeploymentMode] = useState<
    'Self-Hosted Air-Gapped' | 'Enterprise Cloud Sync'
  >('Self-Hosted Air-Gapped');

  const setActiveTab = (tab: TabType) => {
    setActiveTabState(tab);
    UserPreferencesUtility.current.setActiveTab(tab);
  };

  // Modal States
  const [selectedAssetForDetail, setSelectedAssetForDetail] = useState<Asset | null>(null);
  const [selectedAssetForQR, setSelectedAssetForQR] = useState<Asset | null>(null);
  const [assetFormState, setAssetFormState] = useState<{
    isOpen: boolean;
    initialAsset: Asset | null;
  }>({ isOpen: false, initialAsset: null });
  const [isQRScannerOpen, setIsQRScannerOpen] = useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);

  // Unread Count
  const nonCompliantCount = assets.filter((a) => !a.security?.isCompliant).length;
  const openTicketCount = tickets.filter((t) => t.status !== 'Closed' && t.status !== 'Resolved').length;
  const unreadAlertCount = nonCompliantCount + openTicketCount;

  // Handlers
  const handleSaveAsset = (assetData: Partial<Asset>) => {
    if (assetFormState.initialAsset) {
      setMockAssetsList((prev) =>
        prev.map((a) => (a.id === assetFormState.initialAsset?.id ? ({ ...a, ...assetData } as Asset) : a))
      );
    } else {
      const newAsset: Asset = {
        id: Date.now().toString(),
        assetNumber: `AST-${Math.floor(10000 + Math.random() * 90000)}`,
        barcodeValue: `BAR-${Date.now()}`,
        serialNumber: assetData.serialNumber || `SN-${Date.now()}`,
        companyTag: 'AST-TAG',
        hostname: assetData.hostname || 'HOST-NEW',
        deviceName: assetData.deviceName || 'New Asset',
        category: (assetData.category || 'Computing') as any,
        subtype: (assetData.subtype || 'Laptop') as any,
        manufacturer: assetData.manufacturer || 'Generic',
        brand: 'Generic',
        model: assetData.model || 'Standard',
        productFamily: 'Enterprise',
        sku: 'SKU-100',
        releaseYear: 2026,
        lifecycleStatus: (assetData.lifecycleStatus || 'In Store') as any,
        department: assetData.department || 'IT',
        businessUnit: 'Global IT',
        costCenter: 'CC-100',
        currentLocation: assetData.currentLocation || 'HQ Warehouse',
        assignedToEmployeeName: assetData.assignedToEmployeeName,
        currentValue: (assetData as any).purchaseCost || 0,
        depreciationMethod: 'Straight Line',
        usefulLifeYears: 4,
        salvageValue: 100,
        totalCostOfOwnership: (assetData as any).purchaseCost || 0,
        timeline: [],
        chainOfCustody: [],
        procurement: {
          purchaseDate: new Date().toISOString().split('T')[0],
          purchaseOrderNo: `PO-2026-${Math.floor(100 + Math.random() * 900)}`,
          vendorName: 'Direct Order',
          invoiceNo: 'INV-100',
          invoiceDate: '2026-01-01',
          purchaseCost: (assetData as any).purchaseCost || 0,
          gstPct: 18,
          currency: 'USD',
          budgetCode: 'BUD-100',
          costCenter: 'CC-100',
          isCapitalized: true,
          procurementMethod: 'Direct Purchase',
        },
        warranty: {
          warrantyStart: '2026-01-01',
          warrantyEnd: '2029-01-01',
          hasExtendedWarranty: true,
          vendorContactName: 'Vendor Support',
          supportPhone: '1-800-555-0199',
          slaDetails: '24/7 SLA',
          responseTimeHours: 4,
          escalationContact: 'support@vendor.com',
        },
        network: {
          officeLocation: 'HQ Warehouse',
          switchPort: 'Gi1/0/1',
        },
        health: {
          overallScore: 100,
          deviceAgeMonths: 1,
          repairCount: 0,
          warrantyStatus: 'Active',
          downtimeHoursTotal: 0,
          performanceIndex: 99,
          securityCompliancePct: 100,
        },
        security: {
          antivirusStatus: 'Active',
          vpnClientStatus: 'Installed',
          bitlockerEnabled: true,
          encryptionStatus: 'Encrypted',
          patchLevel: 'Latest',
          securityBaselineScore: 100,
          complianceScore: 100,
          isCompliant: true,
        },
      };
      setMockAssetsList((prev) => [newAsset, ...prev]);
    }
    setAssetFormState({ isOpen: false, initialAsset: null });
  };

  const handleToggleDeploymentMode = () => {
    setDeploymentMode((prev) =>
      prev === 'Self-Hosted Air-Gapped' ? 'Enterprise Cloud Sync' : 'Self-Hosted Air-Gapped'
    );
  };

  const handleExportCSV = () => {
    ExportUtility.current.exportAssetsToCSV(assets);
  };

  return (
    <NavigationController
      activeTab={activeTab}
      onSelectTab={setActiveTab}
      globalSearch={globalSearch}
      onSearchChange={setGlobalSearch}
      onOpenNewAsset={() => setAssetFormState({ isOpen: true, initialAsset: null })}
      onOpenScanner={() => setIsQRScannerOpen(true)}
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
    >
      {/* Tab Screen Routing */}
      {activeTab === 'dashboard' && (
        <DashboardScreenController
          assets={assets}
          tickets={tickets}
          recommendations={recommendations}
          campaign={campaign}
          onSelectAsset={setSelectedAssetForDetail}
          onOpenAIAssistant={() => setActiveTab('ai-assistant' as TabType)}
          onNavigateTab={setActiveTab}
        />
      )}

      {activeTab === 'assets' && (
        <AssetInventoryScreenController
          assets={assets}
          onSelectAsset={setSelectedAssetForDetail}
          onOpenAddModal={() => setAssetFormState({ isOpen: true, initialAsset: null })}
          onOpenQRBadgeModal={setSelectedAssetForQR}
          onExportCSV={handleExportCSV}
        />
      )}

      {activeTab === 'ai-assistant' && (
        <AIAssistantScreenController assets={assets} />
      )}

      {activeTab === 'employees' && (
        <EmployeesScreenController employees={employees} assets={assets} />
      )}

      {activeTab === 'software' && (
        <SoftwareLicensesScreenController licenses={licenses} />
      )}

      {activeTab === 'cloud' && (
        <CloudInfrastructureScreenController />
      )}

      {activeTab === 'procurement' && (
        <ProcurementScreenController orders={orders} />
      )}

      {activeTab === 'servicedesk' && (
        <ServiceDeskScreenController tickets={tickets} />
      )}

      {activeTab === 'vendors' && (
        <VendorsScreenController vendors={vendors} />
      )}

      {activeTab === 'compliance' && (
        <ComplianceScreenController assets={assets} />
      )}

      {activeTab === 'campaign' && (
        <VerificationCampaignScreenController
          campaign={campaign}
          onOpenScanner={() => setIsQRScannerOpen(true)}
        />
      )}

      {activeTab === 'analytics' && (
        <AnalyticsScreenController assets={assets} />
      )}

      {activeTab === 'settings' && (
        <SettingsScreenController
          deploymentMode={deploymentMode}
          onToggleDeploymentMode={handleToggleDeploymentMode}
          currentTheme={currentTheme}
          onToggleTheme={handleToggleTheme}
        />
      )}

      {/* Global Asset Detail Modal */}
      <AssetDetailModalController
        asset={selectedAssetForDetail}
        onClose={() => setSelectedAssetForDetail(null)}
        onOpenQRBadgeModal={(ast) => {
          setSelectedAssetForDetail(null);
          setSelectedAssetForQR(ast);
        }}
        onEditAsset={(ast) => {
          setSelectedAssetForDetail(null);
          setAssetFormState({ isOpen: true, initialAsset: ast });
        }}
      />

      {/* Global Asset Form Modal */}
      <AssetFormModalController
        isOpen={assetFormState.isOpen}
        onClose={() => setAssetFormState({ isOpen: false, initialAsset: null })}
        onSave={handleSaveAsset}
        initialAsset={assetFormState.initialAsset}
      />

      {/* QR Badge Modal */}
      <QRBadgeModalController
        asset={selectedAssetForQR}
        onClose={() => setSelectedAssetForQR(null)}
      />

      {/* QR Scanner Modal */}
      <QRScannerModalController
        isOpen={isQRScannerOpen}
        onClose={() => setIsQRScannerOpen(false)}
        assets={assets}
        onVerifyAsset={(assetId) => {
          const found = assets.find((a) => a.id === assetId);
          if (found) {
            setSelectedAssetForDetail(found);
          }
        }}
      />

    </NavigationController>
  );
}
