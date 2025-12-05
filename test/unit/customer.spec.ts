import { CustomerProfile } from '../../src/core/domain/entities/customer-profile.entity';

describe('CustomerProfile entity', () => {
  it('Should throw an error if id is empty', () => {
    expect(() => new CustomerProfile('abcd', '')).toThrow(
      'ID cannot be empty.',
    );
  });

  it('Should throw an error if userId is empty', () => {
    expect(() => new CustomerProfile('abcd', '')).toThrow(
      'User ID cannot be empty.',
    );
  });

  it('Should instance a new Customer with phone', () => {
    const user = new CustomerProfile('abcd', 'UserId', '0000000000');
    expect(user).toBeInstanceOf(CustomerProfile);
    expect(user.id).toBe('abcd');
    expect(user.userId).toBe('UserId');
    expect(user.phone).toBe('0000000000');
  });

  it('Should instance a new Customer  without phone', () => {
    const user = new CustomerProfile('abcd', 'UserId');
    expect(user).toBeInstanceOf(CustomerProfile);
    expect(user.id).toBe('abcd');
    expect(user.userId).toBe('UserId');
    expect(user.phone).toBe(null);
  });
});
