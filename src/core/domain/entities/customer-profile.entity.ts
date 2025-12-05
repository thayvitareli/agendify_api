export class CustomerProfile {
  constructor(
    private readonly _id: string,
    private readonly _userId: string,
    private readonly _phone?: string | null,
  ) {
    if (!_id) throw new Error('Customer ID cannot be empty.');
    if (!_userId) throw new Error('User ID cannot be empty.');
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
