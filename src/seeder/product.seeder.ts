import { Products } from 'src/models/products/entities/product.entity';
import { Users, UserType } from 'src/models/users/entities/user.entities';
import { DataSource } from 'typeorm';

export async function productSeeder(dataSource: DataSource) {
  const productRepo = dataSource.getRepository(Products);
  const userRepo = dataSource.getRepository(Users);

  // Cek apakah product sudah ada
  const existingProduct = await productRepo.count();
  if (existingProduct > 0) {
    console.log('❌ Produk sudah ada, seeder tidak dijalankan ulang.');
    return;
  }

  // Ambil salah satu user dengan role OWNER
  const owner = await userRepo.findOne({
    where: { type_user: UserType.OWNER },
  });

  if (!owner) {
    console.log(
      'Owner tidak ditemukan. Pastikan ada user dengan type_user: OWNER.',
    );
    return;
  }

  const dummyProducts = [
    {
      name: 'Kemeja Katun Premium',
      description: 'Kemeja Katun Premium desc...',
      stock: 10,
      price: 250_000,
      owner,
    },
    {
      name: 'Celana Chino Pria',
      description: 'Celana Chino Pria desc...',
      stock: 20,
      price: 180_000,
      owner,
    },
    {
      name: 'Jaket Parka Wanita',
      description: 'Jaket Parka Wanita desc...',
      stock: 0,
      price: 350_000,
      owner,
    },
  ];

  const products = productRepo.create(dummyProducts);
  await productRepo.save(products);

  console.log('✅ Dummy produk berhasil ditambahkan!');
}
