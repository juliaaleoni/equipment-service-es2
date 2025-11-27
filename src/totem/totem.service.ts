import {
  Injectable,
  NotFoundException,
  BadRequestException,
  Inject,
  forwardRef,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Totem } from './totem.entity';
import { CreateTotemDto } from './dto/create-totem.dto';
import { UpdateTotemDto } from './dto/update-totem.dto';
import { LockService } from '../lock/lock.service';

@Injectable()
export class TotemService {
  constructor(
    @InjectRepository(Totem)
    private readonly repo: Repository<Totem>,
    @Inject(forwardRef(() => LockService))
    private readonly lockService: LockService,
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

    // Validate totem has no locks before deleting
    const locks = await this.lockService.findByTotemId(id);
    if (locks.length > 0) {
      throw new BadRequestException(
        'Cannot delete totem with associated locks. Remove all locks first.',
      );
    }

    await this.repo.remove(totem);
  }
}
