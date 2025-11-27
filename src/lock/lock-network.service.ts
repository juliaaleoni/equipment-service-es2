import { Injectable, BadRequestException } from '@nestjs/common';
import { LockService } from './lock.service';
import { TotemService } from '../totem/totem.service';
import { LockStatus } from './lock.entity';

@Injectable()
export class LockNetworkService {
  constructor(
    private readonly lockService: LockService,
    private readonly totemService: TotemService,
  ) {}

  async integrateLock(
    lockId: number,
    totemId: number,
    _employeeId: number,
  ): Promise<void> {
    const lock = await this.lockService.findOne(lockId);

    if (
      lock.status !== LockStatus.NEW &&
      lock.status !== LockStatus.IN_REPAIR
    ) {
      throw new BadRequestException('Lock must have status NEW or IN_REPAIR');
    }

    await this.totemService.findOne(totemId);

    await this.lockService.updateStatus(lockId, LockStatus.FREE);

    await this.lockService.updateTotemAssociation(lockId, totemId);

    // Mock: Email notification
    console.log(`[EMAIL] To: admin@bikeshare.com`);
    console.log(`[EMAIL] Subject: Tranca integrada na rede`);
    console.log(
      `[EMAIL] Message: Tranca ${lockId} foi integrada ao totem ${totemId} pelo funcionário ${_employeeId}`,
    );
  }

  async removeLock(
    lockId: number,
    _totemId: number,
    _employeeId: number,
    action: string,
  ): Promise<void> {
    const lock = await this.lockService.findOne(lockId);

    if (lock.bicycleId !== null) {
      throw new BadRequestException('Lock must not have any bicycle');
    }

    const statusMap: Record<string, LockStatus> = {
      EM_REPARO: LockStatus.IN_REPAIR,
      APOSENTADA: LockStatus.RETIRED,
    };

    const newStatus = statusMap[action.toUpperCase()];
    if (!newStatus) {
      throw new BadRequestException('Invalid action');
    }

    await this.lockService.updateStatus(lockId, newStatus);

    await this.lockService.updateTotemAssociation(lockId, null);

    // Mock: Email notification
    console.log(`[EMAIL] To: admin@bikeshare.com`);
    console.log(`[EMAIL] Subject: Tranca removida da rede`);
    console.log(
      `[EMAIL] Message: Tranca ${lockId} foi removida com ação ${action} pelo funcionário ${_employeeId}`,
    );
  }
}
