import { ApolloServer } from '@apollo/server';
import { User } from './user';

async function  createGraphQLServer(){
    const server = new ApolloServer({
        typeDefs: `
         type Query {
            ${User.queries}
         },
         type Mutation {
            ${User.mutations}
         }
        `, //schema as a string
        resolvers: {
            Query : {
                ...User.resolvers.queries
            },
            Mutation:{
                ...User.resolvers.mutations
            }
 
        } // actual function which will be executed when a query is made                            
    })
    
    await server.start();
    return server;
}

export default createGraphQLServer;
