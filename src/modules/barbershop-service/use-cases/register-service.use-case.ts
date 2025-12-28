import type { IBarbershopRepository } from 'src/modules/barbershop/domain/repositories/barbershop.repository';
import { BarbershopService } from '../domain/model/barbershop-service.model';
import type { IBarbershopServiceRepository } from '../domain/repositories/barbershop-service.repository';
import { RegisterServiceDto } from '../presentation/dto/register-service.dto';
import { v4 as uuid } from 'uuid';
import { Inject } from '@nestjs/common';

export class RegisterServiceUseCase {
  constructor(
    @Inject('IBarbershopRepository')
    private readonly barbershopRepo: IBarbershopRepository,
    @Inject('IBarbershopServiceRepository')
    private readonly barbershopServiceRepo: IBarbershopServiceRepository,
  ) {}

  async execute(input: RegisterServiceDto) {
    const barbershop = await this.barbershopRepo.findById(input.barbershopId);

    if (!barbershop) {
      throw new Error('Barbershop not found');
    }

    const service = new BarbershopService(
      uuid(),
      input.barbershopId,
      input.name,
      input.durationInMinutes,
      input.price,
    );

    await this.barbershopServiceRepo.save(service);

    return service;
  }
}
