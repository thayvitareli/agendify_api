export class Service {
    private readonly _id: string;
    private readonly _barbershopId: string;
    private _name: string;
    private _durationMinutes: number;
    private _price: number;
    private _active: boolean = true;

  constructor(
    id: string,
    barbershopId: string,
    name: string,
    durationMinutes: number,
    price: number,
    active: boolean = true,
  ) {
    if (!barbershopId) throw new Error('Barbershop ID cannot be empty.');
    if (!name) throw new Error('Service name cannot be empty.');

    if (durationMinutes <= 0)
      throw new Error('Duration must be greater than 0.');

    if (price < 0)
      throw new Error('Price cannot be negative.');

    this._id=id;
    this._barbershopId=barbershopId;
    this._name=name;
    this._durationMinutes=durationMinutes; 
    this._price=price; 
    this._active = true
  }

  get id() { return this._id; }
  get barbershopId() { return this._barbershopId; }
  get name() { return this._name; }
  get durationMinutes() { return this._durationMinutes; }
  get price() { return this._price; }
  get active() { return this._active; }

  updatePrice(price: number) {
    if (price < 0) throw new Error('Price cannot be negative.');
    this._price = price;
  }

  updateDuration(duration: number) {
    if (duration <= 0) throw new Error('Duration must be > 0.');
   
    this._durationMinutes = duration;
  }

  deactivate() {
    this._active = false;
  }

  activate() {
    this._active = true;
  }
}
