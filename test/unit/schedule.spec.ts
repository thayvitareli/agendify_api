import e from 'express';
import {Schedule} from '../../src/core/domain/entities/schedule.entity';


describe('Schedule entity', () => {

  it('Should throw an error if end is after start', () => {
      const startDate = new Date('2025-02-01 13:00')
      const endDate = new Date('2025-02-01 12:00')

      expect(()=> new Schedule('shId', 'barbershopId','customerId', 'serviceId',startDate,endDate )).toThrow('End must be after start.')
  });
  
    it('Should instance a new Schedule', () => {
      const startDate = new Date('2025-02-01 13:00')
      const endDate = new Date('2025-02-01 13:30')

      const shedule = new Schedule('shId', 'barbershopId','customerId', 'serviceId',startDate,endDate)
      
      expect(shedule.id).toBe('shId')
      expect(shedule.barbershopId).toBe('barbershopId')
      expect(shedule.serviceId).toBe('serviceId')
      expect(shedule.startAt).toBe(startDate)
      expect(shedule.endAt).toBe(endDate)


  });

  
    it('Should throw an error if try cancel a schedule cancelled', () => {
      const startDate = new Date('2025-02-01 13:00')
      const endDate = new Date('2025-02-01 13:30')

      const shedule = new Schedule('shId', 'barbershopId','customerId', 'serviceId',startDate,endDate)

      shedule.cancel()

      expect(()=> shedule.cancel()).toThrow('Schedule already canceled.')
   });

   
    it('Should cancel a schedule', () => {
      const startDate = new Date('2025-02-01 13:00')
      const endDate = new Date('2025-02-01 13:30')

      const shedule = new Schedule('shId', 'barbershopId','customerId', 'serviceId',startDate,endDate)

      shedule.cancel()

      expect(shedule.status).toBe('CANCELED')
   });



});
