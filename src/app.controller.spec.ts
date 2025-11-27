import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { Bicycle } from './bicycle/bicycle.entity';
import { Lock } from './lock/lock.entity';
import { Totem } from './totem/totem.entity';

describe('AppController', () => {
  let appController: AppController;

  const mockRepo = {
    delete: jest.fn().mockResolvedValue({ affected: 0 }),
  };

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [AppController],
      providers: [
        AppService,
        {
          provide: getRepositoryToken(Bicycle),
          useValue: mockRepo,
        },
        {
          provide: getRepositoryToken(Lock),
          useValue: mockRepo,
        },
        {
          provide: getRepositoryToken(Totem),
          useValue: mockRepo,
        },
      ],
    }).compile();

    appController = app.get<AppController>(AppController);
  });

  describe('root', () => {
    it('should return "Hello World!"', () => {
      expect(appController.getHello()).toBe('Hello World!');
    });
  });
});
