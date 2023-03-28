import * as dotenv from "dotenv";

dotenv.config({
  path: `${__dirname}/.env`
})

export default {
  MODE: process.env.MODE,
  DB_HOST: process.env.DB_HOST,
  DB_USERNAME: process.env.DB_USERNAME,
  DB_PASSWORD: process.env.DB_PASSWORD,
  DB_DATABASE: process.env.DB_DATABASE,
}
