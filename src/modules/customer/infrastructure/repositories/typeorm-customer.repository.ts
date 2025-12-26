import { Repository } from 'typeorm';
import { ICustomerRepository } from '../../domain/repositories/customer.repository';
import { Customer } from '../../domain/model/customer.model';
import { CustomerEntity } from '../entity/customer.entity';
import { CustomerMapper } from '../../presentation/mappers/customer.mapper';

export class TypeORMCustomerRepository implements ICustomerRepository {
  private repository: Repository<CustomerEntity>;

  constructor(repository: Repository<CustomerEntity>) {
    this.repository = repository;
  }

  async save(customer: Customer): Promise<Customer | null> {
    const customerEntity = CustomerMapper.toPersistence(customer);

    const savedEntity = await this.repository.save(customerEntity);

    return savedEntity ? CustomerMapper.toDomain(savedEntity) : null;
  }

  async findById(id: string): Promise<Customer | null> {
    const entity = await this.repository.findOne({
      where: { id },
    });
    return entity ? CustomerMapper.toDomain(entity) : null;
  }

  async findByEmail(email: string): Promise<Customer | null> {
    const entity = await this.repository
      .createQueryBuilder('customer')
      .innerJoinAndSelect('customer.user', 'user')
      .where('user.email = :email', { email })
      .getOne();

    return entity ? CustomerMapper.toDomain(entity) : null;
  }
}
