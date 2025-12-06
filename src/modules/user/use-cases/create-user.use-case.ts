import { v4 as uuidv4 } from 'uuid';
import { IUserRepository } from '../domain/repositories/user.repository';
import { CreateUserDto } from '../presentation/dto/create-user.dto';
import User from '../domain/model/user.model';
import { IPasswordHasherPort } from 'src/modules/auth/domain/ports/password-hasher.port';

export default class CreateUserUseCase {
  constructor(
    private readonly userRepository: IUserRepository,
    private readonly passwordHasher: IPasswordHasherPort,
  ) {}

  async execute(input: CreateUserDto) {
    const { email, name, password } = input;

    const emailAreadyInUse = await this.userRepository.findByEmail(email);

    if (emailAreadyInUse) throw new Error('E-mail cannot be used');

    const hashPassword = await this.passwordHasher.hash(password);

    const newUser = new User(uuidv4(), name, email, hashPassword);

    await this.userRepository.create(newUser);
  }
}
