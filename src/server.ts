import mongoose from 'mongoose';
import http from 'http';

import config from './app/config';
import app from './app';
import { initSocket } from './app/utils/soket';

main().catch((err) => console.log(err));

async function main() {
  try {
    await mongoose.connect(config.db_url as string);

    const server = http.createServer(app);

    // ✅ Initialize socket
    initSocket(server);

    server.listen(config.port, () => {
      console.log(`Server running on port ${config.port}`);
    });
  } catch (err) {
    console.log(err);
  }
}
