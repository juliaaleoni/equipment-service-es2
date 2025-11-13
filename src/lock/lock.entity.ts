import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Totem } from '../totem/totem.entity';

export enum LockStatus {
  FREE = 'LIVRE',
  OCCUPIED = 'OCUPADA',
  NEW = 'NOVA',
  RETIRED = 'APOSENTADA',
  IN_REPAIR = 'EM_REPARO',
}

@Entity('locks')
export class Lock {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  number: number;

  @Column()
  location: string;

  @Column()
  manufactureYear: string;

  @Column()
  model: string;

  @Column({
    type: 'enum',
    enum: LockStatus,
    default: LockStatus.NEW,
  })
  status: LockStatus;

  @Column({ nullable: true, type: 'int' })
  bicycleId: number | null;

  @ManyToOne(() => Totem, { nullable: true })
  @JoinColumn({ name: 'totemId' })
  totem: Totem | null;

  @Column({ nullable: true, type: 'int' })
  totemId: number | null;
}
