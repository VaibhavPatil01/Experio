import qdrantClient from './configs/qdrant.js';

async function getInfo() {
  try {
    const users = await qdrantClient.getCollection('users');
    console.log('Users collection size:', users.config.params.vectors.size);
  } catch(e) {
    console.log('Users collection does not exist');
  }
}
getInfo();
