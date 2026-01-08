import User from '../../domain/model/user.model';

export interface UserHttp {
  id: string;
  name: string;
  email: string;
}

export class UserPresenter {
  static toHttp(user: User): UserHttp {
    return {
      id: user.id,
      name: user.name,
      email: user.email,
    };
  }
}
