import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { LockService } from './lock.service';
import { Lock, LockStatus } from './lock.entity';
import { NotFoundException, BadRequestException } from '@nestjs/common';

describe('LockService', () => {
  let service: LockService;

  const mockRepo = {
    create: jest.fn(),
    save: jest.fn(),
    find: jest.fn(),
    findOne: jest.fn(),
    findOneBy: jest.fn(),
    remove: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        LockService,
        {
          provide: getRepositoryToken(Lock),
          useValue: mockRepo,
        },
      ],
    }).compile();

    service = module.get<LockService>(LockService);

    jest.clearAllMocks();
  });

  describe('create', () => {
    it('should create lock with status NEW and generated number', async () => {
      const dto = {
        location: '-22.9068,-43.1729',
        manufactureYear: '2023',
        model: 'Model X',
      };

      mockRepo.findOne.mockResolvedValue(null);
      mockRepo.create.mockReturnValue({
        ...dto,
        number: 1,
        status: LockStatus.NEW,
      });
      mockRepo.save.mockResolvedValue({
        id: 1,
        ...dto,
        number: 1,
        status: LockStatus.NEW,
      });

      const result = await service.create(dto);

      expect(result.status).toBe(LockStatus.NEW);
      expect(result.number).toBe(1);
    });
  });

  describe('findAll', () => {
    it('should return array of locks', async () => {
      const locks = [
        {
          id: 1,
          location: '-22.9068,-43.1729',
          manufactureYear: '2023',
          model: 'Model X',
          number: 1,
          status: LockStatus.NEW,
        },
      ];
      mockRepo.find.mockResolvedValue(locks);

      const result = await service.findAll();

      expect(result).toEqual(locks);
    });
  });

  describe('findOne', () => {
    it('should return lock if found', async () => {
      const lock = {
        id: 1,
        location: '-22.9068,-43.1729',
        manufactureYear: '2023',
        model: 'Model X',
        number: 1,
        status: LockStatus.NEW,
      };
      mockRepo.findOneBy.mockResolvedValue(lock);

      const result = await service.findOne(1);

      expect(result).toEqual(lock);
    });

    it('should throw NotFoundException if not found', async () => {
      mockRepo.findOneBy.mockResolvedValue(null);

      await expect(service.findOne(999)).rejects.toThrow(NotFoundException);
    });
  });

  describe('update', () => {
    it('should update lock', async () => {
      const lock = {
        id: 1,
        location: '-22.9068,-43.1729',
        manufactureYear: '2023',
        model: 'Model X',
        number: 1,
        status: LockStatus.NEW,
      };
      const dto = { model: 'Model Y' };

      mockRepo.findOneBy.mockResolvedValue(lock);
      mockRepo.save.mockResolvedValue({ ...lock, ...dto });

      const result = await service.update(1, dto);

      expect(result.model).toBe('Model Y');
    });

    it('should throw NotFoundException if lock not found', async () => {
      mockRepo.findOneBy.mockResolvedValue(null);

      await expect(service.update(999, { model: 'Test' })).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('remove', () => {
    it('should throw BadRequestException if lock has bicycle', async () => {
      const lock = { id: 1, status: LockStatus.OCCUPIED, bicycleId: 5 };
      mockRepo.findOneBy.mockResolvedValue(lock);

      await expect(service.remove(1)).rejects.toThrow(BadRequestException);
    });

    it('should remove lock if no bicycle attached', async () => {
      const lock = { id: 1, status: LockStatus.FREE, bicycleId: null };
      mockRepo.findOneBy.mockResolvedValue(lock);
      mockRepo.remove.mockResolvedValue(lock);

      await service.remove(1);

      expect(mockRepo.remove).toHaveBeenCalledWith(lock);
    });
  });

  describe('updateStatus', () => {
    it('should update lock status', async () => {
      const lock = { id: 1, status: LockStatus.NEW };
      mockRepo.findOneBy.mockResolvedValue(lock);
      mockRepo.save.mockResolvedValue({ ...lock, status: LockStatus.FREE });

      const result = await service.updateStatus(1, LockStatus.FREE);

      expect(result.status).toBe(LockStatus.FREE);
    });
  });

  describe('lockBicycle', () => {
    it('should lock bicycle', async () => {
      const lock = { id: 1, status: LockStatus.FREE, bicycleId: null };
      mockRepo.findOneBy.mockResolvedValue(lock);
      mockRepo.save.mockResolvedValue({
        ...lock,
        status: LockStatus.OCCUPIED,
        bicycleId: 5,
      });

      const result = await service.lockBicycle(1, 5);

      expect(result.status).toBe(LockStatus.OCCUPIED);
      expect(result.bicycleId).toBe(5);
    });

    it('should throw BadRequestException if already occupied', async () => {
      const lock = { id: 1, status: LockStatus.OCCUPIED, bicycleId: 3 };
      mockRepo.findOneBy.mockResolvedValue(lock);

      await expect(service.lockBicycle(1, 5)).rejects.toThrow(
        BadRequestException,
      );
    });
  });

  describe('unlockBicycle', () => {
    it('should unlock bicycle', async () => {
      const lock = { id: 1, status: LockStatus.OCCUPIED, bicycleId: 5 };
      mockRepo.findOneBy.mockResolvedValue(lock);
      mockRepo.save.mockResolvedValue({
        ...lock,
        status: LockStatus.FREE,
        bicycleId: null,
      });

      const result = await service.unlockBicycle(1);

      expect(result.status).toBe(LockStatus.FREE);
      expect(result.bicycleId).toBeNull();
    });
  });

  describe('getBicycle', () => {
    it('should return bicycle id', async () => {
      const lock = { id: 1, bicycleId: 5 };
      mockRepo.findOneBy.mockResolvedValue(lock);

      const result = await service.getBicycle(1);

      expect(result).toBe(5);
    });

    it('should throw NotFoundException if no bicycle', async () => {
      const lock = { id: 1, bicycleId: null };
      mockRepo.findOneBy.mockResolvedValue(lock);

      await expect(service.getBicycle(1)).rejects.toThrow(NotFoundException);
    });
  });
  describe('updateTotemAssociation', () => {
    it('should associate lock with totem', async () => {
      const lock = {
        id: 1,
        number: 1,
        location: '-22.9068,-43.1729',
        manufactureYear: '2023',
        model: 'Model X',
        status: LockStatus.NEW,
        bicycleId: null,
        totemId: null,
      };
      const expected = { ...lock, totemId: 10 };
  
      mockRepo.findOneBy.mockResolvedValue(lock);
      mockRepo.save.mockResolvedValue(expected);
  
      const result = await service.updateTotemAssociation(1, 10);
  
      expect(mockRepo.findOneBy).toHaveBeenCalledWith({ id: 1 });
      expect(mockRepo.save).toHaveBeenCalledWith({ ...lock, totemId: 10 });
      expect(result).toEqual(expected);
    });
  
    it('should disassociate lock from totem', async () => {
      const lock = {
        id: 1,
        number: 1,
        location: '-22.9068,-43.1729',
        manufactureYear: '2023',
        model: 'Model X',
        status: LockStatus.FREE,
        bicycleId: null,
        totemId: 10,
      };
      const expected = { ...lock, totemId: null };
  
      mockRepo.findOneBy.mockResolvedValue(lock);
      mockRepo.save.mockResolvedValue(expected);
  
      const result = await service.updateTotemAssociation(1, null);
  
      expect(mockRepo.findOneBy).toHaveBeenCalledWith({ id: 1 });
      expect(mockRepo.save).toHaveBeenCalledWith({ ...lock, totemId: null });
      expect(result).toEqual(expected);
    });
  
    it('should throw NotFoundException if lock not found', async () => {
      mockRepo.findOneBy.mockResolvedValue(null);
  
      await expect(service.updateTotemAssociation(999, 10)).rejects.toThrow(
        NotFoundException,
      );
    });
  });
});
