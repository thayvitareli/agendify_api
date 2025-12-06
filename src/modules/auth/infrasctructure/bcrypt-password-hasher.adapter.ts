import * as bcrypt from 'bcrypt';
import { IPasswordHasherPort } from '../domain/ports/password-hasher.port';

export class BcryptPasswordHasherAdapter implements IPasswordHasherPort {
  hash(pass: string): Promise<string> {
    return bcrypt.hash(pass, process.env.SALT);
  }
}
