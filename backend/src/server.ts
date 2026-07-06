import http from 'http';
import { Server } from 'socket.io';
import app from './app';
import { connectDB } from './config/db';
import { redisClient } from './config/redis';

const PORT = process.env.PORT || 5000;
const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST']
  }
});

// Configure Socket.io connections
io.on('connection', (socket) => {
  console.log(`Socket connected: ${socket.id}`);

  // Room subscriptions based on userId
  socket.on('subscribe', (userId: string) => {
    socket.join(userId);
    console.log(`Socket ${socket.id} subscribed to user channel: ${userId}`);
  });

  // Support tickets updates channel
  socket.on('join_admin_support', () => {
    socket.join('admin_support');
    console.log(`Admin joined support room`);
  });

  socket.on('disconnect', () => {
    console.log(`Socket disconnected: ${socket.id}`);
  });
});

// Start server
const start = async () => {
  try {
    await connectDB();
    await redisClient.connect();
    
    server.listen(PORT, () => {
      console.log(`====================================================`);
      console.log(`NutriMind AI REST API Server running on port ${PORT}`);
      console.log(`Health Check: http://localhost:${PORT}/health`);
      console.log(`====================================================`);
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
};

start();

export { server, io };
