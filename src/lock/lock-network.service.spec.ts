import { Test, TestingModule } from '@nestjs/testing';
import { LockNetworkService } from './lock-network.service';
import { LockService } from './lock.service';
import { TotemService } from '../totem/totem.service';
import { LockStatus } from './lock.entity';
import { BadRequestException } from '@nestjs/common';

describe('LockNetworkService', () => {
  let service: LockNetworkService;

  const mockLockService = {
    findOne: jest.fn(),
    updateStatus: jest.fn(),
    updateTotemAssociation: jest.fn(), // <-- ADICIONAR AQUI
  };

  const mockTotemService = {
    findOne: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        LockNetworkService,
        {
          provide: LockService,
          useValue: mockLockService,
        },
        {
          provide: TotemService,
          useValue: mockTotemService,
        },
      ],
    }).compile();

    service = module.get<LockNetworkService>(LockNetworkService);

    jest.clearAllMocks();
  });

  describe('integrateLock (UC11)', () => {
    it('should integrate new lock into totem network', async () => {
      const lock = { id: 1, status: LockStatus.NEW, totemId: null };
      const totem = { id: 10 };

      mockLockService.findOne.mockResolvedValue(lock);
      mockTotemService.findOne.mockResolvedValue(totem);
      mockLockService.updateStatus.mockResolvedValue({
        ...lock,
        status: LockStatus.FREE,
      });
      mockLockService.updateTotemAssociation.mockResolvedValue({
        ...lock,
        totemId: 10,
      });

      await service.integrateLock(1, 10, 100);

      expect(mockLockService.findOne).toHaveBeenCalledWith(1);
      expect(mockTotemService.findOne).toHaveBeenCalledWith(10);
      expect(mockLockService.updateStatus).toHaveBeenCalledWith(
        1,
        LockStatus.FREE,
      );
      expect(mockLockService.updateTotemAssociation).toHaveBeenCalledWith(
        1,
        10,
      );
    });

    it('should integrate lock in repair into totem network', async () => {
      const lock = { id: 1, status: LockStatus.IN_REPAIR, totemId: null };
      const totem = { id: 10 };

      mockLockService.findOne.mockResolvedValue(lock);
      mockTotemService.findOne.mockResolvedValue(totem);
      mockLockService.updateStatus.mockResolvedValue({
        ...lock,
        status: LockStatus.FREE,
      });
      mockLockService.updateTotemAssociation.mockResolvedValue({
        ...lock,
        totemId: 10,
      });

      await service.integrateLock(1, 10, 100);

      expect(mockLockService.updateStatus).toHaveBeenCalledWith(
        1,
        LockStatus.FREE,
      );
      expect(mockLockService.updateTotemAssociation).toHaveBeenCalledWith(
        1,
        10,
      );
    });

    it('should throw BadRequestException if lock status is not NEW or IN_REPAIR', async () => {
      const lock = { id: 1, status: LockStatus.OCCUPIED };
      mockLockService.findOne.mockResolvedValue(lock);

      await expect(service.integrateLock(1, 10, 100)).rejects.toThrow(
        BadRequestException,
      );
      await expect(service.integrateLock(1, 10, 100)).rejects.toThrow(
        'Lock must have status NEW or IN_REPAIR',
      );
    });

    it('should throw BadRequestException if totem does not exist', async () => {
      const lock = { id: 1, status: LockStatus.NEW };
      mockLockService.findOne.mockResolvedValue(lock);
      mockTotemService.findOne.mockRejectedValue(
        new BadRequestException('Totem not found'),
      );

      await expect(service.integrateLock(1, 999, 100)).rejects.toThrow(
        BadRequestException,
      );
    });
  });

  describe('removeLock (UC12)', () => {
    it('should remove lock for repair', async () => {
      const lock = {
        id: 1,
        status: LockStatus.FREE,
        bicycleId: null,
        totemId: 10,
      };

      mockLockService.findOne.mockResolvedValue(lock);
      mockLockService.updateStatus.mockResolvedValue({
        ...lock,
        status: LockStatus.IN_REPAIR,
      });
      mockLockService.updateTotemAssociation.mockResolvedValue({
        ...lock,
        totemId: null,
      });

      await service.removeLock(1, 10, 100, 'EM_REPARO');

      expect(mockLockService.findOne).toHaveBeenCalledWith(1);
      expect(mockLockService.updateStatus).toHaveBeenCalledWith(
        1,
        LockStatus.IN_REPAIR,
      );
      expect(mockLockService.updateTotemAssociation).toHaveBeenCalledWith(
        1,
        null,
      );
    });

    it('should remove lock for retirement', async () => {
      const lock = {
        id: 1,
        status: LockStatus.FREE,
        bicycleId: null,
        totemId: 10,
      };

      mockLockService.findOne.mockResolvedValue(lock);
      mockLockService.updateStatus.mockResolvedValue({
        ...lock,
        status: LockStatus.RETIRED,
      });
      mockLockService.updateTotemAssociation.mockResolvedValue({
        ...lock,
        totemId: null,
      });

      await service.removeLock(1, 10, 100, 'APOSENTADA');

      expect(mockLockService.updateStatus).toHaveBeenCalledWith(
        1,
        LockStatus.RETIRED,
      );
      expect(mockLockService.updateTotemAssociation).toHaveBeenCalledWith(
        1,
        null,
      );
    });

    it('should throw BadRequestException if lock has bicycle', async () => {
      const lock = {
        id: 1,
        status: LockStatus.OCCUPIED,
        bicycleId: 5,
        totemId: 10,
      };
      mockLockService.findOne.mockResolvedValue(lock);

      await expect(service.removeLock(1, 10, 100, 'EM_REPARO')).rejects.toThrow(
        BadRequestException,
      );
      await expect(service.removeLock(1, 10, 100, 'EM_REPARO')).rejects.toThrow(
        'Lock must not have any bicycle',
      );
    });

    it('should throw BadRequestException for invalid action', async () => {
      const lock = {
        id: 1,
        status: LockStatus.FREE,
        bicycleId: null,
        totemId: 10,
      };
      mockLockService.findOne.mockResolvedValue(lock);

      await expect(
        service.removeLock(1, 10, 100, 'INVALID_ACTION'),
      ).rejects.toThrow(BadRequestException);
      await expect(
        service.removeLock(1, 10, 100, 'INVALID_ACTION'),
      ).rejects.toThrow('Invalid action');
    });
  });
});
