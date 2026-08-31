import React from 'react';
import SoftwareLicensesScreenController from '../Features/SoftwareLicenses/SoftwareLicensesScreenController';
import { SoftwareLicense } from '../Types/SoftwareLicenseType';
import TanstackQueryClientService from '../Services/TanstackQueryClientService';

export interface SoftwareLicensesScreenRouteProps {
  licenses?: SoftwareLicense[];
}

export default function SoftwareLicensesScreenRoute({
  licenses: initialLicenses,
}: SoftwareLicensesScreenRouteProps): React.JSX.Element {
  const { data: dbLicenses = [], isLoading } =
    TanstackQueryClientService.current.softwareLicenses.useSoftwareLicensesQuery();

  const activeLicenses = initialLicenses && initialLicenses.length > 0 ? initialLicenses : dbLicenses;

  return (
    <SoftwareLicensesScreenController
      licenses={activeLicenses}
      isLoading={isLoading}
    />
  );
}
