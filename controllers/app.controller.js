const createUserToken = require("../helpers/generateToken");
const { sendResponse } = require('res-express');
const bcrypt = require("bcrypt");
const prisma = require("../db/connection");
const signup = async (req, res, next) => {
    try {
        const { email, password, name } = req.body;

        const existingUser = await prisma.user.findUnique({
            where: {
                email,
            },
        });

        if (existingUser) {
            return sendResponse({
                res,
                status: 400,
                data: {
                    message: 'Email already registered',
                    success: false,
                },
            });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const newUser = await prisma.user.create({
            data: {
                email,
                password: hashedPassword,
                name,
            },
        });

        const token = createUserToken(newUser.id);
        // we can have queue for example bullmq and we will 
        // push email otp in queue we can use nodemailer 
        // for email and then one bullmq worker will send the email to user
        sendResponse({
            res,
            status: 201,
     
            data: {
                token,
                message: 'Signup successful',
                success: true,
                user: {
                    id: newUser.id,
                    email: newUser.email,
                },
            },
        });
    } catch (error) {
        next(error);
    }
};
const login = async (req, res, next) => {
    try {
        const { email, password } = req.body;
        const user = await prisma.user.findUnique({ where:{
            email
        } });
        if (!user) {
            return sendResponse({ res, status: 401, data: { message: "You are not a user", success: false } });
        }
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return sendResponse({ res, status: 401, data: { message: "Email or Password is Wrong", success: false } });
        }
        const token = createUserToken(user._id)
        sendResponse({
            res,
            status: 200,
            message: "Login successful",
            success: true,
            data: { token, user: { id: user._id, email: user.email } },
        });
    } catch (error) {
        next(error);
    }
}


const getAllCategories = async (req, res, next) => {
    try {
        const { page = 1, limit = 6 } = req.body;
        const skip = (page - 1) * limit;

        const categories = await prisma.category.findMany({
            skip,
            take: limit,
        });

        const totalCount = await prisma.category.count();
        const totalPages = Math.ceil(totalCount / limit);

        sendResponse({
            res,
            status: 200,
            data: {
                categories,
                pagination: {
                    currentPage: page,
                    totalPages,
                    totalCount,
                },
            },
            success: true,
        });
    } catch (error) {
        next(error);
    }
};

module.exports = {
    signup,
    login,
    getAllCategories

}