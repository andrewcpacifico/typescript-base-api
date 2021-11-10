import server from './server';

async function main() {
  await server.initialize();
  return server.start();
}

export default main();
