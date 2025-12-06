export default class User {
  constructor(
    private _id: string,
    private _name: string,
    private _email: string,
    private _password?: string,
  ) {
    if (!_email) throw new Error('Email can not be empty');

    if (!_name) throw new Error('Name can not be empty');

    if (_password == '') throw new Error('Password can not be empty');
  }

  get id() {
    return this._id;
  }

  get email() {
    return this._email;
  }

  get name() {
    return this._name;
  }

  get paswword() {
    return this.paswword;
  }
}
