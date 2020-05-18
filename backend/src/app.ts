// Configure server
import Server from "./config/server";

import { routerV1 } from "./routes/v1";

export default async () => {
    const server = new Server();

    // run server
    await server.bootstrap([routerV1]);
    return server;
};
