import {
  LayoutDashboard,
  Laptop,
  Users,
  UserCheck,
  ShieldCheck,
  Building2,
  HelpCircle,
  BarChart3,
  Bot,
  KeyRound,
  Cloud,
  QrCode,
  Layers,
  Wrench,
} from 'lucide-react';
import { TabType } from '../../../Types/NavigationType';

export default class NavigationCON {
  public static readonly BRAND_TITLE: string = 'AssetSphere';
  public static readonly BRAND_SUBTITLE: string = 'Enterprise ITAM';

  public static readonly NAV_ITEMS = [
    { id: 'dashboard' as TabType, label: 'Dashboard', icon: LayoutDashboard, category: 'Core', description: 'Real-time portfolio KPIs & valuation overview' },
    { id: 'inventory' as TabType, label: 'Asset Inventory', icon: Laptop, category: 'Core', description: 'Track and manage the full hardware fleet' },
    { id: 'licenses' as TabType, label: 'Software Licenses', icon: KeyRound, category: 'Core', description: 'Manage entitlements, seats & renewal compliance' },
    { id: 'cloud' as TabType, label: 'Cloud Infrastructure', icon: Cloud, category: 'Core', description: 'Track cloud resources & virtual assets' },
    { id: 'employees' as TabType, label: 'Employees & People', icon: Users, category: 'Organization', description: 'Organization directory & asset assignments' },
    { id: 'user_requests' as TabType, label: 'User Requests', icon: UserCheck, category: 'Organization', description: 'Review and approve pending account signups' },
    { id: 'procurement' as TabType, label: 'Procurement & POs', icon: Building2, category: 'Organization', description: 'Purchase orders & vendor procurement pipeline' },
    { id: 'vendors' as TabType, label: 'Vendors & SLAs', icon: Layers, category: 'Organization', description: 'Supplier profiles, ratings & contract terms' },
    { id: 'servicedesk' as TabType, label: 'Service Desk & Tickets', icon: HelpCircle, category: 'Operations', description: 'Repair tickets & asset incident tracking' },
    { id: 'device_service_requests' as TabType, label: 'Device Service Request', icon: Wrench, category: 'Operations', description: 'Submit and track IT service requests' },
    { id: 'compliance' as TabType, label: 'Security & Compliance', icon: ShieldCheck, category: 'Operations', description: 'Regulatory frameworks & compliance status' },
    { id: 'verification' as TabType, label: 'Physical Audit Campaign', icon: QrCode, category: 'Operations', description: 'QR-based physical asset verification sweeps' },
    { id: 'ai_assistant' as TabType, label: 'AI Enterprise Copilot', icon: Bot, category: 'Intelligence', badge: 'Gemini', description: 'AI-powered cost & optimization recommendations' },
    { id: 'analytics' as TabType, label: 'Analytics & Risk Models', icon: BarChart3, category: 'Intelligence', description: 'Financial analytics & portfolio risk models' },
  ];
}
