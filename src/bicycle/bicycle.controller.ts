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
import { BicycleService } from './bicycle.service';
import { BicycleNetworkService } from './bicycle-network.service';
import { CreateBicycleDto } from './dto/create-bicycle.dto';
import { UpdateBicycleDto } from './dto/update-bicycle.dto';
import { BicycleStatus } from './bicycle.entity';

@Controller('bicicleta')
export class BicycleController {
  constructor(
    private readonly service: BicycleService,
    private readonly networkService: BicycleNetworkService,
  ) {}

  @Post()
  create(@Body() dto: CreateBicycleDto) {
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
  update(@Param('id') id: string, @Body() dto: UpdateBicycleDto) {
    return this.service.update(+id, dto);
  }

  @Delete(':id')
  @HttpCode(200)
  remove(@Param('id') id: string) {
    return this.service.remove(+id);
  }

  @Post(':id/status/:action')
  updateStatus(@Param('id') id: string, @Param('action') action: string) {
    const statusMap: Record<string, BicycleStatus> = {
      DISPONIVEL: BicycleStatus.AVAILABLE,
      EM_USO: BicycleStatus.IN_USE,
      NOVA: BicycleStatus.NEW,
      APOSENTADA: BicycleStatus.RETIRED,
      REPARO_SOLICITADO: BicycleStatus.REPAIR_REQUESTED,
      EM_REPARO: BicycleStatus.IN_REPAIR,
    };

    // Validate action is valid
    if (!statusMap[action]) {
      throw new BadRequestException(
        `Invalid action: ${action}. Valid actions are: ${Object.keys(statusMap).join(', ')}`,
      );
    }

    return this.service.updateStatus(+id, statusMap[action]);
  }

  @Post('integrarNaRede')
  @HttpCode(200)
  integrateBicycle(
    @Body()
    body: {
      idTranca: number;
      idBicicleta: number;
      idFuncionario: number;
    },
  ) {
    return this.networkService.integrateBicycle(
      body.idBicicleta,
      body.idTranca,
      body.idFuncionario,
    );
  }

  @Post('retirarDaRede')
  @HttpCode(200)
  removeBicycle(
    @Body()
    body: {
      idTranca: number;
      idBicicleta: number;
      idFuncionario: number;
      statusAcaoReparador: string;
    },
  ) {
    return this.networkService.removeBicycle(
      body.idBicicleta,
      body.idTranca,
      body.idFuncionario,
      body.statusAcaoReparador,
    );
  }
}
