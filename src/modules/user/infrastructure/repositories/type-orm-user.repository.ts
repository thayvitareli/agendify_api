import { Repository } from 'typeorm';
import { UserEntity } from '../entity/user.entity';
import { UserMapper } from '../../presentation/mappers/user.mapper';
import { IUserRepository } from 'src/modules/user/domain/repositories/user.repository';
import User from '../../domain/model/user.model';

export class TypeORMUserRepository implements IUserRepository {
  private readonly repository: Repository<UserEntity>;

  constructor(repository: Repository<UserEntity>) {
    this.repository = repository;
  }

  async create(user: User): Promise<void> {
    const userEntity = UserMapper.toPersistence(user);
    this.repository.create(userEntity);
  }

  async findById(id: string): Promise<User | null> {
    const userEntity = await this.repository.findOne({ where: { id } });
    return userEntity ? UserMapper.toDomain(userEntity) : null;
  }

  async findByEmail(email: string): Promise<User | null> {
    const userEntity = await this.repository.findOne({ where: { email } });
    return userEntity ? UserMapper.toDomain(userEntity) : null;
  }
}
