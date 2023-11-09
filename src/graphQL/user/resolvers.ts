import { prismaClient } from '../../lib/db';
import UserServices, { UserPayload, UserTokenPayload } from '../../services/user';

const queries = {
    hello: ()=> {
        return "Hey I am a GraphQL server"
        },

        say:(_:any,{name}:{name:string})=> {
            return `Hey ${name} I am a GraphQL server`
        } ,

        getUserToken : async (_:any, payload: UserTokenPayload) => {
            const token = await UserServices.createToken(payload);
            return token;
        }
}
const mutations = {
    createUser: async (_:any, payload : UserPayload) => {
       const res = await UserServices.createUser(payload);
       return res.email;
    }
}

export const resolvers = {queries, mutations}