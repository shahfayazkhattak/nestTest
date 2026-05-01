export default () => ({
  port: parseInt(process.env.PORT as string, 10) || 3000,
  mongoUri: process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/task-api',
  apiKey: process.env.API_KEY || 'dev-secret-key',
  nodeEnv: process.env.NODE_ENV || 'development',
  jwtSecret: process.env.JWT_SECRET || 'dev-secret-key',
});
