import React from 'react';
import ServiceDeskScreenController from '../Features/ServiceDesk/ServiceDeskScreenController';
import { ServiceTicket } from '../Types/ServiceTicketType';

export interface ServiceDeskScreenRouteProps {
  tickets: ServiceTicket[];
}

export default function ServiceDeskScreenRoute({
  tickets,
}: ServiceDeskScreenRouteProps): React.JSX.Element {
  return <ServiceDeskScreenController tickets={tickets} />;
}
