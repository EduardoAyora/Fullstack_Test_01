import swaggerJSDoc from 'swagger-jsdoc';

const options: swaggerJSDoc.Options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Project Manager API',
      version: '1.0.0',
      description: 'API de gestión de proyectos y tareas'
    },
    servers: [
      {
        url: '/api',
        description: 'Servidor'
      }
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT'
        }
      }
    },
    security: [
      {
        bearerAuth: []
      }
    ]
  },
  apis: ['src/routes/*.ts', 'dist/routes/*.js'] // donde Swagger leerá los comentarios
};

export const swaggerSpec = swaggerJSDoc(options);
