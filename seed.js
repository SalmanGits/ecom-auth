require("dotenv").config()
const prisma = require('./db/connection.js');
const { category } = require('./utils/const.js');
const seedUsers = async () => {
    try {
        const existingCat = await prisma.category.count();
        if (existingCat) {
            console.log('Category already exist, skipping seed');
            return;
        }

        await prisma.category.createMany({
            data: category
        })
        console.log('Dummy Category created successfully');
    } catch (error) {
        console.error('Error seeding users:', error);
    }
};

seedUsers();