import { Customer } from '../model/customer.model';

export interface ICustomerRepository {
  save(customer: Customer): Promise<Customer | null>;
  findById(id: string): Promise<Customer | null>;
  findByEmail(email: string): Promise<Customer | null>;
}
