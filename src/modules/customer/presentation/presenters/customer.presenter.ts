import { Customer } from '../../domain/model/customer.model';

export interface CustomerHttp {
  id: string;
  userId: string;
  phone: string | null;
}

export class CustomerPresenter {
  static toHttp(customer: Customer): CustomerHttp {
    return {
      id: customer.id,
      userId: customer.userId,
      phone: customer.phone,
    };
  }
}
