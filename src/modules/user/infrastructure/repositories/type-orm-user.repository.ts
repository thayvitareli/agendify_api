import { Repository } from 'typeorm';
import { UserEntity } from '../entity/user.entity';
import { UserMapper } from '../../presentation/mappers/user.mapper';
import { IUserRepository } from 'src/modules/user/domain/repositories/user.repository';
import User from '../../domain/model/user.model';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class TypeORMUserRepository implements IUserRepository {
  constructor(
    @InjectRepository(UserEntity)
    private repository: Repository<UserEntity>,
  ) {}

  async save(user: User): Promise<User> {
    const userEntity = UserMapper.toPersistence(user);
    const saved = await this.repository.save(userEntity);
    return UserMapper.toDomain(saved);
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
