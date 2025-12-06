import { Customer } from '../../src/modules/customer/domain/model/customer.model';

describe('Customer Model', () => {
  it('Should throw an error if id is empty', () => {
    expect(() => new Customer('abcd', '')).toThrow('ID cannot be empty.');
  });

  it('Should throw an error if userId is empty', () => {
    expect(() => new Customer('abcd', '')).toThrow('User ID cannot be empty.');
  });

  it('Should instance a new Customer with phone', () => {
    const user = new Customer('abcd', 'UserId', '0000000000');
    expect(user).toBeInstanceOf(Customer);
    expect(user.id).toBe('abcd');
    expect(user.userId).toBe('UserId');
    expect(user.phone).toBe('0000000000');
  });

  it('Should instance a new Customer  without phone', () => {
    const user = new Customer('abcd', 'UserId');
    expect(user).toBeInstanceOf(Customer);
    expect(user.id).toBe('abcd');
    expect(user.userId).toBe('UserId');
    expect(user.phone).toBe(null);
  });
});
