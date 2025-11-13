import { Injectable, BadRequestException } from '@nestjs/common';
import { BicycleService } from './bicycle.service';
import { LockService } from '../lock/lock.service';
import { BicycleStatus } from './bicycle.entity';
import { LockStatus } from '../lock/lock.entity';

@Injectable()
export class BicycleNetworkService {
  constructor(
    private readonly bicycleService: BicycleService,
    private readonly lockService: LockService,
  ) {}

  async integrateBicycle(
    bicycleId: number,
    lockId: number,
    _employeeId: number,
  ): Promise<void> {
    const bicycle = await this.bicycleService.findOne(bicycleId);

    if (
      bicycle.status !== BicycleStatus.NEW &&
      bicycle.status !== BicycleStatus.IN_REPAIR
    ) {
      throw new BadRequestException(
        'Bicycle must have status NEW or IN_REPAIR',
      );
    } 

    const lock = await this.lockService.findOne(lockId);

    if (lock.status !== LockStatus.FREE) {
      throw new BadRequestException('Lock must be FREE');
    } 

    await this.bicycleService.updateStatus(bicycleId, BicycleStatus.AVAILABLE); 

    await this.lockService.lockBicycle(lockId, bicycleId); // Email notification not implemented in this delivery
  }

  async removeBicycle(
    bicycleId: number,
    lockId: number,
    _employeeId: number,
    action: string,
  ): Promise<void> {
    const bicycle = await this.bicycleService.findOne(bicycleId);

    if (bicycle.status !== BicycleStatus.REPAIR_REQUESTED) {
      throw new BadRequestException(
        'Bicycle must have status REPAIR_REQUESTED',
      );
    }

    const lock = await this.lockService.findOne(lockId);

    if (lock.bicycleId !== bicycleId) {
      throw new BadRequestException('Lock does not have this bicycle');
    } 

    const statusMap: Record<string, BicycleStatus> = {
      EM_REPARO: BicycleStatus.IN_REPAIR,
      APOSENTADA: BicycleStatus.RETIRED,
    };

    const newStatus = statusMap[action.toUpperCase()];
    if (!newStatus) {
      throw new BadRequestException('Invalid action');
    }

    await this.bicycleService.updateStatus(bicycleId, newStatus);

    await this.lockService.unlockBicycle(lockId); // Email notification not implemented in this delivery
  }
}
