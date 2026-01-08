import { Barbershop } from '../model/barbershop.model';

export interface IBarbershopRepository {
  save(barbershop: Barbershop): Promise<Barbershop | null>;
  findById(id: string): Promise<Barbershop | null>;
  findByOwnerUserId(ownerUserId: string): Promise<Barbershop | null>;
  findByEmail(email: string): Promise<Barbershop | null>;
}
