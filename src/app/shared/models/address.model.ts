import { Writer } from './writer.model';

export interface Address {
  id: string;
  age: number;
  name: string;
  street: string;
  city: string;
  state: string;
  zip: string;
  phone: string[];
  assigned: boolean;
  writer: Writer;
}
