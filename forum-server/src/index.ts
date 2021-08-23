import express from 'express';
import Redis from 'ioredis';
import session from 'express-session';
import { createConnection } from "typeorm";
import connectRedis from 'connect-redis';
import * as dotenv from 'dotenv';

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

  app.listen({
    port:
      process.env.PORT
  }, () => {
    console.log(`Server ready on port ${process.env.PORT}`);
  });
}
main();
