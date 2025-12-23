export class Customer {
  constructor(
    private readonly _id: string,
    private readonly _userId: string,
    private readonly _phone?: string | null,
  ) {
    if (!_id) throw new Error('Customer ID cannot be empty.');
    if (!_userId) throw new Error('User ID cannot be empty.');
    if (this._phone != null && !Customer.isValidPhone(this._phone)) {
      throw new Error('Invalid phone');
    }
  }

  static validatePhone(phone: string) {
    if (!/^\d{8,}$/.test(phone)) {
      throw new Error('Invalid phone');
    }
  }

  private static isValidPhone(phone: string) {
    return /^\d{8,}$/.test(phone);
  }

  get id() {
    return this._id;
  }

  get userId() {
    return this._userId;
  }

  get phone() {
    return this._phone ?? null;
  }
}
