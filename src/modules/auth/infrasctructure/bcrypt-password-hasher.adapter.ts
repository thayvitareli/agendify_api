import * as bcrypt from 'bcrypt';
import { IPasswordHasher } from '../domain/ports/password-hasher.port';

export class BcryptPasswordHasherAdapter implements IPasswordHasher {
  hash(pass: string): Promise<string> {
    return bcrypt.hash(pass, Number(process.env.SALT) || 10);
  }

  async compare(pass: string, hashedPass: string): Promise<boolean> {
    return await bcrypt.compare(pass, hashedPass);
  }
}
