import { Address } from './address.model';

export interface TextData {
  writerPhone: string;
  startComment: string;
  endComment: string;
  addresses: Address[];
  writerId: string;
}
