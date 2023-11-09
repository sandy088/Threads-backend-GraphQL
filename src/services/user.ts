import { prismaClient } from "../lib/db";
import {createHmac, randomBytes} from 'node:crypto';
import JWT from 'jsonwebtoken';

//TEMPORARY TOKEN Secret
const JWT_TOKEN_SECERT = 'secret';    

export  interface UserPayload{
    firstName: string;
    lastName?: string;
    profileImageURL?: string;
    email: string;
    password: string;

}

export interface UserTokenPayload{
    email: string;
    password: string;
}

class UserServices{

    private static generateHashedPassword(password: string, salt: string): string{ 
        
        try {
            const hashedPassword =  createHmac('sha256',salt).update(password).digest('hex');
            return hashedPassword;
        } catch (error) {
            throw new Error('Error while generating hashed password');
        }
        
    }
    public static async createUser(payload: UserPayload){

        const { firstName, lastName, profileImageURL, email, password } = payload;

        //TODO: Validations on all the fields

        const salt = randomBytes(32).toString('hex');
        const hashedPassword = this.generateHashedPassword(password, salt);

        return await prismaClient.user.create({
            data: {
                firstName,
                lastName: lastName || "", // provide a default value for lastName
                profileImageURL: profileImageURL || "", // provide a default value for profileImageURL
                email,
                password: hashedPassword,
                salt,
            },
        });

    }

    //find User
    private static async findUser(email: string){
        return await prismaClient.user.findUnique({
            where: {
                email,
            },
        });
    }

    //for login user - create a JWT token
    public static async createToken(payload: UserTokenPayload){
        const {email, password} = payload;

        //TODO: Validations on all the fields

        //check if input password is right 
        const user = await this.findUser(email);

        if(!user){
            throw new Error('User not found');
        }

        const userSalt = user.salt
        const hashedPassword = this.generateHashedPassword(password, userSalt);

        if(hashedPassword !== user.password){
            throw new Error('Invalid password');
        } 

        //Generate JWT token
        const token = JWT.sign({id: user.id}, JWT_TOKEN_SECERT|| 'secret', {expiresIn: '1d'});
        return token


    }

}

export default UserServices;