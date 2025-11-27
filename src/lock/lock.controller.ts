import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  HttpCode,
  BadRequestException,
} from '@nestjs/common';
import { LockService } from './lock.service';
import { LockNetworkService } from './lock-network.service';
import { CreateLockDto } from './dto/create-lock.dto';
import { UpdateLockDto } from './dto/update-lock.dto';

@Controller('tranca')
export class LockController {
  constructor(
    private readonly service: LockService,
    private readonly networkService: LockNetworkService,
  ) {}

  @Post()
  create(@Body() dto: CreateLockDto) {
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
  update(@Param('id') id: string, @Body() dto: UpdateLockDto) {
    return this.service.update(+id, dto);
  }

  @Delete(':id')
  @HttpCode(200)
  remove(@Param('id') id: string) {
    return this.service.remove(+id);
  }

  @Post(':id/trancar')
  @HttpCode(200)
  lockBicycle(@Param('id') id: string, @Body() body: { idBicicleta: number }) {
    return this.service.lockBicycle(+id, body.idBicicleta);
  }

  @Post(':id/destrancar')
  @HttpCode(200)
  unlockBicycle(@Param('id') id: string) {
    return this.service.unlockBicycle(+id);
  }

  @Get(':id/bicicleta')
  getBicycle(@Param('id') id: string) {
    return this.service.getBicycle(+id);
  }

  @Post(':id/status/:action')
  @HttpCode(200)
  updateStatus(@Param('id') id: string, @Param('action') action: string) {
    const actionMap: Record<string, () => Promise<any>> = {
      TRANCAR: () => this.service.lockBicycle(+id, undefined),
      DESTRANCAR: () => this.service.unlockBicycle(+id),
    };

    // Validate action is valid
    if (!actionMap[action]) {
      throw new BadRequestException(
        `Invalid action: ${action}. Valid actions are: ${Object.keys(actionMap).join(', ')}`,
      );
    }

    return actionMap[action]();
  }

  @Post('integrarNaRede')
  @HttpCode(200)
  integrateLock(
    @Body()
    body: {
      idTotem: number;
      idTranca: number;
      idFuncionario: number;
    },
  ) {
    return this.networkService.integrateLock(
      body.idTranca,
      body.idTotem,
      body.idFuncionario,
    );
  }

  @Post('retirarDaRede')
  @HttpCode(200)
  removeLock(
    @Body()
    body: {
      idTotem: number;
      idTranca: number;
      idFuncionario: number;
      statusAcaoReparador: string;
    },
  ) {
    return this.networkService.removeLock(
      body.idTranca,
      body.idTotem,
      body.idFuncionario,
      body.statusAcaoReparador,
    );
  }
}
