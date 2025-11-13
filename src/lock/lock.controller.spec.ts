import { Test, TestingModule } from '@nestjs/testing';
import { LockController } from './lock.controller';
import { LockService } from './lock.service';
import { LockNetworkService } from './lock-network.service';
import { LockStatus } from './lock.entity';

describe('LockController', () => {
  let controller: LockController;

  const mockService = {
    create: jest.fn(),
    findAll: jest.fn(),
    findOne: jest.fn(),
    update: jest.fn(),
    remove: jest.fn(),
    lockBicycle: jest.fn(),
    unlockBicycle: jest.fn(),
  };

  const mockNetworkService = {
    integrateLock: jest.fn(),
    removeLock: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [LockController],
      providers: [
        {
          provide: LockService,
          useValue: mockService,
        },
        {
          provide: LockNetworkService,
          useValue: mockNetworkService,
        },
      ],
    }).compile();

    controller = module.get<LockController>(LockController);

    jest.clearAllMocks();
  });

  it('should create lock', async () => {
    const dto = {
      location: '-22.9068,-43.1729',
      manufactureYear: '2023',
      model: 'Model X',
    };
    const expected = { id: 1, ...dto, number: 1, status: LockStatus.NEW };

    mockService.create.mockResolvedValue(expected);
    const result = await controller.create(dto);

    expect(mockService.create).toHaveBeenCalledWith(dto);
    expect(result).toEqual(expected);
  });

  it('should find all locks', async () => {
    const expected = [
      {
        id: 1,
        location: '-22.9068,-43.1729',
        manufactureYear: '2023',
        model: 'Model X',
        number: 1,
        status: LockStatus.NEW,
      },
    ];
    mockService.findAll.mockResolvedValue(expected);

    const result = await controller.findAll();

    expect(mockService.findAll).toHaveBeenCalled();
    expect(result).toEqual(expected);
  });

  it('should find one lock', async () => {
    const expected = {
      id: 1,
      location: '-22.9068,-43.1729',
      manufactureYear: '2023',
      model: 'Model X',
      number: 1,
      status: LockStatus.NEW,
    };
    mockService.findOne.mockResolvedValue(expected);

    const result = await controller.findOne('1');

    expect(mockService.findOne).toHaveBeenCalledWith(1);
    expect(result).toEqual(expected);
  });

  it('should update lock', async () => {
    const dto = { model: 'Model Y' };
    const expected = {
      id: 1,
      location: '-22.9068,-43.1729',
      manufactureYear: '2023',
      model: 'Model Y',
      number: 1,
      status: LockStatus.NEW,
    };

    mockService.update.mockResolvedValue(expected);
    const result = await controller.update('1', dto);

    expect(mockService.update).toHaveBeenCalledWith(1, dto);
    expect(result).toEqual(expected);
  });

  it('should remove lock', async () => {
    mockService.remove.mockResolvedValue(undefined);

    await controller.remove('1');

    expect(mockService.remove).toHaveBeenCalledWith(1);
  });

  it('should lock bicycle', async () => {
    const expected = { id: 1, status: LockStatus.OCCUPIED, bicycleId: 5 };
    mockService.lockBicycle.mockResolvedValue(expected);

    const result = await controller.lockBicycle('1', { idBicicleta: 5 });

    expect(mockService.lockBicycle).toHaveBeenCalledWith(1, 5);
    expect(result).toEqual(expected);
  });

  it('should unlock bicycle', async () => {
    const expected = { id: 1, status: LockStatus.FREE, bicycleId: null };
    mockService.unlockBicycle.mockResolvedValue(expected);

    const result = await controller.unlockBicycle('1');

    expect(mockService.unlockBicycle).toHaveBeenCalledWith(1);
    expect(result).toEqual(expected);
  });

  it('should integrate lock into network', async () => {
    mockNetworkService.integrateLock.mockResolvedValue(undefined);

    await controller.integrateLock({
      idTranca: 1,
      idTotem: 10,
      idFuncionario: 100,
    });

    expect(mockNetworkService.integrateLock).toHaveBeenCalledWith(1, 10, 100);
  });

  it('should remove lock from network', async () => {
    mockNetworkService.removeLock.mockResolvedValue(undefined);

    await controller.removeLock({
      idTranca: 1,
      idTotem: 10,
      idFuncionario: 100,
      statusAcaoReparador: 'EM_REPARO',
    });

    expect(mockNetworkService.removeLock).toHaveBeenCalledWith(
      1,
      10,
      100,
      'EM_REPARO',
    );
  });
});
