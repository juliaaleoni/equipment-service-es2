import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Bicycle } from './bicycle/bicycle.entity';
import { Lock } from './lock/lock.entity';
import { Totem } from './totem/totem.entity';

@Injectable()
export class AppService {
  constructor(
    @InjectRepository(Bicycle)
    private readonly bicycleRepo: Repository<Bicycle>,
    @InjectRepository(Lock)
    private readonly lockRepo: Repository<Lock>,
    @InjectRepository(Totem)
    private readonly totemRepo: Repository<Totem>,
  ) {}

  getHello(): string {
    return 'Hello World!';
  }

  async restoreDatabase(): Promise<{ message: string }> {
    // Clear all data from tables in correct order (respecting foreign keys)
    await this.bicycleRepo.delete({});
    await this.lockRepo.delete({});
    await this.totemRepo.delete({});

    return { message: 'Banco restaurado com sucesso' };
  }
}
