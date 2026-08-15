import qdrantClient, { initQdrant } from './configs/qdrant.js';

async function resetCollections() {
  try {
    await qdrantClient.deleteCollection('users');
    console.log('Deleted users collection');
  } catch(e) {}
  
  try {
    await qdrantClient.deleteCollection('interviews');
    console.log('Deleted interviews collection');
  } catch(e) {}

  console.log('Reinitializing collections...');
  await initQdrant();
  console.log('Done!');
}

resetCollections();
