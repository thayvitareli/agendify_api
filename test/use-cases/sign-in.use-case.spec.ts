import { UnauthorizedException } from '@nestjs/common';
import { SignInUseCase } from 'src/modules/auth/use-cases/sign-in.use-case';
import { IUserRepository } from 'src/modules/user/domain/repositories/user.repository';
import { IPasswordHasher } from 'src/modules/auth/domain/ports/password-hasher.port';
import { IJwtAdapter } from 'src/modules/auth/domain/ports/jwt.port';

describe('SignInUseCase', () => {
  const userRepo: jest.Mocked<IUserRepository> = {
    save: jest.fn(),
    findById: jest.fn(),
    findByEmail: jest.fn(),
  } as unknown as jest.Mocked<IUserRepository>;

  const hasher: jest.Mocked<IPasswordHasher> = {
    hash: jest.fn(),
    compare: jest.fn(),
  } as unknown as jest.Mocked<IPasswordHasher>;

  const jwt: jest.Mocked<IJwtAdapter> = {
    sign: jest.fn(),
  } as unknown as jest.Mocked<IJwtAdapter>;

  beforeEach(() => {
    jest.clearAllMocks();
    userRepo.findByEmail.mockResolvedValue(null);
    hasher.compare.mockResolvedValue(false);
    jwt.sign.mockResolvedValue('signed-token');
  });

  it('should throw UnauthorizedException when user is not found', async () => {
    const useCase = new SignInUseCase(userRepo, hasher, jwt);

    await expect(useCase.execute('noone@example.com', 'pass')).rejects.toThrow(
      UnauthorizedException,
    );
  });

  it('should throw UnauthorizedException when password is invalid', async () => {
    const user = { id: 'user-id', email: 'john@example.com', password: 'hash' };
    userRepo.findByEmail.mockResolvedValueOnce(user as any);
    hasher.compare.mockResolvedValueOnce(false);

    const useCase = new SignInUseCase(userRepo, hasher, jwt);

    await expect(
      useCase.execute('john@example.com', 'wrong-pass'),
    ).rejects.toThrow(UnauthorizedException);
  });

  it('should return an access token when credentials are valid', async () => {
    const user = { id: 'user-id', email: 'john@example.com', password: 'hash' };
    userRepo.findByEmail.mockResolvedValueOnce(user as any);
    hasher.compare.mockResolvedValueOnce(true);
    jwt.sign.mockResolvedValueOnce('access-token');

    const useCase = new SignInUseCase(userRepo, hasher, jwt);

    const result = await useCase.execute('john@example.com', 'correct-pass');

    expect(result).toEqual({ accessToken: 'access-token' });
    expect(jwt.sign).toHaveBeenCalledWith({
      sub: 'user-id',
      email: 'john@example.com',
    });
  });
});
