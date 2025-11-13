import { Module, forwardRef } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Totem } from './totem.entity';
import { TotemService } from './totem.service';
import { TotemController } from './totem.controller';
import { LockModule } from '../lock/lock.module';
import { BicycleModule } from '../bicycle/bicycle.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Totem]),
    forwardRef(() => LockModule),
    forwardRef(() => BicycleModule),
  ],
  controllers: [TotemController],
  providers: [TotemService],
  exports: [TotemService],
})
export class TotemModule {}
