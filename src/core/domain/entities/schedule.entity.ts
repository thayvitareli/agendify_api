export class Schedule {
  constructor(
    private readonly _id: string,
    private readonly _barbershopId: string,
    private readonly _customerId: string,
    private readonly _serviceId: string,
    private readonly _startAt: Date,
    private readonly _endAt: Date,
    private _status: 'PENDING' | 'CONFIRMED' | 'CANCELED' = 'PENDING',
    private _canceledAt?: Date | null,
  ) {
    if (_endAt <= _startAt) throw new Error('End must be after start.');
  }

  cancel() {
    if (this._status === 'CANCELED') {
      throw new Error('Schedule already canceled.');
    }
    this._status = 'CANCELED';
    this._canceledAt = new Date();
  }

  get id() {
    return this._id;
  }
  get startAt() {
    return this._startAt;
  }
  get endAt() {
    return this._endAt;
  }
  get barbershopId() {
    return this._barbershopId;
  }
  get customerId() {
    return this._customerId;
  }
  get serviceId() {
    return this._serviceId;
  }
  get canceledAt() {
    return this._canceledAt;
  }
  get status() {
    return this._status;
  }
}
