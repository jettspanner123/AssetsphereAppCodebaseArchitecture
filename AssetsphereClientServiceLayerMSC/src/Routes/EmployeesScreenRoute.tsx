import React from 'react';
import EmployeesScreenController from '../Features/Employees/EmployeesScreenController';
import { Employee, Asset } from '../types';

export interface EmployeesScreenRouteProps {
  employees: Employee[];
  assets: Asset[];
}

export default function EmployeesScreenRoute({
  employees,
  assets,
}: EmployeesScreenRouteProps): React.JSX.Element {
  return <EmployeesScreenController employees={employees} assets={assets} />;
}
