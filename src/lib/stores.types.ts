// Store data model. Shared by stores.retail.json (generated), stores.clubs.ts
// (hand-maintained), and scripts/sync-stores.mjs. Single source of the shape.

export type StoreType = 'retail' | 'club';

export interface Store {
  id: string;
  type: StoreType;
  name: string;
  carries: string[];       // Zyra products actually stocked, e.g. ['Root Beer Rush','Gold']
  address: string;
  city: string;
  province: string;        // two-letter code, e.g. 'AB'
  postal: string;
  phone?: string;
  hours?: string;
  url?: string;
  lat: number;
  lng: number;
}
