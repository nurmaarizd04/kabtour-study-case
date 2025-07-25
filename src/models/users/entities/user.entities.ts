// import { Transaction } from '@/modules/transactions/entities/transaction.entity';
import { Products } from 'src/models/products/entities/product.entity';
import { Transactions } from 'src/models/transactions/entities/Transaction.entities';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToMany,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

export enum UserType {
  CUSTOMER = 'customer',
  OWNER = 'owner',
}

@Entity()
export class Users {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column({ unique: true })
  email: string;

  @Column({
    type: 'enum',
    enum: UserType,
    default: UserType.CUSTOMER,
  })
  type_user: UserType;

  @CreateDateColumn({ type: 'timestamp' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamp' })
  updatedAt: Date;

  // Relasi: User punya banyak produk
  @OneToMany(() => Products, (product) => product.owner)
  products: Products[];

  //   Relasi: User bisa menjadi customer di transaksi
  @OneToMany(() => Transactions, (transaction) => transaction.customer)
  transactions: Transactions[];
}
