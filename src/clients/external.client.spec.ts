import { Test, TestingModule } from '@nestjs/testing';
import { ExternalClient } from './external.client';
import { HttpService } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';
import { of, throwError } from 'rxjs';
import { AxiosResponse, AxiosError, InternalAxiosRequestConfig } from 'axios';

describe('ExternalClient', () => {
  let client: ExternalClient;
  let _httpService: HttpService;
  let _configService: ConfigService;

  const mockHttpService = {
    post: jest.fn(),
  };

  const mockConfigService = {
    get: jest.fn(),
  };

  beforeEach(async () => {
    jest.clearAllMocks();

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ExternalClient,
        {
          provide: HttpService,
          useValue: mockHttpService,
        },
        {
          provide: ConfigService,
          useValue: mockConfigService,
        },
      ],
    }).compile();

    client = module.get<ExternalClient>(ExternalClient);
    _httpService = module.get<HttpService>(HttpService);
    _configService = module.get<ConfigService>(ConfigService);
  });

  it('should be defined', () => {
    expect(client).toBeDefined();
  });

  describe('constructor', () => {
    it('should initialize with custom URL from config', async () => {
      mockConfigService.get.mockReturnValue('https://custom-url.com');

      const module: TestingModule = await Test.createTestingModule({
        providers: [
          ExternalClient,
          {
            provide: HttpService,
            useValue: mockHttpService,
          },
          {
            provide: ConfigService,
            useValue: mockConfigService,
          },
        ],
      }).compile();

      const customClient = module.get<ExternalClient>(ExternalClient);
      expect(customClient).toBeDefined();
      expect(mockConfigService.get).toHaveBeenCalledWith(
        'EXTERNAL_SERVICE_URL',
      );
    });

    it('should initialize with default URL when config is not provided', async () => {
      mockConfigService.get.mockReturnValue(undefined);

      const module: TestingModule = await Test.createTestingModule({
        providers: [
          ExternalClient,
          {
            provide: HttpService,
            useValue: mockHttpService,
          },
          {
            provide: ConfigService,
            useValue: mockConfigService,
          },
        ],
      }).compile();

      const defaultClient = module.get<ExternalClient>(ExternalClient);
      expect(defaultClient).toBeDefined();
    });
  });

  describe('sendEmail', () => {
    const mockEmail = 'test@example.com';
    const mockSubject = 'Test Subject';
    const mockMessage = 'Test Message';

    it('should send email successfully', async () => {
      const mockResponse: AxiosResponse = {
        data: { success: true },
        status: 200,
        statusText: 'OK',
        headers: {},
        config: {} as InternalAxiosRequestConfig,
      };

      mockHttpService.post.mockReturnValue(of(mockResponse));

      const result = (await client.sendEmail(
        mockEmail,
        mockSubject,
        mockMessage,
      )) as { success: boolean } | null;

      expect(result).toEqual({ success: true });
      expect(mockHttpService.post).toHaveBeenCalledWith(
        expect.stringContaining('/enviarEmail'),
        {
          email: mockEmail,
          assunto: mockSubject,
          mensagem: mockMessage,
        },
      );
    });

    it('should handle errors and return null without throwing', async () => {
      const mockError: Partial<AxiosError> = {
        message: 'Network Error',
        name: 'AxiosError',
        config: {} as InternalAxiosRequestConfig,
        isAxiosError: true,
        toJSON: () => ({}),
      };

      mockHttpService.post.mockReturnValue(throwError(() => mockError));

      const result = (await client.sendEmail(
        mockEmail,
        mockSubject,
        mockMessage,
      )) as { success: boolean } | null;

      expect(result).toBeNull();
      expect(mockHttpService.post).toHaveBeenCalledWith(
        expect.stringContaining('/enviarEmail'),
        {
          email: mockEmail,
          assunto: mockSubject,
          mensagem: mockMessage,
        },
      );
    });

    it('should log error message when email fails', async () => {
      const loggerErrorSpy = jest.spyOn(client['logger'], 'error');
      const loggerWarnSpy = jest.spyOn(client['logger'], 'warn');

      const mockError: Partial<AxiosError> = {
        message: 'Connection timeout',
        name: 'AxiosError',
        config: {} as InternalAxiosRequestConfig,
        isAxiosError: true,
        toJSON: () => ({}),
      };

      mockHttpService.post.mockReturnValue(throwError(() => mockError));

      await client.sendEmail(mockEmail, mockSubject, mockMessage);

      expect(loggerErrorSpy).toHaveBeenCalledWith(
        expect.stringContaining('Failed to send email'),
      );
      expect(loggerWarnSpy).toHaveBeenCalledWith(
        'Email failure will not block the operation',
      );
    });

    it('should log success message when email is sent', async () => {
      const loggerLogSpy = jest.spyOn(client['logger'], 'log');

      const mockResponse: AxiosResponse = {
        data: { success: true },
        status: 200,
        statusText: 'OK',
        headers: {},
        config: {} as InternalAxiosRequestConfig,
      };

      mockHttpService.post.mockReturnValue(of(mockResponse));

      await client.sendEmail(mockEmail, mockSubject, mockMessage);

      expect(loggerLogSpy).toHaveBeenCalledWith(
        expect.stringContaining('Sending email to'),
      );
      expect(loggerLogSpy).toHaveBeenCalledWith(
        expect.stringContaining('Email sent successfully'),
      );
    });
  });
});
