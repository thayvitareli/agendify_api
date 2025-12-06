export interface IPasswordHasherPort {
  hash(pass: string): Promise<string>;
}
