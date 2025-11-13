import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Lock, LockStatus } from './lock.entity';
import { CreateLockDto } from './dto/create-lock.dto';
import { UpdateLockDto } from './dto/update-lock.dto';

@Injectable()
export class LockService {
  constructor(
    @InjectRepository(Lock)
    private readonly repo: Repository<Lock>,
  ) {}

  async create(dto: CreateLockDto): Promise<Lock> {
    const number = await this.generateNumber();
    const lock = this.repo.create({
      ...dto,
      number,
      status: LockStatus.NEW,
    });
    return this.repo.save(lock);
  }

  async findAll(): Promise<Lock[]> {
    return this.repo.find();
  }

  async findOne(id: number): Promise<Lock> {
    const lock = await this.repo.findOneBy({ id });
    if (!lock) {
      throw new NotFoundException('Lock not found');
    }
    return lock;
  }

  async update(id: number, dto: UpdateLockDto): Promise<Lock> {
    const lock = await this.findOne(id);
    Object.assign(lock, dto);
    return this.repo.save(lock);
  }

  async remove(id: number): Promise<void> {
    const lock = await this.findOne(id);
    if (lock.bicycleId) {
      throw new BadRequestException('Cannot delete lock with bicycle attached');
    }
    await this.repo.remove(lock);
  }

  async updateStatus(id: number, status: LockStatus): Promise<Lock> {
    const lock = await this.findOne(id);
    lock.status = status;
    return this.repo.save(lock);
  }

  async lockBicycle(id: number, bicycleId?: number): Promise<Lock> {
    const lock = await this.findOne(id);
    if (lock.status === LockStatus.OCCUPIED) {
      throw new BadRequestException('Lock is already occupied');
    }
    lock.status = LockStatus.OCCUPIED;
    if (bicycleId) {
      lock.bicycleId = bicycleId;
    }
    return this.repo.save(lock);
  }

  async unlockBicycle(id: number): Promise<Lock> {
    const lock = await this.findOne(id);
    lock.status = LockStatus.FREE;
    lock.bicycleId = null;
    return this.repo.save(lock);
  }

  async getBicycle(id: number): Promise<number> {
    const lock = await this.findOne(id);
    if (!lock.bicycleId) {
      throw new NotFoundException('No bicycle in this lock');
    }
    return lock.bicycleId;
  }

  private async generateNumber(): Promise<number> {
    const lastLock = await this.repo.findOne({
      order: { number: 'DESC' },
    });
    return lastLock ? lastLock.number + 1 : 1;
  }

  async findByTotemId(totemId: number): Promise<Lock[]> {
    return this.repo.find({ where: { totemId } });
  }

  async updateTotemAssociation(
    id: number,
    totemId: number | null,
  ): Promise<Lock> {
    const lock = await this.findOne(id);
    lock.totemId = totemId;
    return this.repo.save(lock);
  }
}
