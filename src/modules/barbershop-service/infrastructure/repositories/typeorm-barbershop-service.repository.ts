import { In, Repository } from 'typeorm';
import { IBarbershopServiceRepository } from '../../domain/repositories/barbershop-service.repository';
import { BarbershopServiceEntity } from '../entity/barbershop-service.entity';
import { BarbershopService } from '../../domain/model/barbershop-service.model';
import { BarbershopServiceMapper } from '../../presentation/mappers/barbershop-service.mapper';
import { InjectRepository } from '@nestjs/typeorm';

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
}
