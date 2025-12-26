import { Repository } from 'typeorm';
import { IBarbershopRepository } from '../../domain/repositories/barbershop.repository';
import { BarbershopEntity } from '../entity/barbershop.entity';
import { Barbershop } from '../../domain/model/barbershop.model';
import { BarbershopMapper } from '../../presentation/mappers/barbershop.mapper';

export class TypeORMBarbershopRepository implements IBarbershopRepository {
  private repository: Repository<BarbershopEntity>;

  constructor(repository: Repository<BarbershopEntity>) {
    this.repository = repository;
  }

  async save(barbershop: Barbershop): Promise<Barbershop | null> {
    const barbershopEntity = BarbershopMapper.toPersistence(barbershop);

    const savedEntity = await this.repository.save(barbershopEntity);

    return savedEntity ? BarbershopMapper.toDomain(savedEntity) : null;
  }

  async findById(id: string): Promise<Barbershop | null> {
    const entity = await this.repository.findOne({
      where: { id },
    });
    return entity ? BarbershopMapper.toDomain(entity) : null;
  }

  async findByEmail(email: string): Promise<Barbershop | null> {
    const entity = await this.repository
      .createQueryBuilder('barbershop')
      .innerJoinAndSelect('barbershop.ownerUser', 'user')
      .where('user.email = :email', { email })
      .getOne();

    return entity ? BarbershopMapper.toDomain(entity) : null;
  }
}
