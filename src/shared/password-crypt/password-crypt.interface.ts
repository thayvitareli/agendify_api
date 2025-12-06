export interface IPasswordCrypt {
  hash(pass: string): Promise<string>;
}
