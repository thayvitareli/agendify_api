import { Between, Repository } from 'typeorm';
import { IBookingRepository } from '../../domain/repositories/booking.repository';
import { Booking } from '../../domain/model/booking.model';
import { BookingEntity } from '../entity/booking.entity';
import { BookingMapper } from '../../presentation/mappers/booking.mapper';

export class TypeORMBookingRepository implements IBookingRepository {
  private repository: Repository<BookingEntity>;

  constructor(repository: Repository<BookingEntity>) {
    this.repository = repository;
  }

  async save(booking: Booking): Promise<Booking | null> {
    const entity = BookingMapper.toPersistence(booking);
    const savedEntity = await this.repository.save(entity);
    return savedEntity ? BookingMapper.toDomain(savedEntity) : null;
  }
  async findById(id: string): Promise<Booking | null> {
    const entity = await this.repository.findOne({ where: { id } });
    return entity ? BookingMapper.toDomain(entity) : null;
  }
  async findManyByBarbershopId(barbershopId: string): Promise<Booking[]> {
    const entities = await this.repository.find({ where: { barbershopId } });
    return entities.map(BookingMapper.toDomain);
  }

  async findManyByCustomerId(customerId: string): Promise<Booking[]> {
    const entities = await this.repository.find({ where: { customerId } });
    return entities.map(BookingMapper.toDomain);
  }

  async findManyByBarbershopIdBetween(
    barbershopId: string,
    from: Date,
    to: Date,
  ): Promise<Booking[]> {
    const entities = await this.repository.find({
      where: {
        barbershopId,
        startAt: Between(from, to),
      },
    });
    return entities.map(BookingMapper.toDomain);
  }
}
