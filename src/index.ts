import { DependencyContainer, registerDependencies } from './dependency-container';

const dependencyContainer: DependencyContainer = registerDependencies();

async function initialize() {
  const {
    configService,
    databaseService,
    loggerService,
  } = dependencyContainer;

  configService.load();
  loggerService.init();
  await databaseService.connect();
}

async function main() {
  const { server } = dependencyContainer;

  await initialize();
  server.start();
}

main();
