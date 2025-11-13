import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { BicycleService } from './bicycle.service';
import { Bicycle, BicycleStatus } from './bicycle.entity';
import { NotFoundException, BadRequestException } from '@nestjs/common';

describe('BicycleService', () => {
  let service: BicycleService;

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
        BicycleService,
        {
          provide: getRepositoryToken(Bicycle),
          useValue: mockRepo,
        },
      ],
    }).compile();

    service = module.get<BicycleService>(BicycleService);

    jest.clearAllMocks();
  });

  describe('create', () => {
    it('should create bicycle with status NEW and generated number', async () => {
      const dto = { brand: 'Caloi', model: 'Elite', year: '2023' };

      mockRepo.findOne.mockResolvedValue(null);
      mockRepo.create.mockReturnValue({
        ...dto,
        number: 1,
        status: BicycleStatus.NEW,
      });
      mockRepo.save.mockResolvedValue({
        id: 1,
        ...dto,
        number: 1,
        status: BicycleStatus.NEW,
      });

      const result = await service.create(dto);

      expect(result.status).toBe(BicycleStatus.NEW);
      expect(result.number).toBe(1);
    });
  });

  describe('findAll', () => {
    it('should return array of bicycles', async () => {
      const bicycles = [
        {
          id: 1,
          brand: 'Caloi',
          model: 'Elite',
          year: '2023',
          number: 1,
          status: BicycleStatus.NEW,
        },
      ];
      mockRepo.find.mockResolvedValue(bicycles);

      const result = await service.findAll();

      expect(result).toEqual(bicycles);
    });
  });

  describe('findOne', () => {
    it('should return bicycle if found', async () => {
      const bicycle = {
        id: 1,
        brand: 'Caloi',
        model: 'Elite',
        year: '2023',
        number: 1,
        status: BicycleStatus.NEW,
      };
      mockRepo.findOneBy.mockResolvedValue(bicycle);

      const result = await service.findOne(1);

      expect(result).toEqual(bicycle);
    });

    it('should throw NotFoundException if not found', async () => {
      mockRepo.findOneBy.mockResolvedValue(null);

      await expect(service.findOne(999)).rejects.toThrow(NotFoundException);
    });
  });

  describe('update', () => {
    it('should update bicycle', async () => {
      const bicycle = {
        id: 1,
        brand: 'Caloi',
        model: 'Elite',
        year: '2023',
        number: 1,
        status: BicycleStatus.NEW,
      };
      const dto = { brand: 'Specialized' };

      mockRepo.findOneBy.mockResolvedValue(bicycle);
      mockRepo.save.mockResolvedValue({ ...bicycle, ...dto });

      const result = await service.update(1, dto);

      expect(result.brand).toBe('Specialized');
    });

    it('should throw NotFoundException if bicycle not found', async () => {
      mockRepo.findOneBy.mockResolvedValue(null);

      await expect(service.update(999, { brand: 'Test' })).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('remove', () => {
    it('should throw BadRequestException if bicycle is not retired', async () => {
      const bicycle = { id: 1, status: BicycleStatus.AVAILABLE };
      mockRepo.findOneBy.mockResolvedValue(bicycle);

      await expect(service.remove(1)).rejects.toThrow(BadRequestException);
    });

    it('should remove bicycle if status is RETIRED', async () => {
      const bicycle = { id: 1, status: BicycleStatus.RETIRED };
      mockRepo.findOneBy.mockResolvedValue(bicycle);
      mockRepo.remove.mockResolvedValue(bicycle);

      await service.remove(1);

      expect(mockRepo.remove).toHaveBeenCalledWith(bicycle);
    });
  });

  describe('updateStatus', () => {
    it('should update bicycle status', async () => {
      const bicycle = { id: 1, status: BicycleStatus.NEW };
      mockRepo.findOneBy.mockResolvedValue(bicycle);
      mockRepo.save.mockResolvedValue({
        ...bicycle,
        status: BicycleStatus.AVAILABLE,
      });

      const result = await service.updateStatus(1, BicycleStatus.AVAILABLE);

      expect(result.status).toBe(BicycleStatus.AVAILABLE);
    });
  });
});
