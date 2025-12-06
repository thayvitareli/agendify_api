import { v4 as uuidv4 } from 'uuid';
import { IUserRepository } from '../domain/repositories/user.repository';
import { CreateUserDto } from '../presentation/dto/create-user.dto';
import User from '../domain/model/user.model';
import { IPasswordCrypt } from 'src/shared/password-crypt/password-crypt.interface';

export default class CreateUserUseCase {
  constructor(
    private readonly userRepository: IUserRepository,
    private readonly passwordCrypt: IPasswordCrypt,
  ) {}

  async execute(input: CreateUserDto) {
    const { email, name, password } = input;

    const emailAreadyInUse = await this.userRepository.findByEmail(email);

    if (emailAreadyInUse) throw new Error('E-mail cannot be used');

    const hashPassword = await this.passwordCrypt.hash(password);

    const newUser = new User(uuidv4(), name, email, hashPassword);

    await this.userRepository.create(newUser);
  }
}
