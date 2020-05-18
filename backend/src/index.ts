import dotenv from "dotenv";
dotenv.config();

import app from "./app";

app().then((server) => {
    console.log(`Example app listening on ${server.port}!`);
});