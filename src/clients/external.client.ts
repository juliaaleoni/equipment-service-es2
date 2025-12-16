import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';
import { AxiosError } from 'axios';

export interface SendEmailDto {
  email: string;
  assunto: string;
  mensagem: string;
}

@Injectable()
export class ExternalClient {
  private readonly logger = new Logger(ExternalClient.name);
  private readonly baseURL: string;

  constructor(
    private readonly httpService: HttpService,
    private readonly configService: ConfigService,
  ) {
    this.baseURL =
      this.configService.get<string>('EXTERNAL_SERVICE_URL') ||
      'https://external-service-api.onrender.com';
    this.logger.log(`External Service URL: ${this.baseURL}`);
  }

  async sendEmail(
    email: string,
    assunto: string,
    mensagem: string,
  ): Promise<any> {
    try {
      this.logger.log(`Sending email to ${email} with subject: ${assunto}`);
      const response = await firstValueFrom(
        this.httpService.post(`${this.baseURL}/enviarEmail`, {
          email,
          assunto,
          mensagem,
        }),
      );
      this.logger.log(`Email sent successfully to ${email}`);
      return response.data;
    } catch (error) {
      // Email não deve bloquear o fluxo principal
      const axiosError = error as AxiosError;
      this.logger.error(
        `Failed to send email to ${email}: ${axiosError.message}`,
      );
      this.logger.warn('Email failure will not block the operation');
      return null;
    }
  }
}
