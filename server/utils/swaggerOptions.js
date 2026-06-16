export default {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'SplitMate API',
      version: '1.0.0',
      description: 'REST API documentation for SplitMate expense sharing platform'
    },
    servers: [{ url: process.env.FRONTEND_URL || 'http://localhost:5000' }]
  },
  apis: ['./routes/*.js', './models/*.js']
};
