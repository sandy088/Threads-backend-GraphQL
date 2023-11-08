import express from 'express';
import { expressMiddleware } from '@apollo/server/express4';
import createGraphQLServer from './graphQL';

const app = express();
const port = 3000;
app.use(express.json());

const init = async () => {
 
    
    const server = await createGraphQLServer()

    app.get('/', (req, res) => {
        res.send('server is up and runnnigg');
    });

    app.use('/graphql', expressMiddleware(server))

    app.listen(port, () => {
        console.log(`Example app listening at http://localhost:${port}`);
    });
}

init()
