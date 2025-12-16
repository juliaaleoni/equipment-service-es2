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
    await this.lockRepo.delete({});
    await this.bicycleRepo.delete({});
    await this.totemRepo.delete({});

    // Reset sequences to start from 1
    await this.totemRepo.query(`ALTER SEQUENCE totems_id_seq RESTART WITH 1`);
    await this.bicycleRepo.query(
      `ALTER SEQUENCE bicycles_id_seq RESTART WITH 1`,
    );
    await this.lockRepo.query(`ALTER SEQUENCE locks_id_seq RESTART WITH 1`);

    // Insert initial test data

    // 1. Create Totem
    const totem = await this.totemRepo.save({
      location: 'Rio de Janeiro',
      description: 'Totem Principal',
    });

    // 2. Create Bicycles
    const bicycle1 = await this.bicycleRepo.save({
      marca: 'Caloi',
      modelo: 'Caloi',
      ano: '2020',
      numero: 12345,
      status: BicycleStatus.AVAILABLE,
    });

    const bicycle2 = await this.bicycleRepo.save({
      marca: 'Caloi',
      modelo: 'Caloi',
      ano: '2020',
      numero: 12346,
      status: BicycleStatus.REPAIR_REQUESTED,
    });

    const _bicycle3 = await this.bicycleRepo.save({
      marca: 'Caloi',
      modelo: 'Caloi',
      ano: '2020',
      numero: 12347,
      status: BicycleStatus.IN_USE,
    });

    const _bicycle4 = await this.bicycleRepo.save({
      marca: 'Caloi',
      modelo: 'Caloi',
      ano: '2020',
      numero: 12348,
      status: BicycleStatus.IN_REPAIR,
    });

    const bicycle5 = await this.bicycleRepo.save({
      marca: 'Caloi',
      modelo: 'Caloi',
      ano: '2020',
      numero: 12349,
      status: BicycleStatus.AVAILABLE,
    });

    // 3. Create Locks
    await this.lockRepo.save({
      number: 1001,
      location: 'Rio de Janeiro',
      manufactureYear: '2020',
      model: 'Caloi',
      status: LockStatus.OCCUPIED,
      bicycleId: bicycle1.id,
      totemId: totem.id,
    });

    await this.lockRepo.save({
      number: 1002,
      location: 'Rio de Janeiro',
      manufactureYear: '2020',
      model: 'Caloi',
      status: LockStatus.FREE,
      bicycleId: null,
      totemId: totem.id,
    });

    await this.lockRepo.save({
      number: 1003,
      location: 'Rio de Janeiro',
      manufactureYear: '2020',
      model: 'Caloi',
      status: LockStatus.OCCUPIED,
      bicycleId: bicycle2.id,
      totemId: totem.id,
    });

    await this.lockRepo.save({
      number: 1004,
      location: 'Rio de Janeiro',
      manufactureYear: '2020',
      model: 'Caloi',
      status: LockStatus.OCCUPIED,
      bicycleId: bicycle5.id,
      totemId: totem.id,
    });

    await this.lockRepo.save({
      number: 1005,
      location: 'Rio de Janeiro',
      manufactureYear: '2020',
      model: 'Caloi',
      status: LockStatus.IN_REPAIR,
      bicycleId: null,
      totemId: null,
    });

    await this.lockRepo.save({
      number: 1006,
      location: 'Rio de Janeiro',
      manufactureYear: '2020',
      model: 'Caloi',
      status: LockStatus.IN_REPAIR,
      bicycleId: null,
      totemId: totem.id,
    });

    return { message: 'Dados restaurados com sucesso' };
  }
}
