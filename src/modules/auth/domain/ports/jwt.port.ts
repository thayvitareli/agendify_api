export interface IJwtAdapter {
  sign(payload: object): Promise<string>;
  verify<TPayload extends object = any>(token: string): Promise<TPayload>;
}
