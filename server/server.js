const express = require("express");
const { ApolloServer } = require("apollo-server-express");
const { PubSub } = require('graphql-subscriptions');
const http = require("http");
const { WebSocketServer } = require('ws');
require("dotenv").config();
const path = require("path");
const { mergeTypeDefs, mergeResolvers } = require("@graphql-tools/merge");
const { makeExecutableSchema } = require("@graphql-tools/schema");
const { useServer } = require('graphql-ws/lib/use/ws');
const { loadFilesSync } = require("@graphql-tools/load-files");
const mongoose = require("mongoose");
const {
  ApolloServerPluginLandingPageGraphQLPlayground,
} = require("apollo-server-core");
const cors = require("cors");
const cloudinary = require("cloudinary");
const { authCheckMiddleware } = require('./helpers/auth');

const pubsub = new PubSub();

const app = express();

app.use(express.json());
app.use(cors());

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.DB, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("Connected to MongoDB");
  } catch (error) {
    console.error("Error connecting to MongoDB:", error);
  }
};

connectDB();

// typeDefs
const typeDefs = mergeTypeDefs(
  loadFilesSync(path.join(__dirname, "./typeDefs"))
);

const resolvers = mergeResolvers(
  loadFilesSync(path.join(__dirname, "./resolvers"))
);

const schema = makeExecutableSchema({
  typeDefs,
  resolvers,
});

// Create an ApolloServer instance
const apolloServer = new ApolloServer({
  schema,
  context: ({ req }) => ({ req, pubsub }),
  plugins: [ApolloServerPluginLandingPageGraphQLPlayground()],
  subscriptions: {
    path: '/subscriptions',
  },
});

async function startServer() {
  // Start the Apollo Server
  await apolloServer.start();

  // Apply Apollo Server middleware to Express app
  apolloServer.applyMiddleware({ app });

  const httpServer = http.createServer(app);

  // Create a WebSocket server instance
  const wsServer = new WebSocketServer({ server: httpServer, path: '/subscriptions' });

  // Apply the GraphQL WebSocket server using graphql-ws
  useServer({ schema }, wsServer);

  cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
  });

  app.get("/rest", function (req, res) {
    res.json({
      data: "some name",
    });
  });

  // upload
  app.post("/uploadimages", authCheckMiddleware, (req, res) => {
    cloudinary.uploader.upload(
      req.body.image,
      (result) => {
        res.send({
          url: result.secure_url,
          public_id: result.public_id,
        });
      },
      {
        public_id: `${Date.now()}`, // public name
        resource_type: "auto", // JPEG, PNG
      }
    );
  });

  // remove image
  app.post("/removeimage", authCheckMiddleware, (req, res) => {
    let image_id = req.body.public_id;
    console.log('pub',image_id)
    cloudinary.uploader.destroy(image_id, (error, result) => {
      console.log('error', error)
      if (error) return res.json({ success: false, error });
      res.send("ok");
    });
  });

  httpServer.listen(process.env.PORT, function () {
    console.log(`server listening to port no ${process.env.PORT}`);
    console.log(
      `GraphQL server is ready at http://localhost:${process.env.PORT}${apolloServer.graphqlPath}`
    );
    console.log(`WebSocket subscriptions are ready at ws://localhost:${process.env.PORT}/subscriptions`);
  });
}

startServer();
