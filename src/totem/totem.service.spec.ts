import { getRepositoryToken } from '@nestjs/typeorm';
import { NotFoundException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { Totem } from './totem.entity';
import { CreateTotemDto } from './dto/create-totem.dto';
import { UpdateTotemDto } from './dto/update-totem.dto';
import { TotemService } from './totem.service';
import { LockService } from '../lock/lock.service';

describe('TotemService', () => {
  let service: TotemService;
  const mockTotem = {
    id: 1,
    location: '-22.9068,-43.1729',
    description: 'Main Station',
  };

  const mockRepo = {
    create: jest.fn().mockImplementation((dto: CreateTotemDto) => dto),
    save: jest.fn().mockResolvedValue(mockTotem),
    find: jest.fn().mockResolvedValue([mockTotem]),
    findOneBy: jest.fn().mockResolvedValue(mockTotem),
    remove: jest.fn(),
  };

  const mockLockService = {
    findByTotemId: jest.fn().mockResolvedValue([]), // Default: no locks
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TotemService,
        {
          provide: getRepositoryToken(Totem),
          useValue: mockRepo,
        },
        {
          provide: LockService,
          useValue: mockLockService,
        },
      ],
    }).compile();

    service = module.get<TotemService>(TotemService);

    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should create a totem', async () => {
    const dto: CreateTotemDto = {
      location: '-22.9068,-43.1729',
      description: 'Main Station',
    };
    const result = await service.create(dto);
    expect(mockRepo.create).toHaveBeenCalledWith(dto);
    expect(mockRepo.save).toHaveBeenCalledWith(dto);
    expect(result).toEqual(mockTotem);
  });

  it('should find all totems', async () => {
    const result = await service.findAll();
    expect(mockRepo.find).toHaveBeenCalled();
    expect(result).toEqual([mockTotem]);
  });

  describe('findOne', () => {
    it('should find one totem by id', async () => {
      const result = await service.findOne(1);
      expect(mockRepo.findOneBy).toHaveBeenCalledWith({ id: 1 });
      expect(result).toEqual(mockTotem);
    });

    it('should throw NotFoundException if totem not found', async () => {
      mockRepo.findOneBy.mockResolvedValue(null);
      await expect(service.findOne(99)).rejects.toThrow(NotFoundException);
    });
  });

  describe('update', () => {
    it('should update a totem', async () => {
      const dto: UpdateTotemDto = { description: 'New Description' };
      const existingTotem = { ...mockTotem };
      const updatedTotem = { ...existingTotem, ...dto };

      mockRepo.findOneBy.mockResolvedValue(existingTotem);
      mockRepo.save.mockResolvedValue(updatedTotem);

      const result = await service.update(1, dto);

      expect(mockRepo.findOneBy).toHaveBeenCalledWith({ id: 1 });
      expect(mockRepo.save).toHaveBeenCalledWith(
        expect.objectContaining({ description: 'New Description' }),
      );
      expect(result).toEqual(updatedTotem);
    });

    it('should throw NotFoundException on update if totem not found', async () => {
      const dto: UpdateTotemDto = { description: 'New Description' };
      mockRepo.findOneBy.mockResolvedValue(null);

      await expect(service.update(99, dto)).rejects.toThrow(NotFoundException);
    });
  });

  describe('remove', () => {
    it('should remove a totem', async () => {
      const existingTotem = { ...mockTotem };
      mockRepo.findOneBy.mockResolvedValue(existingTotem);
      mockRepo.remove.mockResolvedValue(undefined);

      await service.remove(1);

      expect(mockRepo.findOneBy).toHaveBeenCalledWith({ id: 1 });
      expect(mockRepo.remove).toHaveBeenCalledWith(existingTotem);
    });

    it('should throw NotFoundException on remove if totem not found', async () => {
      mockRepo.findOneBy.mockResolvedValue(null);
      await expect(service.remove(99)).rejects.toThrow(NotFoundException);
    });
  });
});
