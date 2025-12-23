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

  async save(customer: Customer): Promise<void> {
    const entity = this.repository.create({
      id: (customer as any).id,
      userId: (customer as any).userId,
      phone: (customer as any).phone ?? null,
    });
    await this.repository.save(entity);
  }

  async findById(id: string): Promise<Customer | null> {
    const entity = await this.repository.findOne({
      where: { id },
      relations: ['user'],
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
