import User from '../../src/modules/user/domain/model/user.model';

describe('User Model', () => {
  it('Should throw an error if e-mail is empty', () => {
    expect(() => new User('abcd', 'User one', '', 'h123ad9')).toThrow(
      'Email can not be empty',
    );
  });

  it('Should throw an error if name is empty', () => {
    expect(() => new User('abcd', '', 'example@gmail.com', 'h123ad9')).toThrow(
      'Name can not be empty',
    );
  });

  it('Should throw an error if password is a empty string', () => {
    expect(() => new User('abcd', 'User one', 'example@gmail.com', '')).toThrow(
      'Password can not be empty',
    );
  });

  it('Should instance a new User with password', () => {
    const user = new User('abcd', 'User one', 'user@example.com', 'pass123');
    expect(user).toBeInstanceOf(User);
    expect(user.id).toBe('abcd');
    expect(user.email).toBe('user@example.com');
    expect(user.name).toBe('User one');
  });

  it('Should instance a new User withlout password', () => {
    const user = new User('abcd', 'User one', 'user@example.com');
    expect(user).toBeInstanceOf(User);
    expect(user.id).toBe('abcd');
    expect(user.email).toBe('user@example.com');
    expect(user.name).toBe('User one');
  });
});
