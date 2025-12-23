import { JwtService } from '@nestjs/jwt';

export class JwtAdapter {
  constructor(private readonly jwtService: JwtService) {}
  async sign(payload: object): Promise<string> {
    return await this.jwtService.sign({ ...payload });
  }
}
