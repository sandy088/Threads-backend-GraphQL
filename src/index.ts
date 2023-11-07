import express from 'express';
import { ApolloServer } from '@apollo/server';
import { expressMiddleware } from '@apollo/server/express4';
import { prismaClient } from './lib/db';

const app = express();
const port = 3000;
app.use(express.json());

const init = async () => {
    //creating a GraphQL server
    const server = new ApolloServer({
        typeDefs: `
         type Query {
            hello: String
            say(name: String): String
         },
         type Mutation { 
            createUser(firstName:String!, lastName:String!, profileImageURL:String!, email:String!, password:String!): Boolean
         }
        `, //schema as a string
        resolvers: {
            Query : {
                hello: ()=> {
                return "Hey I am a GraphQL server"
                },

                say:(_,{name}:{name:string})=> {
                    return `Hey ${name} I am a GraphQL server`
                }          
            },

            Mutation:{
                createUser: async (_, { firstName, lastName, profileImageURL, email, password }: { firstName: string, lastName: string, profileImageURL: string, email: string, password: string }) => {
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
        } // actual function which will be executed when a query is made                            
    })
    
    await server.start();

    app.get('/', (req, res) => {
        res.send('server is up and runnnigg');
    });

    app.use('/graphql', expressMiddleware(server))

    app.listen(port, () => {
        console.log(`Example app listening at http://localhost:${port}`);
    });
}

init()
