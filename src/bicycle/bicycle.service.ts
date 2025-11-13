import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';
import { Bicycle, BicycleStatus } from './bicycle.entity';
import { CreateBicycleDto } from './dto/create-bicycle.dto';
import { UpdateBicycleDto } from './dto/update-bicycle.dto';

@Injectable()
export class BicycleService {
  constructor(
    @InjectRepository(Bicycle)
    private readonly repo: Repository<Bicycle>,
  ) {}

  async create(dto: CreateBicycleDto): Promise<Bicycle> {
    const number = await this.generateNumber();
    const bicycle = this.repo.create({
      ...dto,
      number,
      status: BicycleStatus.NEW,
    });
    return this.repo.save(bicycle);
  }

  async findAll(): Promise<Bicycle[]> {
    return this.repo.find();
  }

  async findOne(id: number): Promise<Bicycle> {
    const bicycle = await this.repo.findOneBy({ id });
    if (!bicycle) {
      throw new NotFoundException('Bicycle not found');
    }
    return bicycle;
  }

  async update(id: number, dto: UpdateBicycleDto): Promise<Bicycle> {
    const bicycle = await this.findOne(id);
    Object.assign(bicycle, dto);
    return this.repo.save(bicycle);
  }

  async remove(id: number): Promise<void> {
    const bicycle = await this.findOne(id);
    if (bicycle.status !== BicycleStatus.RETIRED) {
      throw new BadRequestException('Only retired bicycles can be deleted');
    }
    await this.repo.remove(bicycle);
  }

  async updateStatus(id: number, status: BicycleStatus): Promise<Bicycle> {
    const bicycle = await this.findOne(id);
    bicycle.status = status;
    return this.repo.save(bicycle);
  }

  private async generateNumber(): Promise<number> {
    const lastBicycle = await this.repo.findOne({
      order: { number: 'DESC' },
    });
    return lastBicycle ? lastBicycle.number + 1 : 1;
  }

  async findByIds(ids: number[]): Promise<Bicycle[]> {
    if (ids.length === 0) return [];
    return this.repo.findBy({ id: In(ids) });
  }
}
