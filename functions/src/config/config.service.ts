import { Injectable } from "@nestjs/common";

import * as dotenv from "dotenv";
import * as fs from "fs";

@Injectable()
export class ConfigService {
  private readonly NODE_ENV: string;

  constructor(env: string) {
    this.NODE_ENV = env === "development" ? env : "production";
    const config = dotenv.parse(fs.readFileSync(this.NODE_ENV + ".env"));
    console.log(config);
  }
}
