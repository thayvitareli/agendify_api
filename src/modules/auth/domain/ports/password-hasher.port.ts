export interface IPasswordHasher {
  hash(pass: string): Promise<string>;
  compare(pass: string, hashedPass: string): Promise<boolean>;
}
