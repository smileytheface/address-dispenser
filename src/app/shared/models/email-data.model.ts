import { Address } from './address.model';

export interface EmailData {
  writerEmail: string;
  startComment: string;
  endComment: string;
  addresses: Address[];
  writerId: string;
  subject: string;
}
