export interface IJwtAdapter {
  sign(payload: object): Promise<string>;
}
