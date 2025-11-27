import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { BicycleModule } from './bicycle/bicycle.module';
import { LockModule } from './lock/lock.module';
import { TotemModule } from './totem/totem.module';
import { Bicycle } from './bicycle/bicycle.entity';
import { Lock } from './lock/lock.entity';
import { Totem } from './totem/totem.entity';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    TypeOrmModule.forRoot({
      type: 'postgres',
      url: process.env.DATABASE_URL,
      entities: [__dirname + '/**/*.entity{.ts,.js}'],
      synchronize: process.env.NODE_ENV !== 'production',
      ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false,
    }),
    TypeOrmModule.forFeature([Bicycle, Lock, Totem]),
    BicycleModule,
    LockModule,
    TotemModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}