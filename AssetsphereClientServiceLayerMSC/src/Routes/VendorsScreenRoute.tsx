import React from 'react';
import VendorsScreenController from '../Features/Vendors/VendorsScreenController';
import { Vendor } from '../types';

export interface VendorsScreenRouteProps {
  vendors: Vendor[];
}

export default function VendorsScreenRoute({
  vendors,
}: VendorsScreenRouteProps): React.JSX.Element {
  return <VendorsScreenController vendors={vendors} />;
}
