import express from 'express';
import Redis from 'ioredis';
import session from 'express-session';
import { createConnection } from "typeorm";
import connectRedis from 'connect-redis';
import cors from 'cors';
import * as dotenv from 'dotenv';
import { ApolloServer, makeExecutableSchema } from 'apollo-server-express';
import typeDefs from './gql/typeDefs';
import resolvers from './gql/resolvers';
import { login, register, logout } from './repo/UserRepo';
import {
  createThread,
  getThreadsByCategoryId,
  getThreadById
} from './repo/ThreadRepo';
import {
  createThreadItem,
  getThreadItemsByThreadId,
} from "./repo/ThreadItemRepo";

dotenv.config();
console.log(process.env.NODE_ENV);

const main = async () => {
  const app = express();
  const router = express.Router();
  await createConnection();
  const redis = new Redis({
    port: Number(process.env.REDIS_PORT),
    host: process.env.REDIS_HOST,
  });

  const RedisStore = connectRedis(session);
  const redisStore = new RedisStore({
    client: redis,
  });

  app.use(express.json())

  app.use(
    session({
      store: redisStore,
      name: process.env.COOKIE_NAME,
      sameSite: "Strict",
      secret: process.env.SESSION_SECRET,
      resave: false,
      saveUninitialized: false,
      cookie: {
        path: "/",
        httpOnly: true,
        secure: false,
        maxAge: 1000 * 60 * 60 * 24,
      },
      userid: '',
      loadedCount: 0
    } as any)
  );

  app.use(
    cors({
      credentials: true,
      origin:
        process.env.CLIENT_URL,
    })
  );

  app.use(router);
  router.get("/", (req, res, next) => {
    if (!req.session!.userid) {
      req.session!.userid = req.query.userid;
      console.log("Userid is set");
      req.session!.loadedCount = 0;
    } else {
      req.session!.loadedCount = Number(req.session!.loadedCount) + 1;
    }

    res.send(
      `userid: ${req.session!.userid}, loadedCount: ${req.session!.loadedCount}`
    );
  });

  router.post('/register', async (req, res, next) => {
    try {
      const userResult = await register(req.body.email,
        req.body.userName,
        req.body.password)
      if (userResult && userResult.user) {
        res.send(`new user created, userId: ${userResult.user.id}`)
      } else if (userResult && userResult.messages) {
        res.send(userResult.messages[0]);
      } else {
        next()
      }
    } catch (err) {
      res.send(err.message)
    }
  })

  router.post('/login', async (req, res, next) => {
    try {
      const userResult = await login(req.body.userName,
        req.body.password)
      if (userResult && userResult.user) {
        req.session!.userId = userResult.user?.id;
        res.send(`user logged in, userId: ${userResult.user.id}`)
      } else if (userResult && userResult.messages) {
        res.send(userResult.messages[0]);
      } else {
        next()
      }
    } catch (error) {
      res.send(error.message)
    }
  });

  router.post("/logout", async (req, res, next) => {
    try {
      console.log("params", req.body);
      const msg = await logout(req.body.userName);
      if (msg) {
        req.session!.userId = null;
        res.send(msg);
      } else {
        next();
      }
    } catch (ex) {
      console.log(ex);
      res.send(ex.message);
    }
  });

  router.post('/createThread', async (req, res, next) => {
    try {
      const msg = await createThread(req.session!.userId,
        req.body.categoryId,
        req.body.title,
        req.body.body);
      res.send(msg);
    } catch (error) {
      console.log(error);
      res.send(error.message)
    }
  });

  router.post("/thread", async (req, res, next) => {
    try {
      const threadResult = await getThreadById(req.body.id);

      if (threadResult && threadResult.entity) {
        res.send(threadResult.entity.title);
      } else if (threadResult && threadResult.messages) {
        res.send(threadResult.messages[0]);
      }
    } catch (ex) {
      console.log(ex);
      res.send(ex.message);
    }
  });

  router.post("/threadsbycategory", async (req, res, next) => {
    try {
      const threadResult = await getThreadsByCategoryId(req.body.categoryId);

      if (threadResult && threadResult.entities) {
        let items = "";
        threadResult.entities.forEach((th) => {
          items += th.title + ", ";
        });
        res.send(items);
      } else if (threadResult && threadResult.messages) {
        res.send(threadResult.messages[0]);
      }
    } catch (error) {
      console.log(error);
      res.send(error.message);
    }
  });

  router.post("/createthreaditem", async (req, res, next) => {
    try {
      const msg = await createThreadItem(
        req.session!.userId,
        req.body.threadId,
        req.body.body
      );

      res.send(msg);
    } catch (ex) {
      console.log(ex);
      res.send(ex.message);
    }
  });
  router.post("/threaditemsbythread", async (req, res, next) => {
    try {
      const threadItemResult = await getThreadItemsByThreadId(
        req.body.threadId
      );

      if (threadItemResult && threadItemResult.entities) {
        let items = "";
        threadItemResult.entities.forEach((ti) => {
          items += ti.body + ", ";
        });
        res.send(items);
      } else if (threadItemResult && threadItemResult.messages) {
        res.send(threadItemResult.messages[0]);
      }
    } catch (ex) {
      console.log(ex);
      res.send(ex.message);
    }
  });

  const schema = makeExecutableSchema({ typeDefs, resolvers });
  const apolloServer = new ApolloServer({
    schema,
    context: ({ req, res }: any) => ({ req, res })
  })
  apolloServer.applyMiddleware({
    app,
    cors: false
  })

  app.listen({
    port:
      process.env.PORT
  }, () => {
    console.log(`Server ready on port ${process.env.PORT}`);
  });
}
main();
