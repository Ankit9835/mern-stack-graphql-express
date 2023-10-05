const express = require('express');
const { ApolloServer } = require('apollo-server-express');
const http = require('http');
require('dotenv').config();

const app = express();

const typeDefs = `
    type Query {
        totalPosts: Int!
    }
`;

// Resolvers
const resolvers = {
    Query: {
        totalPosts: () => 42
    }
};

// Create an ApolloServer instance
const apolloServer = new ApolloServer({
    typeDefs,
    resolvers
});

async function startServer() {
    // Start the Apollo Server
    await apolloServer.start();

    // Apply Apollo Server middleware to Express app
    apolloServer.applyMiddleware({ app });

    const httpServer = http.createServer(app);

    app.get('/rest', function (req, res) {
        res.json({
            data: 'some name'
        });
    });

    httpServer.listen(process.env.PORT, function () {
        console.log(`server listening to port no ${process.env.PORT}`);
        console.log(`graphql server is ready at http://localhost:${process.env.PORT}${apolloServer.graphqlPath}`);
    });
}

startServer();
