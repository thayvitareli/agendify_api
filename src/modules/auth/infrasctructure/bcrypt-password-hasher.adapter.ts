import * as bcrypt from 'bcrypt';
import { IPasswordHasher } from '../domain/ports/password-hasher.port';

export class BcryptPasswordHasherAdapter implements IPasswordHasher {
  hash(pass: string): Promise<string> {
    return bcrypt.hash(pass, process.env.SALT);
  }
}
