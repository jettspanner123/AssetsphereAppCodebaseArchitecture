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
    { id: 'dashboard' as TabType, label: 'Dashboard', icon: LayoutDashboard, category: 'Core' },
    { id: 'inventory' as TabType, label: 'Asset Inventory', icon: Laptop, category: 'Core' },
    { id: 'licenses' as TabType, label: 'Software Licenses', icon: KeyRound, category: 'Core' },
    { id: 'cloud' as TabType, label: 'Cloud Infrastructure', icon: Cloud, category: 'Core' },
    { id: 'employees' as TabType, label: 'Employees & People', icon: Users, category: 'Organization' },
    { id: 'user_requests' as TabType, label: 'User Requests', icon: UserCheck, category: 'Organization' },
    { id: 'procurement' as TabType, label: 'Procurement & POs', icon: Building2, category: 'Organization' },
    { id: 'vendors' as TabType, label: 'Vendors & SLAs', icon: Layers, category: 'Organization' },
    { id: 'servicedesk' as TabType, label: 'Service Desk & Tickets', icon: HelpCircle, category: 'Operations' },
    { id: 'device_service_requests' as TabType, label: 'Device Service Request', icon: Wrench, category: 'Operations' },
    { id: 'compliance' as TabType, label: 'Security & Compliance', icon: ShieldCheck, category: 'Operations' },
    { id: 'verification' as TabType, label: 'Physical Audit Campaign', icon: QrCode, category: 'Operations' },
    { id: 'ai_assistant' as TabType, label: 'AI Enterprise Copilot', icon: Bot, category: 'Intelligence', badge: 'Gemini' },
    { id: 'analytics' as TabType, label: 'Analytics & Risk Models', icon: BarChart3, category: 'Intelligence' },
  ];
}
