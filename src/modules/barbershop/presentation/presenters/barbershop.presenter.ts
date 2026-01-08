import { Barbershop } from '../../domain/model/barbershop.model';

export interface BarbershopAddressHttp {
  street: string;
  number: string;
  city: string;
  state: string;
  zipCode: string;
}

export interface BarbershopHttp {
  id: string;
  ownerUserId: string;
  name: string;
  phone: string | null;
  address: BarbershopAddressHttp;
}

export class BarbershopPresenter {
  static toHttp(barbershop: Barbershop): BarbershopHttp {
    return {
      id: barbershop.id,
      ownerUserId: barbershop.ownerUserId,
      name: barbershop.name,
      phone: barbershop.phone,
      address: {
        street: barbershop.address.street,
        number: barbershop.address.number,
        city: barbershop.address.city,
        state: barbershop.address.state,
        zipCode: barbershop.address.zipCode,
      },
    };
  }
}
