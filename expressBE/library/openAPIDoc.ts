import swaggerJsdoc from 'swagger-jsdoc';

const options = {
  definition: {
    openapi: '3.1.0',
    info: {
      title: 'ReceiptAppTS API',
      version: '1.0',
    },
  },
  apis: ['./controllers/*.ts'],
};

const openAPIDocJSON = swaggerJsdoc(options);

export {openAPIDocJSON};