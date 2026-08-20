import React from 'react';
import SoftwareLicensesScreenController from '../Features/SoftwareLicenses/SoftwareLicensesScreenController';
import { SoftwareLicense } from '../types';

export interface SoftwareLicensesScreenRouteProps {
  licenses: SoftwareLicense[];
}

export default function SoftwareLicensesScreenRoute({
  licenses,
}: SoftwareLicensesScreenRouteProps): React.JSX.Element {
  return <SoftwareLicensesScreenController licenses={licenses} />;
}
