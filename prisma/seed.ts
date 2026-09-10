import bcrypt from 'bcryptjs';
import { prisma } from '../src/prisma/client.js';

async function main() {
  const adminPassword = await bcrypt.hash('admin123', 10);

  await prisma.user.upsert({
    where: { username: 'admin' },
    update: {},
    create: {
      username: 'admin',
      passwordHash: adminPassword,
      role: 'ADMIN',
    },
  });

  const defaultCategories = ['电子产品', '办公用品', '耗材', '其他'];
  for (const name of defaultCategories) {
    await prisma.category.upsert({
      where: { name },
      update: {},
      create: { name, description: `${name}分类` },
    });
  }

  console.log('Seed completed: admin/admin123 and default categories created.');
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
