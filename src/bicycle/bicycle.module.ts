import { Module, forwardRef } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { HttpModule } from '@nestjs/axios';
import { Bicycle } from './bicycle.entity';
import { BicycleService } from './bicycle.service';
import { BicycleController } from './bicycle.controller';
import { BicycleNetworkService } from './bicycle-network.service';
import { LockModule } from '../lock/lock.module';
import { ExternalClient } from '../clients/external.client';

@Module({
  imports: [
    TypeOrmModule.forFeature([Bicycle]),
    forwardRef(() => LockModule),
    HttpModule.register({
      timeout: 5000,
      maxRedirects: 5,
    }),
  ],
  controllers: [BicycleController],
  providers: [BicycleService, BicycleNetworkService, ExternalClient],
  exports: [BicycleService, BicycleNetworkService],
})
export class BicycleModule {}
