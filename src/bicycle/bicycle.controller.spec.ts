import { Test, TestingModule } from '@nestjs/testing';
import { BicycleController } from './bicycle.controller';
import { BicycleService } from './bicycle.service';
import { BicycleNetworkService } from './bicycle-network.service';
import { BicycleStatus } from './bicycle.entity';
import { CreateBicycleDto } from './dto/create-bicycle.dto';
import { UpdateBicycleDto } from './dto/update-bicycle.dto';

describe('BicycleController', () => {
  let controller: BicycleController;

  const mockService = {
    create: jest.fn(),
    findAll: jest.fn(),
    findOne: jest.fn(),
    update: jest.fn(),
    remove: jest.fn(),
    updateStatus: jest.fn(),
  };

  const mockNetworkService = {
    integrateBicycle: jest.fn(),
    removeBicycle: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [BicycleController],
      providers: [
        {
          provide: BicycleService,
          useValue: mockService,
        },
        {
          provide: BicycleNetworkService,
          useValue: mockNetworkService,
        },
      ],
    }).compile();

    controller = module.get<BicycleController>(BicycleController);

    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should create bicycle', async () => {
    const dto: CreateBicycleDto = {
      brand: 'Caloi',
      model: 'Elite',
      year: '2023',
    };
    const expected = { id: 1, ...dto, number: 1, status: BicycleStatus.NEW };

    mockService.create.mockResolvedValue(expected);
    const result = await controller.create(dto);

    expect(mockService.create).toHaveBeenCalledWith(dto);
    expect(result).toEqual(expected);
  });

  it('should find all bicycles', async () => {
    const expected = [
      {
        id: 1,
        brand: 'Caloi',
        model: 'Elite',
        year: '2023',
        number: 1,
        status: BicycleStatus.NEW,
      },
    ];
    mockService.findAll.mockResolvedValue(expected);
    const result = await controller.findAll();

    expect(mockService.findAll).toHaveBeenCalled();
    expect(result).toEqual(expected);
  });

  it('should find one bicycle', async () => {
    const expected = {
      id: 1,
      brand: 'Caloi',
      model: 'Elite',
      year: '2023',
      number: 1,
      status: BicycleStatus.NEW,
    };
    mockService.findOne.mockResolvedValue(expected);
    const result = await controller.findOne('1');

    expect(mockService.findOne).toHaveBeenCalledWith(1);
    expect(result).toEqual(expected);
  });

  it('should update bicycle', async () => {
    const dto: UpdateBicycleDto = { brand: 'Specialized' };
    const expected = {
      id: 1,
      brand: 'Specialized',
      model: 'Elite',
      year: '2023',
      number: 1,
      status: BicycleStatus.NEW,
    };
    mockService.update.mockResolvedValue(expected);
    const result = await controller.update('1', dto);

    expect(mockService.update).toHaveBeenCalledWith(1, dto);
    expect(result).toEqual(expected);
  });

  it('should remove bicycle', async () => {
    mockService.remove.mockResolvedValue(undefined);
    await controller.remove('1');
    expect(mockService.remove).toHaveBeenCalledWith(1);
  });

  it('should update bicycle status', async () => {
    const expected = { id: 1, status: BicycleStatus.AVAILABLE };
    mockService.updateStatus.mockResolvedValue(expected);

    const result = await controller.updateStatus('1', 'DISPONIVEL');

    expect(mockService.updateStatus).toHaveBeenCalledWith(
      1,
      BicycleStatus.AVAILABLE,
    );
    expect(result).toEqual(expected);
  });

  it('should integrate bicycle into network', async () => {
    const body = {
      idTranca: 10,
      idBicicleta: 1,
      idFuncionario: 100,
    };
    const expectedResponse = { success: true };
    mockNetworkService.integrateBicycle.mockResolvedValue(expectedResponse);

    const result = await controller.integrateBicycle(body);

    expect(mockNetworkService.integrateBicycle).toHaveBeenCalledWith(
      body.idBicicleta,
      body.idTranca,
      body.idFuncionario,
    );
    expect(result).toEqual(expectedResponse);
  });

  it('should remove bicycle from network', async () => {
    const body = {
      idTranca: 10,
      idBicicleta: 1,
      idFuncionario: 100,
      statusAcaoReparador: 'APOSENTADA',
    };
    const expectedResponse = { success: true };
    mockNetworkService.removeBicycle.mockResolvedValue(expectedResponse);

    const result = await controller.removeBicycle(body);

    expect(mockNetworkService.removeBicycle).toHaveBeenCalledWith(
      body.idBicicleta,
      body.idTranca,
      body.idFuncionario,
      body.statusAcaoReparador,
    );
    expect(result).toEqual(expectedResponse);
  });
});
