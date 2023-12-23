import { envs } from './config/envs';
import { Mongodatabase } from './data';
import { AppRoutes } from './presentation/routes';
import { Server } from './presentation/server';


(async () => {
  main();
})();


async function main() {

  await Mongodatabase.connect({
    dbName: envs.MONGO_DB_NAME,
    mongoUrl: envs.MONGO_URL,
  })

  const server = new Server({
    port: envs.PORT,
    routes: AppRoutes.routes,
  });

  server.start();
}