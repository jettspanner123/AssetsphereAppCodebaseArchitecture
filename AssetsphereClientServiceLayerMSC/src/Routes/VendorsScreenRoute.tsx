import React from 'react';
import VendorsScreenController from '../Features/Vendors/VendorsScreenController';
import { Vendor } from '../Types/VendorType';

export interface VendorsScreenRouteProps {
  vendors: Vendor[];
}

export default function VendorsScreenRoute({
  vendors,
}: VendorsScreenRouteProps): React.JSX.Element {
  return <VendorsScreenController vendors={vendors} />;
}
