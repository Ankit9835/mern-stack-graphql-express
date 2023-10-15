const express = require('express');
const { ApolloServer } = require('apollo-server-express');
const http = require('http');
require('dotenv').config();
const path = require('path');
const { makeExecutableSchema } = require("graphql-tools");
const { mergeTypeDefs, mergeResolvers } = require("@graphql-tools/merge");
const { loadFilesSync } = require("@graphql-tools/load-files");
const mongoose = require('mongoose')
const { ApolloServerPluginLandingPageGraphQLPlayground } = require("apollo-server-core");


const app = express();

const connectDB = () => {
    return mongoose.connect(process.env.DB, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    })
  }

  connectDB()



// typeDefs
const typeDefs = mergeTypeDefs(loadFilesSync(path.join(__dirname, "./typeDefs")));

const resolvers = mergeResolvers(loadFilesSync(path.join(__dirname, "./resolvers")));


// Create an ApolloServer instance
const apolloServer = new ApolloServer({
    typeDefs,
    resolvers,
    plugins: [
        ApolloServerPluginLandingPageGraphQLPlayground(),
      ],
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
