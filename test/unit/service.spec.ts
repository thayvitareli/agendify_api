import {Service} from '../../src/core/domain/entities/service.entity';


describe('Service entity', () => {


  
  it('Should throw an error if name is empty', () => {
    expect(()=> new Service('serviceId','barbershopId','',10,20)).toThrow('Service name cannot be empty.')
  });

  it('Should throw an error if price is negative', () => {
    expect(()=> new Service('serviceId','barbershopId','serviceName',10,-1)).toThrow('Price cannot be negative.')
  });

    it('Should throw an error if duration is less than or equal to zero', () => {
    expect(()=> new Service('serviceId','barbershopId','serviceName',-10,20)).toThrow('Duration must be greater than 0')
  });


  
    it('Should instance a new Service', () => {
    const service = new Service('serviceId','barbershopId','serviceName',10,20)
    expect(service).toBeInstanceOf(Service)
    expect(service.id).toBe('serviceId')
    expect(service.barbershopId).toBe('barbershopId')
    expect(service.price).toBe(20)
    expect(service.durationMinutes).toBe(10)

  });


});
