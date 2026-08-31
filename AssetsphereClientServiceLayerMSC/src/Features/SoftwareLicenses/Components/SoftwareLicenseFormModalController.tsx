import React, { useState, useMemo } from 'react';
import { SoftwareLicense, CreateSoftwareLicenseRequest } from '../../../Types/SoftwareLicenseType';
import ModalSharedComponent from '../../../Shared/Components/ModalSharedComponent';
import ButtonSharedComponent from '../../../Shared/Components/ButtonSharedComponent';
import CustomSelectSharedComponent, { SelectOption } from '../../../Shared/Components/CustomSelectSharedComponent';
import EmptyStateSharedComponent from '../../../Shared/Components/EmptyStateSharedComponent';
import TanstackQueryClientService from '../../../Services/TanstackQueryClientService';
import {
  KeyRound,
  Building,
  DollarSign,
  Calendar,
  Layers,
  Sparkles,
  CheckCircle2,
  Users,
  Search,
  ArrowRight,
  ArrowLeft,
  UserCheck,
  ShieldCheck,
  Check,
  X,
} from 'lucide-react';
import { toast } from 'sonner';

export interface SoftwareLicenseFormModalControllerProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: (license: SoftwareLicense) => void;
  zIndex?: number;
}

const CATEGORY_OPTIONS: SelectOption[] = [
  { value: 'Productivity & Collaboration', label: 'Productivity & Collaboration', sublabel: 'Office, Email, Chat & Docs' },
  { value: 'Development IDEs', label: 'Development IDEs', sublabel: 'Compilers, IDEs & SDK Toolchains' },
  { value: 'Security & Compliance', label: 'Security & Compliance', sublabel: 'EDR, IAM, SIEM & Vulnerability' },
  { value: 'Design & Creative', label: 'Design & Creative', sublabel: 'UI/UX, 3D Modeling & Media Suite' },
  { value: 'Cloud & Infrastructure', label: 'Cloud & Infrastructure', sublabel: 'Cloud Platforms & Virtualization' },
  { value: 'Operations & Support', label: 'Operations & Support', sublabel: 'ITSM, Monitoring & Service Desk' },
  { value: 'Other', label: 'Other', sublabel: 'Specialized Enterprise Utilities' },
];

const LICENSE_TYPE_OPTIONS: SelectOption[] = [
  { value: 'Enterprise Subscription', label: 'Enterprise Subscription', sublabel: 'Annual / Multi-Year Cloud SaaS' },
  { value: 'Named User', label: 'Named User', sublabel: 'Directly Bound to Verified Employee' },
  { value: 'Floating', label: 'Floating / Concurrent', sublabel: 'Shared License Pool Across Org' },
  { value: 'Per Core', label: 'Per Core / CPU', sublabel: 'Server Compute Core Licensing' },
  { value: 'Perpetual', label: 'Perpetual / Lifetime', sublabel: 'Perpetual Software Purchase' },
];

const CURRENCY_OPTIONS: SelectOption[] = [
  { value: 'USD', label: 'USD - United States Dollar ($)' },
  { value: 'INR', label: 'INR - Indian Rupee (₹)' },
  { value: 'EUR', label: 'EUR - Euro (€)' },
  { value: 'GBP', label: 'GBP - British Pound (£)' },
];

export default function SoftwareLicenseFormModalController({
  isOpen,
  onClose,
  onSuccess,
  zIndex = 60,
}: SoftwareLicenseFormModalControllerProps): React.JSX.Element {
  // Wizard step state (Step 1: Terms & Commercials, Step 2: Assign Employees)
  const [currentStep, setCurrentStep] = useState<1 | 2>(1);
  const [exitDirection, setExitDirection] = useState<'down' | 'up'>('down');

  const prevIsOpenRef = React.useRef(isOpen);
  React.useEffect(() => {
    if (isOpen && !prevIsOpenRef.current) {
      setExitDirection('down');
      setCurrentStep(1);
    }
    prevIsOpenRef.current = isOpen;
  }, [isOpen]);

  // Query enterprise departments configured in system
  const { data: designationsMap = {
    Engineering: ['Software Engineer'],
    'Security Operations': ['SecOps Engineer'],
    'Product Design': ['Product Designer'],
    Operations: ['Operations Manager'],
    'IT & Infrastructure': ['IT Administrator'],
    'Finance & Procurement': ['Finance Analyst'],
    'Human Resources': ['HR Specialist'],
    'Legal & Compliance': ['Compliance Officer'],
  } } = TanstackQueryClientService.current.configuration.useDesignationsQuery();

  // Query live employees roster from database
  const { data: employees = [], isLoading: isLoadingEmployees } =
    TanstackQueryClientService.current.employees.useEmployeesQuery();

  const createLicenseMutation =
    TanstackQueryClientService.current.softwareLicenses.useCreateSoftwareLicenseMutation();

  const defaultDepartments = useMemo(() => {
    const keys = Object.keys(designationsMap);
    return keys.length > 0
      ? keys
      : [
          'Engineering',
          'Security Operations',
          'Product Design',
          'Operations',
          'IT & Infrastructure',
          'Finance & Procurement',
        ];
  }, [designationsMap]);

  // Section 1: Software Identity & Publisher
  const [softwareName, setSoftwareName] = useState('');
  const [publisher, setPublisher] = useState('');
  const [version, setVersion] = useState('2026 Enterprise');
  const [category, setCategory] = useState('Productivity & Collaboration');

  // Section 2: Licensing Model & Seat Capacity
  const [licenseType, setLicenseType] = useState('Enterprise Subscription');
  const [totalSeats, setTotalSeats] = useState<number>(100);
  const [licenseKey, setLicenseKey] = useState('');

  // Section 3: Commercials & Expiration
  const [costPerSeat, setCostPerSeat] = useState<number>(240);
  const [currency, setCurrency] = useState<'USD' | 'INR' | 'EUR' | 'GBP'>('USD');
  const [purchaseDate, setPurchaseDate] = useState(() => new Date().toISOString().split('T')[0]);
  const [expiryDate, setExpiryDate] = useState(() => {
    const d = new Date();
    d.setFullYear(d.getFullYear() + 1);
    return d.toISOString().split('T')[0];
  });

  // Section 4: Department Allocations
  const [selectedDepartments, setSelectedDepartments] = useState<string[]>(['Engineering', 'Operations']);

  // Step 2: Employee Assignment State
  const [selectedEmployeeIds, setSelectedEmployeeIds] = useState<string[]>([]);
  const [employeeSearchQuery, setEmployeeSearchQuery] = useState('');
  const [employeeDepartmentFilter, setEmployeeDepartmentFilter] = useState('ALL');

  // Validation State
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Auto-calculated Annual Cost
  const calculatedAnnualCost = Math.round((Number(totalSeats) || 0) * (Number(costPerSeat) || 0));

  // Dynamic Allocated Seats directly synced with selected employees count
  const assignedSeatsCount = selectedEmployeeIds.length;

  // Auto-computed Compliance Status
  const computedCompliance = useMemo(() => {
    if (!expiryDate) return 'Compliant';
    const expTime = new Date(expiryDate).getTime();
    const nowTime = new Date().getTime();
    const thirtyDaysMs = 30 * 24 * 60 * 60 * 1000;

    if (expTime - nowTime < thirtyDaysMs && expTime >= nowTime) {
      return 'Expiring Soon';
    }
    if (expTime < nowTime) {
      return 'Over Allocated';
    }
    if (assignedSeatsCount > totalSeats) {
      return 'Over Allocated';
    }
    if (totalSeats > 0 && assignedSeatsCount < totalSeats * 0.3) {
      return 'Under Utilized';
    }
    return 'Compliant';
  }, [expiryDate, assignedSeatsCount, totalSeats]);

  const handleSetExpiryYears = (years: number) => {
    const base = purchaseDate ? new Date(purchaseDate) : new Date();
    base.setFullYear(base.getFullYear() + years);
    setExpiryDate(base.toISOString().split('T')[0]);
  };

  const handleToggleDepartment = (dept: string) => {
    setSelectedDepartments((prev) =>
      prev.includes(dept) ? prev.filter((d) => d !== dept) : [...prev, dept]
    );
  };

  const handleSelectAllDepartments = () => {
    setSelectedDepartments(defaultDepartments);
  };

  const handleClearDepartments = () => {
    setSelectedDepartments([]);
  };

  const handleGenerateLicenseKey = () => {
    const prefix = softwareName
      ? softwareName.replace(/[^a-zA-Z]/g, '').substring(0, 4).toUpperCase()
      : 'LIC';
    const seg1 = Math.random().toString(36).substring(2, 6).toUpperCase();
    const seg2 = Math.random().toString(36).substring(2, 6).toUpperCase();
    const seg3 = Math.floor(1000 + Math.random() * 9000);
    setLicenseKey(`${prefix}-${seg1}-${seg2}-${seg3}`);
  };

  const validateStep1 = (): boolean => {
    const errs: Record<string, string> = {};

    if (!softwareName.trim()) {
      errs.softwareName = 'Software name is required.';
    }
    if (!publisher.trim()) {
      errs.publisher = 'Publisher / vendor is required.';
    }
    if (!licenseKey.trim()) {
      errs.licenseKey = 'License key / agreement ID is required.';
    }
    if (totalSeats <= 0 || isNaN(totalSeats)) {
      errs.totalSeats = 'Total seat capacity must be at least 1.';
    }
    if (costPerSeat < 0 || isNaN(costPerSeat)) {
      errs.costPerSeat = 'Cost per seat cannot be negative.';
    }
    if (!expiryDate) {
      errs.expiryDate = 'Expiration / renewal date is required.';
    }

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleProceedToStep2 = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateStep1()) {
      setCurrentStep(2);
    } else {
      toast.error('Validation Error', {
        description: 'Please review and resolve the highlighted fields before assigning employee seats.',
      });
    }
  };

  // Step 2: Employee Filtering Logic
  const departmentFilterOptions: SelectOption[] = useMemo(() => {
    const opts: SelectOption[] = [{ value: 'ALL', label: 'All Departments' }];
    defaultDepartments.forEach((dept) => {
      opts.push({ value: dept, label: dept });
    });
    return opts;
  }, [defaultDepartments]);

  const filteredEmployees = useMemo(() => {
    return employees.filter((emp) => {
      if (employeeDepartmentFilter !== 'ALL' && emp.department !== employeeDepartmentFilter) {
        return false;
      }
      if (!employeeSearchQuery.trim()) return true;
      const q = employeeSearchQuery.toLowerCase();
      return (
        emp.name.toLowerCase().includes(q) ||
        emp.email.toLowerCase().includes(q) ||
        (emp.designation && emp.designation.toLowerCase().includes(q)) ||
        (emp.department && emp.department.toLowerCase().includes(q))
      );
    });
  }, [employees, employeeDepartmentFilter, employeeSearchQuery]);

  const handleToggleEmployee = (empId: string) => {
    setSelectedEmployeeIds((prev) => {
      if (prev.includes(empId)) {
        return prev.filter((id) => id !== empId);
      } else {
        if (prev.length >= totalSeats) {
          toast.warning('Seat Capacity Limit Reached', {
            description: `You have reached the maximum seat capacity of ${totalSeats} seats. Deselect another employee or increase capacity.`,
          });
          return prev;
        }
        return [...prev, empId];
      }
    });
  };

  const handleSelectAllVisible = () => {
    const visibleIds = filteredEmployees.map((e) => e.id);
    setSelectedEmployeeIds((prev) => {
      const set = new Set(prev);
      let added = 0;
      for (const id of visibleIds) {
        if (set.size >= totalSeats) {
          toast.warning('Seat Capacity Limit Reached', {
            description: `Assigned maximum allowed limit of ${totalSeats} seats.`,
          });
          break;
        }
        if (!set.has(id)) {
          set.add(id);
          added++;
        }
      }
      if (added > 0) {
        toast.info(`Assigned ${added} Employee Seats`, {
          description: `Total selected: ${set.size} / ${totalSeats} seats.`,
        });
      }
      return Array.from(set);
    });
  };

  const handleClearSelectedEmployees = () => {
    setSelectedEmployeeIds([]);
  };

  const handleSubmitFinal = async (e: React.FormEvent) => {
    e.preventDefault();

    const selectedEmployeesList = employees
      .filter((emp) => selectedEmployeeIds.includes(emp.id))
      .map((emp) => ({
        id: emp.id,
        name: emp.name,
        email: emp.email,
        department: emp.department,
        designation: emp.designation,
      }));

    const payload: CreateSoftwareLicenseRequest = {
      softwareName: softwareName.trim(),
      publisher: publisher.trim(),
      version: version.trim(),
      category: category.trim(),
      licenseType,
      licenseKey: licenseKey.trim(),
      totalSeats: Number(totalSeats),
      assignedSeats: selectedEmployeeIds.length,
      costPerSeat: Number(costPerSeat),
      annualCost: calculatedAnnualCost,
      currency,
      purchaseDate,
      expiryDate,
      complianceStatus: computedCompliance,
      assignedDepartmentsJson: JSON.stringify(selectedDepartments),
      assignedUsersJson: JSON.stringify(selectedEmployeesList),
    };

    try {
      const createdLicense = await createLicenseMutation.mutateAsync(payload);
      toast.success('Subscription Registered Successfully', {
        description: `${createdLicense.softwareName} registered with ${createdLicense.totalSeats} seats (${selectedEmployeeIds.length} employees assigned).`,
      });

      if (onSuccess) {
        onSuccess(createdLicense);
      }
      setExitDirection('up');
      setTimeout(() => {
        setCurrentStep(1);
        onClose();
      }, 0);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Failed to register software license.';
      toast.error('Failed to Register Subscription', {
        description: msg,
      });
    }
  };

  const handleModalClose = () => {
    setExitDirection('up');
    setTimeout(() => {
      setCurrentStep(1);
      onClose();
    }, 0);
  };

  return (
    <ModalSharedComponent
      isOpen={isOpen}
      onClose={onClose}
      exitDirection={exitDirection}
      zIndex={zIndex}
      title="Register Software Subscription"
      subtitle={
        currentStep === 1
          ? 'Step 1 of 2: Enter contract terms, seat capacity, and financial allocations'
          : `Step 2 of 2: Assign employee seats for ${softwareName || 'Software License'}`
      }
      maxWidth="3xl"
    >
      {/* 2-Step Progress Indicator Header */}
      <div className="flex items-center justify-between pb-4 mb-5 border-b border-slate-100 dark:border-zinc-800 text-xs">
        <div className="flex items-center gap-3">
          {/* Step 1 Pill */}
          <button
            type="button"
            onClick={() => setCurrentStep(1)}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-lg font-mono font-semibold transition-all cursor-pointer ${
              currentStep === 1
                ? 'bg-[#0C2086] text-white shadow-2xs'
                : 'bg-slate-100 dark:bg-zinc-800 text-slate-600 dark:text-zinc-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <span className="w-4 h-4 rounded-full bg-white/20 flex items-center justify-center text-[10px]">
              1
            </span>
            <span>Software Terms & Commercials</span>
          </button>

          <span className="text-slate-300 dark:text-zinc-700 font-mono">→</span>

          {/* Step 2 Pill */}
          <button
            type="button"
            onClick={() => {
              if (validateStep1()) {
                setCurrentStep(2);
              }
            }}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-lg font-mono font-semibold transition-all ${
              currentStep === 2
                ? 'bg-[#0C2086] text-white shadow-2xs cursor-pointer'
                : 'bg-slate-100 dark:bg-zinc-800 text-slate-400 dark:text-zinc-500 cursor-pointer'
            }`}
          >
            <span className="w-4 h-4 rounded-full bg-white/20 flex items-center justify-center text-[10px]">
              2
            </span>
            <span>Assign Employee Seats ({selectedEmployeeIds.length}/{totalSeats})</span>
          </button>
        </div>

        <span className="text-[11px] font-mono text-slate-400 hidden sm:inline-block">
          Step {currentStep} of 2
        </span>
      </div>

      {/* ================= STEP 1: SOFTWARE TERMS & SPECS ================= */}
      {currentStep === 1 && (
        <form onSubmit={handleProceedToStep2} className="space-y-6 pb-2">
          {/* Section 1: Software Identity & Publisher Info */}
          <div className="space-y-4">
            <h4 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider font-mono flex items-center gap-1.5 pb-2 border-b border-slate-100 dark:border-zinc-800">
              <KeyRound className="w-3.5 h-3.5 text-blue-500" />
              1. Software Identity & Vendor Specification
            </h4>

            {/* Row 1: Software / Product Name & Publisher / Vendor */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-medium text-slate-700 dark:text-zinc-300 flex items-center justify-between gap-1 mb-1.5 h-4.5">
                  <span>
                    Software / Product Name <span className="text-red-500">*</span>
                  </span>
                </label>
                <input
                  type="text"
                  value={softwareName}
                  onChange={(e) => {
                    setSoftwareName(e.target.value);
                    if (errors.softwareName) setErrors((prev) => ({ ...prev, softwareName: '' }));
                  }}
                  placeholder="e.g. JetBrains All Products Pack Enterprise"
                  className={`w-full h-10 bg-slate-50 dark:bg-[#121216] border ${
                    errors.softwareName ? 'border-red-500' : 'border-slate-200 dark:border-zinc-800'
                  } rounded-lg px-3 text-xs text-slate-900 dark:text-zinc-100 focus:outline-hidden focus:ring-1 focus:ring-[#0C2086] dark:focus:ring-blue-500 transition-all`}
                />
                {errors.softwareName && <p className="text-[11px] text-red-500 mt-1">{errors.softwareName}</p>}
              </div>

              <div>
                <label className="text-xs font-medium text-slate-700 dark:text-zinc-300 flex items-center justify-between gap-1 mb-1.5 h-4.5">
                  <span>
                    Publisher / Vendor <span className="text-red-500">*</span>
                  </span>
                </label>
                <input
                  type="text"
                  value={publisher}
                  onChange={(e) => {
                    setPublisher(e.target.value);
                    if (errors.publisher) setErrors((prev) => ({ ...prev, publisher: '' }));
                  }}
                  placeholder="e.g. JetBrains s.r.o. / Microsoft Corp"
                  className={`w-full h-10 bg-slate-50 dark:bg-[#121216] border ${
                    errors.publisher ? 'border-red-500' : 'border-slate-200 dark:border-zinc-800'
                  } rounded-lg px-3 text-xs text-slate-900 dark:text-zinc-100 focus:outline-hidden focus:ring-1 focus:ring-[#0C2086] dark:focus:ring-blue-500 transition-all`}
                />
                {errors.publisher && <p className="text-[11px] text-red-500 mt-1">{errors.publisher}</p>}
              </div>
            </div>

            {/* Row 2: Version / Release Edition & Software Category */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-medium text-slate-700 dark:text-zinc-300 flex items-center justify-between gap-1 mb-1.5 h-4.5">
                  <span>Version / Release Edition</span>
                </label>
                <input
                  type="text"
                  value={version}
                  onChange={(e) => setVersion(e.target.value)}
                  placeholder="e.g. 2026.1 / E5 Enterprise Cloud"
                  className="w-full h-10 bg-slate-50 dark:bg-[#121216] border border-slate-200 dark:border-zinc-800 rounded-lg px-3 text-xs text-slate-900 dark:text-zinc-100 focus:outline-hidden focus:ring-1 focus:ring-[#0C2086] dark:focus:ring-blue-500 transition-all"
                />
              </div>

              <div>
                <label className="text-xs font-medium text-slate-700 dark:text-zinc-300 flex items-center justify-between gap-1 mb-1.5 h-4.5">
                  <span>Software Category</span>
                </label>
                <CustomSelectSharedComponent
                  value={category}
                  options={CATEGORY_OPTIONS}
                  onChange={(val) => setCategory(val)}
                  triggerClassName="h-10"
                />
              </div>
            </div>
          </div>

          {/* Section 2: Licensing Model & Seat Allocation */}
          <div className="space-y-4 pt-2">
            <h4 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider font-mono flex items-center gap-1.5 pb-2 border-b border-slate-100 dark:border-zinc-800">
              <Layers className="w-3.5 h-3.5 text-indigo-500" />
              2. Licensing Model & Seat Allocation
            </h4>

            {/* Row 1: License Type & License Key / Agreement ID */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-medium text-slate-700 dark:text-zinc-300 flex items-center justify-between gap-1 mb-1.5 h-4.5">
                  <span>License Type</span>
                </label>
                <CustomSelectSharedComponent
                  value={licenseType}
                  options={LICENSE_TYPE_OPTIONS}
                  onChange={(val) => setLicenseType(val)}
                  triggerClassName="h-10"
                />
              </div>

              <div>
                <div className="flex items-center justify-between mb-1.5 h-4.5">
                  <label className="text-xs font-medium text-slate-700 dark:text-zinc-300 flex items-center gap-1">
                    <span>
                      License Key / Agreement ID <span className="text-red-500">*</span>
                    </span>
                  </label>
                  <button
                    type="button"
                    onClick={handleGenerateLicenseKey}
                    className="text-[11px] font-medium text-[#0C2086] dark:text-blue-400 hover:underline cursor-pointer flex items-center gap-1"
                  >
                    <Sparkles className="w-3 h-3" /> Auto-Generate
                  </button>
                </div>
                <input
                  type="text"
                  value={licenseKey}
                  onChange={(e) => {
                    setLicenseKey(e.target.value);
                    if (errors.licenseKey) setErrors((prev) => ({ ...prev, licenseKey: '' }));
                  }}
                  placeholder="e.g. MSFT-E5-8839-4412-9901-PROD"
                  className={`w-full h-10 bg-slate-50 dark:bg-[#121216] border ${
                    errors.licenseKey ? 'border-red-500' : 'border-slate-200 dark:border-zinc-800'
                  } rounded-lg px-3 text-xs font-mono text-slate-900 dark:text-zinc-100 focus:outline-hidden focus:ring-1 focus:ring-[#0C2086] dark:focus:ring-blue-500 transition-all`}
                />
                {errors.licenseKey && <p className="text-[11px] text-red-500 mt-1">{errors.licenseKey}</p>}
              </div>
            </div>

            {/* Row 2: Total Seat Capacity & Pre-Synced Initial Allocated Seats */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-medium text-slate-700 dark:text-zinc-300 flex items-center justify-between gap-1 mb-1.5 h-4.5">
                  <span>
                    Total Seat Capacity <span className="text-red-500">*</span>
                  </span>
                </label>
                <input
                  type="number"
                  min="1"
                  max="100000"
                  value={totalSeats || ''}
                  onChange={(e) => {
                    const val = Math.max(1, parseInt(e.target.value) || 0);
                    setTotalSeats(val);
                    if (errors.totalSeats) setErrors((prev) => ({ ...prev, totalSeats: '' }));
                  }}
                  className={`w-full h-10 bg-slate-50 dark:bg-[#121216] border ${
                    errors.totalSeats ? 'border-red-500' : 'border-slate-200 dark:border-zinc-800'
                  } rounded-lg px-3 text-xs font-mono text-slate-900 dark:text-zinc-100 focus:outline-hidden focus:ring-1 focus:ring-[#0C2086] dark:focus:ring-blue-500 transition-all`}
                  placeholder="100"
                />
                {errors.totalSeats && <p className="text-[11px] text-red-500 mt-1">{errors.totalSeats}</p>}
              </div>

              <div>
                <label className="text-xs font-medium text-slate-700 dark:text-zinc-300 flex items-center justify-between gap-1 mb-1.5 h-4.5">
                  <span>Initial Allocated Seats (Assigned in Step 2)</span>
                </label>
                <div className="h-10 px-3 flex items-center justify-between bg-slate-100/70 dark:bg-zinc-800/60 rounded-lg border border-slate-200/60 dark:border-zinc-700/60 text-xs font-mono">
                  <span className="text-slate-600 dark:text-zinc-300">
                    {selectedEmployeeIds.length} / {totalSeats} seats
                  </span>
                  <span className="text-[10px] text-slate-400 font-sans">Configured in Step 2</span>
                </div>
              </div>
            </div>
          </div>

          {/* Section 3: Commercials & Contract Term */}
          <div className="space-y-4 pt-2">
            <h4 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider font-mono flex items-center gap-1.5 pb-2 border-b border-slate-100 dark:border-zinc-800">
              <DollarSign className="w-3.5 h-3.5 text-emerald-500" />
              3. Commercials & Contract Term
            </h4>

            {/* Row 1: Cost Per Seat & Billing Currency */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-medium text-slate-700 dark:text-zinc-300 flex items-center justify-between gap-1 mb-1.5 h-4.5">
                  <span>
                    Cost Per Seat (Annual) <span className="text-red-500">*</span>
                  </span>
                </label>
                <div className="relative flex items-center">
                  <span className="absolute left-3 text-xs text-slate-400 font-mono font-medium">
                    {currency === 'INR' ? '₹' : currency === 'EUR' ? '€' : currency === 'GBP' ? '£' : '$'}
                  </span>
                  <input
                    type="number"
                    min="0"
                    step="0.01"
                    value={costPerSeat || ''}
                    onChange={(e) => {
                      setCostPerSeat(Math.max(0, parseFloat(e.target.value) || 0));
                      if (errors.costPerSeat) setErrors((prev) => ({ ...prev, costPerSeat: '' }));
                    }}
                    className={`w-full h-10 bg-slate-50 dark:bg-[#121216] border ${
                      errors.costPerSeat ? 'border-red-500' : 'border-slate-200 dark:border-zinc-800'
                    } rounded-lg pl-7 pr-3 text-xs font-mono text-slate-900 dark:text-zinc-100 focus:outline-hidden focus:ring-1 focus:ring-[#0C2086] dark:focus:ring-blue-500 transition-all`}
                    placeholder="240.00"
                  />
                </div>
                {errors.costPerSeat && <p className="text-[11px] text-red-500 mt-1">{errors.costPerSeat}</p>}
              </div>

              <div>
                <label className="text-xs font-medium text-slate-700 dark:text-zinc-300 flex items-center justify-between gap-1 mb-1.5 h-4.5">
                  <span>Billing Currency</span>
                </label>
                <CustomSelectSharedComponent
                  value={currency}
                  options={CURRENCY_OPTIONS}
                  onChange={(val) => setCurrency(val as 'USD' | 'INR' | 'EUR' | 'GBP')}
                  triggerClassName="h-10"
                />
              </div>
            </div>

            {/* Row 2: Total Annual Investment (half-width taking col 1) */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-medium text-slate-700 dark:text-zinc-300 flex items-center justify-between gap-1 mb-1.5 h-4.5">
                  <span>Total Annual Investment</span>
                </label>
                <div className="h-10 px-3 flex items-center bg-slate-100/70 dark:bg-zinc-800/60 rounded-lg border border-slate-200/60 dark:border-zinc-700/60">
                  <span className="text-xs font-bold font-mono text-slate-900 dark:text-white">
                    {currency === 'INR' ? '₹' : currency === 'EUR' ? '€' : currency === 'GBP' ? '£' : '$'}
                    {calculatedAnnualCost.toLocaleString()} / year
                  </span>
                </div>
              </div>
            </div>

            {/* Row 3: Purchase / Start Date & Expiration / Renewal Date */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-medium text-slate-700 dark:text-zinc-300 flex items-center justify-between gap-1 mb-1.5 h-4.5">
                  <span className="flex items-center gap-1.5">
                    <Calendar className="w-3.5 h-3.5 text-slate-400" />
                    Purchase / Start Date
                  </span>
                </label>
                <input
                  type="date"
                  value={purchaseDate}
                  onChange={(e) => setPurchaseDate(e.target.value)}
                  className="w-full h-10 bg-slate-50 dark:bg-[#121216] border border-slate-200 dark:border-zinc-800 rounded-lg px-3 text-xs font-mono text-slate-900 dark:text-zinc-100 focus:outline-hidden focus:ring-1 focus:ring-[#0C2086] dark:focus:ring-blue-500 transition-all"
                />
              </div>

              <div>
                <div className="flex items-center justify-between mb-1.5 h-4.5">
                  <label className="text-xs font-medium text-slate-700 dark:text-zinc-300 flex items-center gap-1.5">
                    <Calendar className="w-3.5 h-3.5 text-slate-400" />
                    <span>
                      Expiration / Renewal Date <span className="text-red-500">*</span>
                    </span>
                  </label>
                  <div className="flex items-center gap-1">
                    <button
                      type="button"
                      onClick={() => handleSetExpiryYears(1)}
                      className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-slate-100 dark:bg-zinc-800 text-slate-600 dark:text-zinc-300 hover:bg-slate-200 cursor-pointer"
                    >
                      +1y
                    </button>
                    <button
                      type="button"
                      onClick={() => handleSetExpiryYears(2)}
                      className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-slate-100 dark:bg-zinc-800 text-slate-600 dark:text-zinc-300 hover:bg-slate-200 cursor-pointer"
                    >
                      +2y
                    </button>
                    <button
                      type="button"
                      onClick={() => handleSetExpiryYears(3)}
                      className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-slate-100 dark:bg-zinc-800 text-slate-600 dark:text-zinc-300 hover:bg-slate-200 cursor-pointer"
                    >
                      +3y
                    </button>
                  </div>
                </div>
                <input
                  type="date"
                  value={expiryDate}
                  onChange={(e) => {
                    setExpiryDate(e.target.value);
                    if (errors.expiryDate) setErrors((prev) => ({ ...prev, expiryDate: '' }));
                  }}
                  className={`w-full h-10 bg-slate-50 dark:bg-[#121216] border ${
                    errors.expiryDate ? 'border-red-500' : 'border-slate-200 dark:border-zinc-800'
                  } rounded-lg px-3 text-xs font-mono text-slate-900 dark:text-zinc-100 focus:outline-hidden focus:ring-1 focus:ring-[#0C2086] dark:focus:ring-blue-500 transition-all`}
                />
                {errors.expiryDate && <p className="text-[11px] text-red-500 mt-1">{errors.expiryDate}</p>}
              </div>
            </div>
          </div>

          {/* Section 4: Organizational Allocation */}
          <div className="space-y-4 pt-2">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-zinc-800">
              <h4 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider font-mono flex items-center gap-1.5">
                <Building className="w-3.5 h-3.5 text-amber-500" />
                4. Department Allocation
              </h4>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={handleSelectAllDepartments}
                  className="text-[11px] text-[#0C2086] dark:text-blue-400 hover:underline cursor-pointer"
                >
                  Select All
                </button>
                <span className="text-slate-300 dark:text-zinc-700">•</span>
                <button
                  type="button"
                  onClick={handleClearDepartments}
                  className="text-[11px] text-slate-500 hover:underline cursor-pointer"
                >
                  Clear
                </button>
              </div>
            </div>

            <div className="flex flex-wrap gap-2">
              {defaultDepartments.map((dept) => {
                const isSelected = selectedDepartments.includes(dept);
                return (
                  <button
                    key={dept}
                    type="button"
                    onClick={() => handleToggleDepartment(dept)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all flex items-center gap-1.5 cursor-pointer border ${
                      isSelected
                        ? 'bg-[#0C2086] text-white border-[#0C2086] shadow-2xs'
                        : 'bg-slate-50 dark:bg-zinc-800/80 text-slate-600 dark:text-zinc-400 border-slate-200 dark:border-zinc-700/60 hover:bg-slate-100 dark:hover:bg-zinc-700'
                    }`}
                  >
                    {isSelected ? <CheckCircle2 className="w-3 h-3 text-white" /> : <div className="w-3 h-3 rounded-full border border-slate-300 dark:border-zinc-600" />}
                    {dept}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Modal Action Buttons (Step 1 -> Step 2) */}
          <div className="flex items-center justify-between pt-6 border-t border-slate-100 dark:border-zinc-800">
            <ButtonSharedComponent
              type="button"
              variant="outline"
              onClick={handleModalClose}
            >
              Cancel
            </ButtonSharedComponent>
            <ButtonSharedComponent
              type="submit"
              variant="primary"
              rightIcon={<ArrowRight className="w-4 h-4" />}
              className="font-semibold !bg-[#0C2086] hover:!bg-[#081765] !text-white"
            >
              Next: Assign Employees
            </ButtonSharedComponent>
          </div>
        </form>
      )}

      {/* ================= STEP 2: ASSIGN EMPLOYEE SEATS ================= */}
      {currentStep === 2 && (
        <form onSubmit={handleSubmitFinal} className="space-y-5 pb-2">
          {/* Summary & Live Seat Capacity Progress Banner */}
          <div className="bg-slate-50 dark:bg-zinc-900/70 p-4 rounded-xl border border-slate-200/80 dark:border-zinc-800 space-y-3">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div>
                <div className="flex items-center gap-2">
                  <h4 className="font-bold text-slate-900 dark:text-white font-serif-headline text-sm">
                    {softwareName || 'New Software License'}
                  </h4>
                  <span className="font-mono text-[11px] px-2 py-0.5 rounded bg-slate-200/80 dark:bg-zinc-800 text-slate-700 dark:text-zinc-300">
                    {licenseType}
                  </span>
                </div>
                <p className="text-xs text-slate-500 dark:text-zinc-400 mt-0.5 font-mono truncate">
                  Key: {licenseKey || 'N/A'} • {publisher}
                </p>
              </div>

              {/* Live Seat Allocation Badge */}
              <div className="flex items-center gap-2 shrink-0">
                <span className="text-xs font-medium text-slate-500 dark:text-zinc-400">
                  Allocated:
                </span>
                <span className="px-2.5 py-1 rounded-lg text-xs font-mono font-bold bg-[#0C2086] text-white shadow-2xs">
                  {selectedEmployeeIds.length} / {totalSeats} Seats
                </span>
              </div>
            </div>

            {/* Seat Utilization Bar */}
            <div className="space-y-1">
              <div className="w-full h-2 rounded-full bg-slate-200 dark:bg-zinc-800 overflow-hidden">
                <div
                  className={`h-full rounded-full transition-all duration-300 ${
                    selectedEmployeeIds.length >= totalSeats
                      ? 'bg-amber-500'
                      : 'bg-emerald-500'
                  }`}
                  style={{
                    width: `${Math.min(100, (selectedEmployeeIds.length / (totalSeats || 1)) * 100)}%`,
                  }}
                />
              </div>
              <div className="flex justify-between text-[11px] text-slate-400 font-mono">
                <span>{totalSeats - selectedEmployeeIds.length} seats remaining</span>
                <span>{Math.round((selectedEmployeeIds.length / (totalSeats || 1)) * 100)}% utilized</span>
              </div>
            </div>
          </div>

          {/* Search & Department Filter Toolbar */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
            {/* Search Input */}
            <div className="relative flex-1">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 dark:text-zinc-500" />
              <input
                type="text"
                value={employeeSearchQuery}
                onChange={(e) => setEmployeeSearchQuery(e.target.value)}
                placeholder="Search employees by name, email, designation..."
                className="w-full h-10 pl-9 pr-3 text-xs rounded-lg bg-slate-50 dark:bg-[#121216] text-slate-900 dark:text-zinc-100 border border-slate-200 dark:border-zinc-800 focus:outline-hidden focus:ring-1 focus:ring-[#0C2086] dark:focus:ring-blue-500 transition-all"
              />
            </div>

            {/* Department Filter Dropdown */}
            <div className="w-full sm:w-56 shrink-0">
              <CustomSelectSharedComponent
                value={employeeDepartmentFilter}
                options={departmentFilterOptions}
                onChange={(val) => setEmployeeDepartmentFilter(val)}
                triggerClassName="h-10"
              />
            </div>
          </div>

          {/* Bulk Selection Actions Bar */}
          <div className="flex items-center justify-between text-xs px-1">
            <span className="text-slate-500 dark:text-zinc-400 font-medium">
              Showing {filteredEmployees.length} employee{filteredEmployees.length === 1 ? '' : 's'}
            </span>
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={handleSelectAllVisible}
                disabled={filteredEmployees.length === 0 || selectedEmployeeIds.length >= totalSeats}
                className="text-[#0C2086] dark:text-blue-400 hover:underline cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed font-medium"
              >
                Select Visible ({Math.min(filteredEmployees.length, totalSeats - selectedEmployeeIds.length)})
              </button>
              <span className="text-slate-300 dark:text-zinc-700">•</span>
              <button
                type="button"
                onClick={handleClearSelectedEmployees}
                disabled={selectedEmployeeIds.length === 0}
                className="text-slate-500 hover:underline cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Clear Selection
              </button>
            </div>
          </div>

          {/* Employee Roster List (Scrollable Card Grid) */}
          <div className="max-h-80 overflow-y-auto pr-1 space-y-2 custom-vertical-scrollbar">
            {filteredEmployees.length === 0 ? (
              <EmptyStateSharedComponent
                icon={<Users className="w-6 h-6 text-slate-400 dark:text-zinc-500" />}
                title="No Employees Found"
                description={
                  employeeSearchQuery || employeeDepartmentFilter !== 'ALL'
                    ? `No employees match filter "${employeeSearchQuery || employeeDepartmentFilter}".`
                    : 'There are no active employee profiles in the directory.'
                }
              />
            ) : (
              filteredEmployees.map((emp) => {
                const isSelected = selectedEmployeeIds.includes(emp.id);
                const isCapacityReached = !isSelected && selectedEmployeeIds.length >= totalSeats;

                return (
                  <div
                    key={emp.id}
                    onClick={() => {
                      if (!isCapacityReached) {
                        handleToggleEmployee(emp.id);
                      }
                    }}
                    className={`p-3 rounded-xl border transition-all flex items-center justify-between gap-3 cursor-pointer select-none ${
                      isSelected
                        ? 'bg-blue-50/70 dark:bg-blue-950/30 border-[#0C2086] dark:border-blue-600 shadow-2xs'
                        : isCapacityReached
                        ? 'bg-slate-50/60 dark:bg-zinc-900/40 border-slate-200/50 dark:border-zinc-800/50 opacity-60 cursor-not-allowed'
                        : 'bg-white dark:bg-[#121216] border-slate-200 dark:border-zinc-800 hover:border-slate-300 dark:hover:border-zinc-700'
                    }`}
                  >
                    {/* Checkbox & Avatar & Info */}
                    <div className="flex items-center gap-3 min-w-0 flex-1">
                      {/* Checkbox Icon */}
                      <div
                        className={`w-5 h-5 rounded-md flex items-center justify-center shrink-0 transition-colors border ${
                          isSelected
                            ? 'bg-[#0C2086] border-[#0C2086] text-white'
                            : 'border-slate-300 dark:border-zinc-700 bg-white dark:bg-zinc-800'
                        }`}
                      >
                        {isSelected && <Check className="w-3.5 h-3.5 stroke-[2.5]" />}
                      </div>

                      {/* Employee Avatar Circle */}
                      <div className="w-8 h-8 rounded-full bg-slate-100 dark:bg-zinc-800 border border-slate-200 dark:border-zinc-700 flex items-center justify-center font-bold text-xs text-slate-700 dark:text-zinc-200 shrink-0 font-mono">
                        {emp.name
                          .split(' ')
                          .map((n) => n[0])
                          .join('')
                          .substring(0, 2)
                          .toUpperCase()}
                      </div>

                      {/* Name, Email & Designation */}
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-semibold text-slate-900 dark:text-white truncate">
                            {emp.name}
                          </span>
                          <span className="font-mono text-[10px] text-slate-400 dark:text-zinc-500">
                            {emp.employeeCode}
                          </span>
                        </div>
                        <p className="text-[11px] text-slate-500 dark:text-zinc-400 truncate">
                          {emp.email} • <span className="font-medium text-slate-600 dark:text-zinc-300">{emp.designation || 'Staff'}</span>
                        </p>
                      </div>
                    </div>

                    {/* Department Tag */}
                    <div className="shrink-0">
                      <span className="px-2 py-0.5 rounded-md text-[10px] font-medium bg-slate-100 dark:bg-zinc-800 text-slate-600 dark:text-zinc-300 border border-slate-200 dark:border-zinc-700 font-mono">
                        {emp.department || 'General'}
                      </span>
                    </div>
                  </div>
                );
              })
            )}
          </div>

          {/* Modal Action Buttons (Step 2 Back / Finish) */}
          <div className="flex items-center justify-between pt-6 border-t border-slate-100 dark:border-zinc-800">
            <ButtonSharedComponent
              type="button"
              variant="outline"
              onClick={() => setCurrentStep(1)}
              icon={<ArrowLeft className="w-4 h-4" />}
            >
              Back to Software Terms
            </ButtonSharedComponent>

            <div className="flex items-center gap-2">
              <ButtonSharedComponent
                type="button"
                variant="ghost"
                onClick={handleModalClose}
                disabled={createLicenseMutation.isPending}
              >
                Cancel
              </ButtonSharedComponent>
              <ButtonSharedComponent
                type="submit"
                variant="primary"
                isLoading={createLicenseMutation.isPending}
                className="font-semibold !bg-[#0C2086] hover:!bg-[#081765] !text-white"
              >
                Register Subscription ({selectedEmployeeIds.length} seats)
              </ButtonSharedComponent>
            </div>
          </div>
        </form>
      )}
    </ModalSharedComponent>
  );
}
