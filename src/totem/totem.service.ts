import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Totem } from './totem.entity';
import { CreateTotemDto } from './dto/create-totem.dto';
import { UpdateTotemDto } from './dto/update-totem.dto';

@Injectable()
export class TotemService {
  constructor(
    @InjectRepository(Totem)
    private readonly repo: Repository<Totem>,
  ) {}

  async create(dto: CreateTotemDto): Promise<Totem> {
    const totem = this.repo.create(dto);
    return this.repo.save(totem);
  }

  async findAll(): Promise<Totem[]> {
    return this.repo.find();
  }

  async findOne(id: number): Promise<Totem> {
    const totem = await this.repo.findOneBy({ id });
    if (!totem) {
      throw new NotFoundException('Totem not found');
    }
    return totem;
  }

  async update(id: number, dto: UpdateTotemDto): Promise<Totem> {
    const totem = await this.findOne(id);
    Object.assign(totem, dto);
    return this.repo.save(totem);
  }

  async remove(id: number): Promise<void> {
    const totem = await this.findOne(id);
    await this.repo.remove(totem);
  }
}
