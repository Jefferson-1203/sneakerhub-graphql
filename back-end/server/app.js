const express = require('express');
const { graphqlHTTP } = require('express-graphql');
const cors = require('cors');
const schema = require('./schema/schema');

const app = express();

// Permitir CORS
app.use(cors());

// Configurar rota GraphQL
app.use('/graphql', graphqlHTTP({
  schema,
  graphiql: true
}));

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`Servidor GraphQL rodando na porta ${PORT}`);
});