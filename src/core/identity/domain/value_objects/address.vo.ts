export class Address {
      private readonly _street: string;
    private readonly _number: string;
    private readonly _city: string;
    private readonly _state: string;
    private readonly _zipCode: string;
    
  constructor(
    street: string,
    number: string,
    city: string,
    state: string,
    zipCode: string,
  ) {
    if (!street) throw new Error('Street cannot be empty.');
    if (!city) throw new Error('City cannot be empty.');
    if (!state) throw new Error('State cannot be empty.');

    this._street = street;
    this._number = number;
    this._city = city;
    this._state= state;
    this._zipCode= zipCode;
  }

 
}
