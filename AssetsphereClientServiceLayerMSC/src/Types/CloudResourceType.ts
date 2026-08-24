export interface CloudResource {
  id: string;
  provider: string;
  name: string;
  type: string;
  region: string;
  cost: number;
  status: string;
}
