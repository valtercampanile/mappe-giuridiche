export const serverConfig = {
  port: parseInt(process.env.PORT || '3911', 10),
  nodeEnv: process.env.NODE_ENV || 'development',
  frontendUrl: process.env.FRONTEND_URL || 'http://localhost:3910',
};
