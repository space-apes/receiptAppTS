import swaggerJsdoc from 'swagger-jsdoc';

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'ReceiptAppTS API',
      version: '1.0',
    },
  },
  apis: ['./controllers/*.ts'],
};

const openAPIDocJSONObj = swaggerJsdoc(options);

export {openAPIDocJSONObj};