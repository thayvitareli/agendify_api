import { IBarbershopRepository } from 'src/modules/barbershop/domain/repositories/barbershop.repository';
import { BarbershopService } from '../domain/model/barbershop-service.model';
import { IBarbershopServiceRepository } from '../domain/repositories/barbershop-service.repository';

export class RegisterServiceUseCase {
  constructor(
    private readonly barbershopRepo: IBarbershopRepository,
    private readonly barbershopServiceRepo: IBarbershopServiceRepository,
  ) {}

  async execute(input: {
    id: string;
    barbershopId: string;
    name: string;
    durationMinutes: number;
    price: number;
  }) {
    const barbershop = await this.barbershopRepo.findById(input.barbershopId);

    if (!barbershop) {
      throw new Error('Barbershop not found');
    }

    const service = new BarbershopService(
      input.id,
      input.barbershopId,
      input.name,
      input.durationMinutes,
      input.price,
    );

    await this.barbershopServiceRepo.save(service);

    return service;
  }
}
