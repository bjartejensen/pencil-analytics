import * as functions from "firebase-functions";
import { NestFactory } from "@nestjs/core";
import {
  ExpressAdapter,
  NestExpressApplication,
} from "@nestjs/platform-express";

import { AppModule } from "./app.module";
import express from "express";
import cors from "cors";
import { CorsOptions } from "@nestjs/common/interfaces/external/cors-options.interface";

const server = express();
server.use(cors({ origin: true }));

const createNestServer = async (expressInstance: any) => {
  const app = await NestFactory.create<NestExpressApplication>(
    AppModule,
    new ExpressAdapter(expressInstance) as any
  );

  const development = true;

  const corsOptions: CorsOptions = {
    origin: development ? "*" : "https://louiserought.com",
    methods: "GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS",
    credentials: true,
    optionsSuccessStatus: 204,
  };

  app.enableCors(corsOptions);

  return app.init();
};

createNestServer(server)
  .then((v) => console.log("Nest Ready"))
  .catch((err) => console.error("Nest broken", err));

/* export const helloWorld = functions.https.onRequest((request, response) => {
  response.send("Hello from Firebase!");
}); */

export const api = functions.https.onRequest(server);
