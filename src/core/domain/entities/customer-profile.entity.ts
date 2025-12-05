export class CustomerProfile {
  private readonly _id: string;
  private readonly _userId: string;
  private readonly _name: string;
  private readonly _phone: string | null;

  constructor(
    id: string,
    userId: string,
    phone?: string | null,
  ) {
    if (!id) throw new Error("Customer ID cannot be empty.");
    if (!userId) throw new Error("User ID cannot be empty.");

    this._id = id;
    this._userId = userId;
    this._phone = phone ?? null;
  }

  get id() {
    return this._id;
  }

  get userId() {
    return this._userId;
  }



  get phone() {
    return this._phone;
  }
}
