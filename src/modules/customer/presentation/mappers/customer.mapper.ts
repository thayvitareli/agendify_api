import { Customer } from '../../domain/model/customer.model';
import { CustomerEntity } from '../../infrastructure/entity/customer.entity';

export class CustomerMapper {
  static toDomain(entity: CustomerEntity): Customer {
    if (!entity) return null as any;

    return new Customer(entity.id, entity.userId, entity.phone);
  }
}
