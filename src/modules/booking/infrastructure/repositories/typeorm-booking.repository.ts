import { Between, Repository } from 'typeorm';
import { IBookingRepository } from '../../domain/repositories/booking.repository';
import { Booking } from '../../domain/model/booking.model';
import { BookingEntity } from '../entity/booking.entity';
import { BookingMapper } from '../../presentation/mappers/booking.mapper';
import { InjectRepository } from '@nestjs/typeorm';

export class TypeORMBookingRepository implements IBookingRepository {
  constructor(
    @InjectRepository(BookingEntity)
    private readonly repository: Repository<BookingEntity>,
  ) {}

  async save(booking: Booking): Promise<Booking | null> {
    const entity = BookingMapper.toPersistence(booking);
    const savedEntity = await this.repository.save(entity);
    return savedEntity ? BookingMapper.toDomain(savedEntity) : null;
  }
  async findById(id: string): Promise<Booking | null> {
    const entity = await this.repository.findOne({ where: { id } });
    return entity ? BookingMapper.toDomain(entity) : null;
  }

  async findManyByCustomerId(
    customerId: string,
    options?: {
      page?: number;
      limit?: number;
      sortBy?: 'startAt' | 'endAt' | 'status';
      sortOrder?: 'ASC' | 'DESC';
    },
  ): Promise<{ bookings: Booking[]; total: number }> {
    const sortBy = options?.sortBy ?? 'startAt';
    const sortOrder = options?.sortOrder ?? 'ASC';
    const page = options?.page ?? 1;
    const limit = options?.limit ?? 20;

    const query = this.repository
      .createQueryBuilder('booking')
      .where('booking.customerId = :customerId', { customerId })
      .orderBy(`booking.${sortBy}`, sortOrder)
      .skip((page - 1) * limit)
      .take(limit);

    const [entities, total] = await query.getManyAndCount();
    return { bookings: entities.map(BookingMapper.toDomain), total };
  }

  async findManyByBarbershopId(
    barbershopId: string,
    options?: {
      page?: number;
      limit?: number;
      sortBy?: 'startAt' | 'endAt' | 'status';
      sortOrder?: 'ASC' | 'DESC';
    },
  ): Promise<{ bookings: Booking[]; total: number }> {
    const sortBy = options?.sortBy ?? 'startAt';
    const sortOrder = options?.sortOrder ?? 'ASC';
    const page = options?.page ?? 1;
    const limit = options?.limit ?? 20;

    const query = this.repository
      .createQueryBuilder('booking')
      .where('booking.barbershopId = :barbershopId', { barbershopId })
      .orderBy(`booking.${sortBy}`, sortOrder)
      .skip((page - 1) * limit)
      .take(limit);

    const [entities, total] = await query.getManyAndCount();
    return { bookings: entities.map(BookingMapper.toDomain), total };
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
