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

  @Column({ unique: true })
  number: number;

  @Column()
  brand: string;

  @Column()
  model: string;

  @Column()
  year: string;

  @Column({
    type: 'enum',
    enum: BicycleStatus,
    default: BicycleStatus.NEW,
  })
  status: BicycleStatus;
}
