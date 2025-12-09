import { Customer } from '../model/customer.model';

export interface ICustomerRepository {
  save(user: Customer): Promise<void>;
  findById(id: string): Promise<Customer | null>;
  findByEmail(email: string): Promise<Customer | null>;
}
