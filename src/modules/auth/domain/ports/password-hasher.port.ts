export interface IPasswordHasher {
  hash(pass: string): Promise<string>;
}
