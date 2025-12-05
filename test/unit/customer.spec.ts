import {CustomerProfile} from '../../src/core/domain/entities/customer-profile.entity';


describe('CustomerProfile entity', () => {


  
  it('Should throw an error if id is empty', () => {
    expect(()=> new CustomerProfile('abcd',"")).toThrow('ID cannot be empty.')
  });

  it('Should throw an error if userId is empty', () => {
    expect(()=> new CustomerProfile('abcd',"")).toThrow('User ID cannot be empty.')
  });


});
