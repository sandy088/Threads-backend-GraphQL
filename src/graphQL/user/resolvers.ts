import { prismaClient } from '../../lib/db';

const queries = {
    hello: ()=> {
        return "Hey I am a GraphQL server"
        },

        say:(_:any,{name}:{name:string})=> {
            return `Hey ${name} I am a GraphQL server`
        } 
}
const mutations = {
    createUser: async (_:any, { firstName, lastName, profileImageURL, email, password }: { firstName: string, lastName: string, profileImageURL: string, email: string, password: string }) => {
        await prismaClient.user.create({
            data: {
                firstName,
                lastName,
                profileImageURL,
                email,
                password,
                salt: "1234"
            }
        })
        return true
    }
}

export const resolvers = {queries, mutations}