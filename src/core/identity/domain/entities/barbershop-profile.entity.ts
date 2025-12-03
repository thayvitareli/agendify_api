import { Address } from "../value_objects/address.vo";

export class Barbershop {
     private _id: string;
    private _ownerUserId: string;
    private _name:string;
     private _address: Address

    
  constructor(
   id:string, userId:string, phone:string, name:string,address: Address,
  ) {

    if(!userId) throw new Error('UserId can not be empyt')
    if(!name) throw new Error('Name can not be empyt')


    this._id=id;
    this._ownerUserId=userId;
    this._name=name;
    this._address =address;
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

   get address() {
    return this._address;
  }

 
}
