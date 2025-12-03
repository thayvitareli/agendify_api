import User from '../../src/core/identity/domain/entities/user.entity';


describe('User entity', () => {



  it('Should throw an error if e-mail is empty', () => {
    expect(()=> new User('abcd',"User one","", "h123ad9")).toThrow('Email can not be empty')
  });

   it('Should throw an error if name is empty', () => {
    expect(()=> new User('abcd',"","example@gmail.com", "h123ad9")).toThrow('Name can not be empty')
  });

  
   it('Should throw an error if password is empty', () => {
    expect(()=> new User('abcd',"User one","example@gmail.com", "")).toThrow('Password can not be empty')
  });
});
