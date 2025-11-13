import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity('totems')
export class Totem {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  location: string;

  @Column()
  description: string;
}
