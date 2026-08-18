import React, { useState, useEffect } from 'react';
import {
  mockAssets,
  mockEmployees,
  mockSoftwareLicenses,
  mockPurchaseOrders,
  mockServiceTickets,
  mockVendors,
  mockAIRecommendations,
  mockVerificationCampaigns,
} from './data/mockAssets';
import { Asset, Employee, SoftwareLicense, PurchaseOrder, ServiceTicket, Vendor } from './types';
import ApplicationThemeUtility from './Utilities/ApplicationThemeUtility';
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
import BadgeSharedComponent from './Shared/Components/BadgeSharedComponent';

export default function App(): React.JSX.Element {
  // Theme State
  const [currentTheme, setCurrentTheme] = useState<string>(() =>
    ApplicationThemeUtility.current.getSavedTheme()
  );

  useEffect(() => {
    ApplicationThemeUtility.current.applyTheme(currentTheme);
  }, [currentTheme]);

  const handleToggleTheme = () => {
    const next = ApplicationThemeUtility.current.toggleTheme(currentTheme);
    setCurrentTheme(next);
  };

  // Portfolio State
  const [assets, setAssets] = useState<Asset[]>(mockAssets);
  const [employees, setEmployees] = useState<Employee[]>(mockEmployees);
  const [licenses, setLicenses] = useState<SoftwareLicense[]>(mockSoftwareLicenses);
  const [orders, setOrders] = useState<PurchaseOrder[]>(mockPurchaseOrders);
  const [tickets, setTickets] = useState<ServiceTicket[]>(mockServiceTickets);
  const [vendors, setVendors] = useState<Vendor[]>(mockVendors);
  const [recommendations, setRecommendations] = useState(mockAIRecommendations);
  const [campaign, setCampaign] = useState(mockVerificationCampaigns[0]);

  // Navigation State
  const [activeTab, setActiveTab] = useState<TabType>('dashboard');
  const [globalSearch, setGlobalSearch] = useState('');
  const [deploymentMode, setDeploymentMode] = useState<
    'Self-Hosted Air-Gapped' | 'Enterprise Cloud Sync'
  >('Self-Hosted Air-Gapped');

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
      setAssets((prev) =>
        prev.map((a) => (a.id === assetFormState.initialAsset?.id ? ({ ...a, ...assetData } as Asset) : a))
      );
    } else {
      setAssets((prev) => [assetData as Asset, ...prev]);
    }
    setAssetFormState({ isOpen: false, initialAsset: null });
  };

  const handleVerifyAsset = (assetId: string) => {
    setCampaign((prev) => ({
      ...prev,
      verifiedAssetsCount: Math.min(prev.verifiedAssetsCount + 1, prev.totalTargetAssets),
    }));
  };

  const handleExportCSV = () => {
    ExportUtility.current.exportAssetsToCSV(assets);
  };

  const handleToggleDeploymentMode = () => {
    setDeploymentMode((prev) =>
      prev === 'Self-Hosted Air-Gapped' ? 'Enterprise Cloud Sync' : 'Self-Hosted Air-Gapped'
    );
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
      onToggleNotifications={() => setIsNotificationsOpen(!isNotificationsOpen)}
      unreadAlertCount={unreadAlertCount}
    >
      {/* Tab Screen Routing */}
      {activeTab === 'dashboard' && (
        <DashboardScreenController
          assets={assets}
          tickets={tickets}
          recommendations={recommendations}
          campaign={campaign}
          onSelectAsset={setSelectedAssetForDetail}
          onOpenAIAssistant={() => setActiveTab('ai-assistant')}
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

      {/* Modals */}
      <AssetDetailModalController
        asset={selectedAssetForDetail}
        onClose={() => setSelectedAssetForDetail(null)}
        onOpenQRBadgeModal={setSelectedAssetForQR}
        onEditAsset={(ast) => {
          setSelectedAssetForDetail(null);
          setAssetFormState({ isOpen: true, initialAsset: ast });
        }}
      />

      <AssetFormModalController
        isOpen={assetFormState.isOpen}
        initialAsset={assetFormState.initialAsset}
        onSave={handleSaveAsset}
        onClose={() => setAssetFormState({ isOpen: false, initialAsset: null })}
      />

      <QRBadgeModalController
        asset={selectedAssetForQR}
        onClose={() => setSelectedAssetForQR(null)}
      />

      <QRScannerModalController
        isOpen={isQRScannerOpen}
        onClose={() => setIsQRScannerOpen(false)}
        onVerifyAsset={handleVerifyAsset}
        assets={assets}
      />

      {/* Notifications Drawer Modal */}
      <ModalSharedComponent
        isOpen={isNotificationsOpen}
        onClose={() => setIsNotificationsOpen(false)}
        title="Enterprise Alerts & Security Notifications"
        subtitle={`${unreadAlertCount} critical issues requiring attention`}
        maxWidth="md"
      >
        <div className="space-y-3 text-xs">
          {nonCompliantCount > 0 && (
            <div className="p-3 rounded-lg bg-rose-500/10 border border-rose-500/20 text-rose-700 dark:text-rose-300">
              <div className="font-semibold mb-1">Security Audit Flags</div>
              <p>{nonCompliantCount} endpoints failed BitLocker encryption or EDR agent checks.</p>
            </div>
          )}

          {openTicketCount > 0 && (
            <div className="p-3 rounded-lg bg-amber-500/10 border border-amber-500/20 text-amber-700 dark:text-amber-300">
              <div className="font-semibold mb-1">Service Desk Queue</div>
              <p>{openTicketCount} hardware maintenance repair tickets pending resolution.</p>
            </div>
          )}
        </div>
      </ModalSharedComponent>
    </NavigationController>
  );
}
