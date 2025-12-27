import User from 'src/modules/user/domain/model/user.model';
import { UserEntity } from '../../infrastructure/entity/user.entity';

export class UserMapper {
  static toDomain(entity: UserEntity): User {
    return new User(entity.id, entity.name, entity.email, entity.password);
  }

  static toPersistence(domain: User): UserEntity {
    const entity = new UserEntity();
    entity.id = domain.id;
    entity.name = domain.name;
    entity.email = domain.email;

    if (domain.password !== undefined) entity.password = domain.password ?? '';

    return entity;
  }
}
