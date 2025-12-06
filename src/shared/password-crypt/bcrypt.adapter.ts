import { IPasswordCrypt } from './password-crypt.interface';
import * as bcrypt from 'bcrypt';

export class BCrypt implements IPasswordCrypt {
  hash(pass: string): Promise<string> {
    return bcrypt.hash();
  }
}
