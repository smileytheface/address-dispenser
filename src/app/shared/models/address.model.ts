import { AssignmentData } from './assignment-data';

export interface Address {
  id: string;
  age: number;
  name: string;
  street: string;
  city: string;
  state: string;
  zip: string;
  phone: string[];
  dateCreated: Date;
  assigned: boolean;
  assignmentHistory?: AssignmentData[];
  writer: string;
}
