import { Test, TestingModule } from '@nestjs/testing';
import { TotemController } from './totem.controller';
import { TotemService } from './totem.service';
import { LockService } from '../lock/lock.service';
import { BicycleService } from '../bicycle/bicycle.service';

describe('TotemController', () => {
  let controller: TotemController;

  const mockService = {
    create: jest.fn(),
    findAll: jest.fn(),
    findOne: jest.fn(),
    update: jest.fn(),
    remove: jest.fn(),
  };

  const mockLockService = {
    findByTotemId: jest.fn(),
  };

  const mockBicycleService = {
    findByIds: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TotemController],
      providers: [
        {
          provide: TotemService,
          useValue: mockService,
        },
        {
          provide: LockService,
          useValue: mockLockService,
        },
        {
          provide: BicycleService,
          useValue: mockBicycleService,
        },
      ],
    }).compile();

    controller = module.get<TotemController>(TotemController);

    jest.clearAllMocks();
  });

  it('should create totem', async () => {
    const dto = { location: '-22.9068,-43.1729', description: 'Main Station' };
    const expected = { id: 1, ...dto };

    mockService.create.mockResolvedValue(expected);

    const result = await controller.create(dto);

    expect(mockService.create).toHaveBeenCalledWith(dto);
    expect(result).toEqual(expected);
  });

  it('should find all totems', async () => {
    const expected = [
      { id: 1, location: '-22.9068,-43.1729', description: 'Main Station' },
    ];
    mockService.findAll.mockResolvedValue(expected);

    const result = await controller.findAll();

    expect(result).toEqual(expected);
  });

  it('should find one totem', async () => {
    const expected = {
      id: 1,
      location: '-22.9068,-43.1729',
      description: 'Main Station',
    };
    mockService.findOne.mockResolvedValue(expected);

    const result = await controller.findOne('1');

    expect(mockService.findOne).toHaveBeenCalledWith(1);
    expect(result).toEqual(expected);
  });

  it('should update totem', async () => {
    const dto = { description: 'Updated Station' };
    const expected = {
      id: 1,
      location: '-22.9068,-43.1729',
      description: 'Updated Station',
    };
    mockService.update.mockResolvedValue(expected);

    const result = await controller.update('1', dto);

    expect(mockService.update).toHaveBeenCalledWith(1, dto);
    expect(result).toEqual(expected);
  });

  it('should remove totem', async () => {
    mockService.remove.mockResolvedValue(undefined);

    await controller.remove('1');

    expect(mockService.remove).toHaveBeenCalledWith(1);
  });

  it('should get locks from totem', async () => {
    const locks = [{ id: 1, totemId: 1 }];
    mockService.findOne.mockResolvedValue({ id: 1 });
    mockLockService.findByTotemId.mockResolvedValue(locks);

    const result = await controller.getLocksFromTotem('1');

    expect(mockService.findOne).toHaveBeenCalledWith(1);
    expect(mockLockService.findByTotemId).toHaveBeenCalledWith(1);
    expect(result).toEqual(locks);
  });

  it('should get bicycles from totem', async () => {
    const locks = [
      { id: 1, bicycleId: 5 },
      { id: 2, bicycleId: null },
    ];
    const bicycles = [{ id: 5 }];

    mockService.findOne.mockResolvedValue({ id: 1 });
    mockLockService.findByTotemId.mockResolvedValue(locks);
    mockBicycleService.findByIds.mockResolvedValue(bicycles);

    const result = await controller.getBicyclesFromTotem('1');

    expect(mockService.findOne).toHaveBeenCalledWith(1);
    expect(mockLockService.findByTotemId).toHaveBeenCalledWith(1);
    expect(mockBicycleService.findByIds).toHaveBeenCalledWith([5]);
    expect(result).toEqual(bicycles);
  });
});
