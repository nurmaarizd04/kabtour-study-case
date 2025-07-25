// src/modules/products/entities/product.entity.ts
import { Users } from 'src/models/users/entities/user.entities';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity()
export class Products {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column('decimal')
  price: number;

  @Column({ nullable: true })
  description: string;

  @Column({ type: 'int' })
  stock: number;

  // Relasi: Banyak produk dimiliki oleh satu user
  @ManyToOne(() => Users, (user) => user.products, {
    onDelete: 'CASCADE',
  })
  owner: Users;

  @CreateDateColumn({ type: 'timestamp' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamp' })
  updatedAt: Date;
}
