export class Schedule {
   private readonly _id: string;
    private readonly _barbershopId: string;
    private readonly _customerId: string;
    private readonly _serviceId: string;
    private readonly _startAt: Date;
    private readonly _endAt: Date;
    private _status: 'PENDING' | 'CONFIRMED' | 'CANCELED';
    private _canceledAt?: Date | null;

  constructor(
   id:string,
   barbershopId: string,
   customerId:string,
   serviceId:string,
   startAt:Date,
   endAt:Date,
  ) {
    if (endAt <= startAt) throw new Error('End must be after start.');

    this._id = id;
    this._barbershopId = barbershopId;
    this._customerId = customerId;
    this._serviceId = serviceId;
    this._startAt = startAt;
    this._endAt = endAt
  }

  cancel() {
    if (this._status === 'CANCELED') {
      throw new Error('Schedule already canceled.');
    }
    this._status = 'CANCELED';
    this._canceledAt = new Date();
  }

  get id() { return this._id; }
  get startAt() { return this._startAt; }
  get endAt() { return this._endAt; }
  get barbershopId() { return this._barbershopId; }
  get customerId() { return this._customerId; }
  get serviceId() { return this._serviceId; }
  get canceledAt() { return this._canceledAt; }
  get status() { return this._status; }


}
