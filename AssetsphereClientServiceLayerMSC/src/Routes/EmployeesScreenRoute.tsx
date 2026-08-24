import React from 'react';
import EmployeesScreenController from '../Features/Employees/EmployeesScreenController';
import { Employee } from '../Types/EmployeeType';
import { Asset } from '../Types/AssetType';

export interface EmployeesScreenRouteProps {
  employees: Employee[];
  assets: Asset[];
  isLoading?: boolean;
  onOpenAddModal?: () => void;
}

export default function EmployeesScreenRoute({
  employees,
  assets,
  isLoading = false,
  onOpenAddModal,
}: EmployeesScreenRouteProps): React.JSX.Element {
  return (
    <EmployeesScreenController
      employees={employees}
      assets={assets}
      isLoading={isLoading}
      onOpenAddModal={onOpenAddModal}
    />
  );
}
