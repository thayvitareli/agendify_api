export default class User {
  constructor(
    private _id: string,
    private _name: string,
    private _email: string,
    private _password?: string,
  ) {
    if (!_email) throw new Error('Email can not be empty');
    User.validateEmail(_email);

    if (!_name) throw new Error('Name can not be empty');

    if (_password == '') throw new Error('Password can not be empty');

    this._id = _id;
    this._name = _name;
    this._email = _email;
    this._password = _password;
  }

  static validateEmail(email: string) {
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      throw new Error('Invalid email');
    }
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

  get password() {
    return this._password;
  }
}
