import { Users, UserType } from 'src/models/users/entities/user.entities';
import { DataSource } from 'typeorm';

export const userSeeder = async (dataSource: DataSource) => {
  const userRepo = dataSource.getRepository(Users);

  // Cek apakah user OWNER sudah ada
  const existingOwner = await userRepo.findOne({
    where: { type_user: UserType.OWNER },
  });

  if (existingOwner) {
    console.log('❌ User OWNER sudah ada, seeder tidak dijalankan ulangs.');
    return;
  }

  const owner = userRepo.create({
    name: 'nurmaarizd',
    email: 'nurmmaarizd@gmail.com',
    type_user: UserType.OWNER,
  });

  const customer = userRepo.create({
    name: 'customer',
    email: 'customer@example.com',
    type_user: UserType.CUSTOMER,
  });

  await userRepo.save([owner, customer]);
  console.log('✅ Dummy user seeded!');
};
