import { Barbershop } from '../model/barbershop.model';

export interface IBarbershopRepository {
  save(user: Barbershop): Promise<void>;
  findById(id: string): Promise<Barbershop | null>;
  findByEmail(email: string): Promise<Barbershop | null>;
}
