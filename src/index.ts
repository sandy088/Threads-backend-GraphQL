import express from 'express';
import { ApolloServer } from '@apollo/server';
import { expressMiddleware } from '@apollo/server/express4';

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
