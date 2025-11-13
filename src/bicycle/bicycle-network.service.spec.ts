import { Test, TestingModule } from '@nestjs/testing';
import { BicycleNetworkService } from './bicycle-network.service';
import { BicycleService } from './bicycle.service';
import { LockService } from '../lock/lock.service';
import { BicycleStatus } from './bicycle.entity';
import { LockStatus } from '../lock/lock.entity';
import { BadRequestException } from '@nestjs/common';

describe('BicycleNetworkService', () => {
  let service: BicycleNetworkService;

  const mockBicycleService = {
    findOne: jest.fn(),
    updateStatus: jest.fn(),
  };

  const mockLockService = {
    findOne: jest.fn(),
    lockBicycle: jest.fn(),
    unlockBicycle: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        BicycleNetworkService,
        {
          provide: BicycleService,
          useValue: mockBicycleService,
        },
        {
          provide: LockService,
          useValue: mockLockService,
        },
      ],
    }).compile();

    service = module.get<BicycleNetworkService>(BicycleNetworkService);

    jest.clearAllMocks();
  });

  describe('integrateBicycle (UC08)', () => {
    it('should integrate new bicycle into network', async () => {
      const bicycle = { id: 1, status: BicycleStatus.NEW };
      const lock = { id: 10, status: LockStatus.FREE, bicycleId: null };

      mockBicycleService.findOne.mockResolvedValue(bicycle);
      mockLockService.findOne.mockResolvedValue(lock);
      mockBicycleService.updateStatus.mockResolvedValue({
        ...bicycle,
        status: BicycleStatus.AVAILABLE,
      });
      mockLockService.lockBicycle.mockResolvedValue({
        ...lock,
        status: LockStatus.OCCUPIED,
        bicycleId: 1,
      });

      await service.integrateBicycle(1, 10, 100);

      expect(mockBicycleService.findOne).toHaveBeenCalledWith(1);
      expect(mockLockService.findOne).toHaveBeenCalledWith(10);
      expect(mockBicycleService.updateStatus).toHaveBeenCalledWith(
        1,
        BicycleStatus.AVAILABLE,
      );
      expect(mockLockService.lockBicycle).toHaveBeenCalledWith(10, 1);
    });

    it('should integrate bicycle in repair into network', async () => {
      const bicycle = { id: 1, status: BicycleStatus.IN_REPAIR };
      const lock = { id: 10, status: LockStatus.FREE, bicycleId: null };

      mockBicycleService.findOne.mockResolvedValue(bicycle);
      mockLockService.findOne.mockResolvedValue(lock);
      mockBicycleService.updateStatus.mockResolvedValue({
        ...bicycle,
        status: BicycleStatus.AVAILABLE,
      });
      mockLockService.lockBicycle.mockResolvedValue({
        ...lock,
        status: LockStatus.OCCUPIED,
        bicycleId: 1,
      });

      await service.integrateBicycle(1, 10, 100);

      expect(mockBicycleService.updateStatus).toHaveBeenCalledWith(
        1,
        BicycleStatus.AVAILABLE,
      );
    });

    it('should throw BadRequestException if bicycle status is not NEW or IN_REPAIR', async () => {
      const bicycle = { id: 1, status: BicycleStatus.IN_USE };
      mockBicycleService.findOne.mockResolvedValue(bicycle);

      await expect(service.integrateBicycle(1, 10, 100)).rejects.toThrow(
        BadRequestException,
      );
    });

    it('should throw BadRequestException if lock is not FREE', async () => {
      const bicycle = { id: 1, status: BicycleStatus.NEW };
      const lock = { id: 10, status: LockStatus.OCCUPIED };

      mockBicycleService.findOne.mockResolvedValue(bicycle);
      mockLockService.findOne.mockResolvedValue(lock);

      await expect(service.integrateBicycle(1, 10, 100)).rejects.toThrow(
        BadRequestException,
      );
    });
  });

  describe('removeBicycle (UC09)', () => {
    it('should remove bicycle for repair', async () => {
      const bicycle = { id: 1, status: BicycleStatus.REPAIR_REQUESTED };
      const lock = { id: 10, status: LockStatus.OCCUPIED, bicycleId: 1 };

      mockBicycleService.findOne.mockResolvedValue(bicycle);
      mockLockService.findOne.mockResolvedValue(lock);
      mockBicycleService.updateStatus.mockResolvedValue({
        ...bicycle,
        status: BicycleStatus.IN_REPAIR,
      });
      mockLockService.unlockBicycle.mockResolvedValue({
        ...lock,
        status: LockStatus.FREE,
        bicycleId: null,
      });

      await service.removeBicycle(1, 10, 100, 'EM_REPARO');

      expect(mockBicycleService.updateStatus).toHaveBeenCalledWith(
        1,
        BicycleStatus.IN_REPAIR,
      );
      expect(mockLockService.unlockBicycle).toHaveBeenCalledWith(10);
    });

    it('should remove bicycle for retirement', async () => {
      const bicycle = { id: 1, status: BicycleStatus.REPAIR_REQUESTED };
      const lock = { id: 10, status: LockStatus.OCCUPIED, bicycleId: 1 };

      mockBicycleService.findOne.mockResolvedValue(bicycle);
      mockLockService.findOne.mockResolvedValue(lock);
      mockBicycleService.updateStatus.mockResolvedValue({
        ...bicycle,
        status: BicycleStatus.RETIRED,
      });
      mockLockService.unlockBicycle.mockResolvedValue({
        ...lock,
        status: LockStatus.FREE,
        bicycleId: null,
      });

      await service.removeBicycle(1, 10, 100, 'APOSENTADA');

      expect(mockBicycleService.updateStatus).toHaveBeenCalledWith(
        1,
        BicycleStatus.RETIRED,
      );
    });

    it('should throw BadRequestException if bicycle status is not REPAIR_REQUESTED', async () => {
      const bicycle = { id: 1, status: BicycleStatus.AVAILABLE };
      mockBicycleService.findOne.mockResolvedValue(bicycle);

      await expect(
        service.removeBicycle(1, 10, 100, 'EM_REPARO'),
      ).rejects.toThrow(BadRequestException);
    });

    it('should throw BadRequestException if lock does not have this bicycle', async () => {
      const bicycle = { id: 1, status: BicycleStatus.REPAIR_REQUESTED };
      const lock = { id: 10, status: LockStatus.OCCUPIED, bicycleId: 999 };

      mockBicycleService.findOne.mockResolvedValue(bicycle);
      mockLockService.findOne.mockResolvedValue(lock);

      await expect(
        service.removeBicycle(1, 10, 100, 'EM_REPARO'),
      ).rejects.toThrow(BadRequestException);
    });
  });
});
