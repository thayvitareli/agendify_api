import { In, Repository } from 'typeorm';
import { IBarbershopServiceRepository } from '../../domain/repositories/barbershop-service.repository';
import { BarbershopServiceEntity } from '../entity/barbershop-service.entity';
import { BarbershopService } from '../../domain/model/barbershop-service.model';
import { BarbershopServiceMapper } from '../../presentation/mappers/barbershop-service.mapper';
import { InjectRepository } from '@nestjs/typeorm';
import type { BarbershopServiceSearchFilters } from '../../domain/repositories/barbershop-service.repository';

export class TypeORMBarbershopServiceRepository implements IBarbershopServiceRepository {
  constructor(
    @InjectRepository(BarbershopServiceEntity)
    private readonly repository: Repository<BarbershopServiceEntity>,
  ) {}

  async save(
    barbershopService: BarbershopService,
  ): Promise<BarbershopService | null> {
    const barbershopServiceEntity =
      BarbershopServiceMapper.toPersistence(barbershopService);

    const savedEntity = await this.repository.save(barbershopServiceEntity);

    return savedEntity ? BarbershopServiceMapper.toDomain(savedEntity) : null;
  }

  async findByBarbershopId(barbershopId: string): Promise<BarbershopService[]> {
    const entities = await this.repository.find({
      where: { barbershopId },
    });
    return entities.map((entity) => BarbershopServiceMapper.toDomain(entity));
  }

  async findById(id: string): Promise<BarbershopService | null> {
    const entity = await this.repository.findOne({
      where: { id },
    });
    return entity ? BarbershopServiceMapper.toDomain(entity) : null;
  }

  async findMany(
    filters: BarbershopServiceSearchFilters,
  ): Promise<{ services: BarbershopService[]; total: number }> {
    const query = this.repository.createQueryBuilder('service');

    if (filters.active != null) {
      query.andWhere('service.active = :active', { active: filters.active });
    }

    if (filters.barbershopId) {
      query.andWhere('service.barbershopId = :barbershopId', {
        barbershopId: filters.barbershopId,
      });
    }

    const trimmedName = filters.name?.trim();
    if (trimmedName) {
      query.andWhere('LOWER(service.name) LIKE LOWER(:name)', {
        name: `%${trimmedName}%`,
      });
    }

    if (filters.minPrice != null) {
      query.andWhere('service.price >= :minPrice', { minPrice: filters.minPrice });
    }

    if (filters.maxPrice != null) {
      query.andWhere('service.price <= :maxPrice', { maxPrice: filters.maxPrice });
    }

    const sortBy = filters.sortBy ?? 'name';
    const sortOrder = filters.sortOrder ?? 'ASC';
    query.orderBy(`service.${sortBy}`, sortOrder);

    const page = filters.page ?? 1;
    const limit = filters.limit ?? 20;
    query.skip((page - 1) * limit).take(limit);

    const [entities, total] = await query.getManyAndCount();
    return {
      services: entities.map((entity) => BarbershopServiceMapper.toDomain(entity)),
      total,
    };
  }
}
