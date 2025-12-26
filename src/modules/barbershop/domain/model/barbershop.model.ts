import { Address } from '../value_objects/address.vo';

export class Barbershop {
  private _id: string;
  private _ownerUserId: string;
  private _name: string;
  private _address: Address;
  private _phone?: string;

  constructor(
    id: string,
    userId: string,
    phone: string,
    name: string,
    address: Address,
  ) {
    if (!userId) throw new Error('UserId can not be empyt');
    if (!name) throw new Error('Name can not be empyt');
    if (!id) throw new Error('Id can not be empyt');

    Barbershop.isValidPhone(phone);

    this._id = id;
    this._ownerUserId = userId;
    this._name = name;
    this._address = address;
    this._phone = phone;
  }

  get id() {
    return this._id;
  }

  get name() {
    return this._name;
  }

  get ownerUserId() {
    return this._ownerUserId;
  }

  get phone() {
    return this._phone ?? null;
  }

  get address() {
    return this._address;
  }

  static validatePhone(phone: string) {
    if (!/^\d{8,}$/.test(phone)) {
      throw new Error('Invalid phone');
    }
  }

  private static isValidPhone(phone: string) {
    return /^\d{8,}$/.test(phone);
  }
}
