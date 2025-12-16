import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

export enum BicycleStatus {
  AVAILABLE = 'DISPONIVEL',
  IN_USE = 'EM_USO',
  NEW = 'NOVA',
  RETIRED = 'APOSENTADA',
  REPAIR_REQUESTED = 'REPARO_SOLICITADO',
  IN_REPAIR = 'EM_REPARO',
}

@Entity('bicycles')
export class Bicycle {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true, name: 'numero' })
  numero: number;

  @Column({ name: 'marca' })
  marca: string;

  @Column({ name: 'modelo' })
  modelo: string;

  @Column({ name: 'ano' })
  ano: string;

  @Column({
    type: 'enum',
    enum: BicycleStatus,
    default: BicycleStatus.NEW,
  })
  status: BicycleStatus;
}
