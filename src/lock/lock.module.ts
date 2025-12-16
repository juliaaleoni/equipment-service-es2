import { Module, forwardRef } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { HttpModule } from '@nestjs/axios';
import { Lock } from './lock.entity';
import { LockService } from './lock.service';
import { LockNetworkService } from './lock-network.service';
import { LockController } from './lock.controller';
import { BicycleModule } from '../bicycle/bicycle.module';
import { TotemModule } from '../totem/totem.module';
import { ExternalClient } from '../clients/external.client';

@Module({
  imports: [
    TypeOrmModule.forFeature([Lock]),
    forwardRef(() => BicycleModule),
    forwardRef(() => TotemModule),
    HttpModule.register({
      timeout: 5000,
      maxRedirects: 5,
    }),
  ],
  controllers: [LockController],
  providers: [LockService, LockNetworkService, ExternalClient],
  exports: [LockService, LockNetworkService],
})
export class LockModule {}
