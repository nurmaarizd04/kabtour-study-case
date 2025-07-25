import { Products } from 'src/models/products/entities/product.entity';
import { Users } from 'src/models/users/entities/user.entities';
import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

export enum TransactionStatus {
  PENDING = 'PENDING',
  ACCEPTED = 'ACCEPTED',
  REJECTED = 'REJECTED',
}

@Entity()
export class Transactions {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Users, (user) => user.transactions, {
    onDelete: 'CASCADE', // ⬅️ jika user dihapus, transaksinya juga
  })
  customer: Users;

  @ManyToOne(() => Products, (product) => product.owner, {
    onDelete: 'CASCADE', // Jika produk dihapus, transaksi ikut terhapus
  })
  product: Products;

  @Column()
  quantity: number;

  @Column()
  totalPrice: number;

  @Column({
    type: 'enum',
    enum: TransactionStatus,
    default: TransactionStatus.PENDING,
  })
  status: TransactionStatus;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updateAt: Date;
}
