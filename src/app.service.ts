import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Bicycle, BicycleStatus } from './bicycle/bicycle.entity';
import { Lock, LockStatus } from './lock/lock.entity';
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

  async restaurarDados(): Promise<{ message: string }> {
    // Clear all data from tables in correct order (respecting foreign keys)
    await this.lockRepo.clear();
    await this.bicycleRepo.clear();
    await this.totemRepo.clear();

    // Insert initial test data

    // 1. Create Totem
    await this.totemRepo.save([
      {
        id: 1,
        location: 'Rio de Janeiro',
        description: 'Totem Principal',
      },
    ]);

    // 2. Create Bicycles
    await this.bicycleRepo.save([
      {
        id: 1,
        marca: 'Caloi',
        modelo: 'Caloi',
        ano: '2020',
        numero: 12345,
        status: BicycleStatus.AVAILABLE,
      },
      {
        id: 2,
        marca: 'Caloi',
        modelo: 'Caloi',
        ano: '2020',
        numero: 12346,
        status: BicycleStatus.REPAIR_REQUESTED,
      },
      {
        id: 3,
        marca: 'Caloi',
        modelo: 'Caloi',
        ano: '2020',
        numero: 12347,
        status: BicycleStatus.IN_USE,
      },
      {
        id: 4,
        marca: 'Caloi',
        modelo: 'Caloi',
        ano: '2020',
        numero: 12348,
        status: BicycleStatus.IN_REPAIR,
      },
      {
        id: 5,
        marca: 'Caloi',
        modelo: 'Caloi',
        ano: '2020',
        numero: 12349,
        status: BicycleStatus.AVAILABLE,
      },
    ]);

    // 3. Create Locks
    await this.lockRepo.save([
      {
        id: 1,
        number: 1001,
        location: 'Rio de Janeiro',
        manufactureYear: '2020',
        model: 'Caloi',
        status: LockStatus.OCCUPIED,
        bicycleId: 1,
        totemId: 1,
      },
      {
        id: 2,
        number: 1002,
        location: 'Rio de Janeiro',
        manufactureYear: '2020',
        model: 'Caloi',
        status: LockStatus.FREE,
        bicycleId: null,
        totemId: 1,
      },
      {
        id: 3,
        number: 1003,
        location: 'Rio de Janeiro',
        manufactureYear: '2020',
        model: 'Caloi',
        status: LockStatus.OCCUPIED,
        bicycleId: 2,
        totemId: 1,
      },
      {
        id: 4,
        number: 1004,
        location: 'Rio de Janeiro',
        manufactureYear: '2020',
        model: 'Caloi',
        status: LockStatus.OCCUPIED,
        bicycleId: 5,
        totemId: 1,
      },
      {
        id: 5,
        number: 1005,
        location: 'Rio de Janeiro',
        manufactureYear: '2020',
        model: 'Caloi',
        status: LockStatus.IN_REPAIR,
        bicycleId: null,
        totemId: null,
      },
      {
        id: 6,
        number: 1006,
        location: 'Rio de Janeiro',
        manufactureYear: '2020',
        model: 'Caloi',
        status: LockStatus.IN_REPAIR,
        bicycleId: null,
        totemId: 1,
      },
    ]);

    return { message: 'Dados restaurados com sucesso' };
  }
}
