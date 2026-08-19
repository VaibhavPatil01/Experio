import 'dotenv/config';
import app from './app.js';
import connectDB from './configs/db.js';
import { initQdrant } from './configs/qdrant.js';
import { initSocket } from './configs/socket.js';
import preventServerSleep from './utils/preventServerSleep.js';
import { initNotificationWorker } from './modules/posts/workers/notificationWorker.js';
import { initEmbeddingSyncWorker } from './core/qdrant/embeddingSyncWorker.js';

// Start Server
async function startServer() {
  try {
    // 1. Initialize Databases & Third-Party Services FIRST
    await connectDB();
    await initQdrant();
    console.log('✅ AI Knowledge Layer Initialized');
    
    // 2. Initialize Background Workers
    initEmbeddingSyncWorker();
    initNotificationWorker();
    preventServerSleep();
    
    // 3. Start the HTTP Server LAST (Only when everything else is ready)
    const PORT = process.env.PORT || 3000;
    const server = app.listen(PORT, () => {
      console.log(`✅ Server is running on PORT ${PORT}`);
    });
    
    // 4. Attach WebSockets to the running server
    initSocket(server);
    console.log('✅ Socket.io Initialized');
  } catch (error) {
    console.error('❌ Failed to start server:', error);
    process.exit(1); // Exit strictly if dependencies fail
  }
}

startServer();
