import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  HttpCode,
} from '@nestjs/common';
import { TotemService } from './totem.service';
import { CreateTotemDto } from './dto/create-totem.dto';
import { UpdateTotemDto } from './dto/update-totem.dto';
import { BicycleService } from '../bicycle/bicycle.service';
import { LockService } from '../lock/lock.service';

@Controller('totem')
export class TotemController {
  constructor(
    private readonly service: TotemService,
    private readonly lockService: LockService,
    private readonly bicycleService: BicycleService,
  ) {}

  @Post()
  create(@Body() dto: CreateTotemDto) {
    return this.service.create(dto);
  }

  @Get()
  findAll() {
    return this.service.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.service.findOne(+id);
  }

  @Put(':id')
  update(@Param('id') id: string, @Body() dto: UpdateTotemDto) {
    return this.service.update(+id, dto);
  }

  @Delete(':id')
  @HttpCode(200)
  remove(@Param('id') id: string) {
    return this.service.remove(+id);
  }

  @Get(':id/trancas')
  async getLocksFromTotem(@Param('id') id: string) {
    await this.service.findOne(+id);
    return this.lockService.findByTotemId(+id);
  }

  @Get(':id/bicicletas')
  async getBicyclesFromTotem(@Param('id') id: string) {
    await this.service.findOne(+id);
    const locks = await this.lockService.findByTotemId(+id);
    const bicycleIds = locks
      .filter((lock) => lock.bicycleId !== null)
      .map((lock) => lock.bicycleId as number);
    return this.bicycleService.findByIds(bicycleIds);
  }
}
