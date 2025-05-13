const { GraphQLObjectType, GraphQLID, GraphQLString, GraphQLInt, GraphQLList, GraphQLSchema } = require('graphql');

// Dados mockados (em um projeto real, usaria um banco de dados)
let tenisData = [
  { id: '1', nome: 'Air Jordan 1 Retro High', marca: 'Nike', preco: 1200, tamanho: 42, cor: 'Vermelho/Branco', lancamento: '2020' },
  { id: '2', nome: 'Yeezy Boost 350 V2', marca: 'Adidas', preco: 1500, tamanho: 40, cor: 'Preto', lancamento: '2021' },
  { id: '3', nome: 'Classic Leather', marca: 'Reebok', preco: 450, tamanho: 39, cor: 'Branco', lancamento: '2019' }
];

// Tipo Tenis
const TenisType = new GraphQLObjectType({
  name: 'Tenis',
  fields: () => ({
    id: { type: GraphQLID },
    nome: { type: GraphQLString },
    marca: { type: GraphQLString },
    preco: { type: GraphQLInt },
    tamanho: { type: GraphQLInt },
    cor: { type: GraphQLString },
    lancamento: { type: GraphQLString }
  })
});

// Root Query
const RootQuery = new GraphQLObjectType({
  name: 'RootQueryType',
  fields: {
    tenis: {
      type: new GraphQLList(TenisType),
      resolve(parent, args) {
        return tenisData;
      }
    },
    tenisPorId: {
      type: TenisType,
      args: { id: { type: GraphQLID } },
      resolve(parent, args) {
        return tenisData.find(tenis => tenis.id === args.id);
      }
    },
    tenisPorMarca: {
      type: new GraphQLList(TenisType),
      args: { marca: { type: GraphQLString } },
      resolve(parent, args) {
        return tenisData.filter(tenis => tenis.marca.toLowerCase() === args.marca.toLowerCase());
      }
    }
  }
});

// Mutations
const Mutation = new GraphQLObjectType({
  name: 'Mutation',
  fields: {
    adicionarTenis: {
      type: TenisType,
      args: {
        nome: { type: GraphQLString },
        marca: { type: GraphQLString },
        preco: { type: GraphQLInt },
        tamanho: { type: GraphQLInt },
        cor: { type: GraphQLString },
        lancamento: { type: GraphQLString }
      },
      resolve(parent, args) {
        const novoId = (tenisData.length + 1).toString();
        const tenis = {
          id: novoId,
          nome: args.nome,
          marca: args.marca,
          preco: args.preco,
          tamanho: args.tamanho,
          cor: args.cor,
          lancamento: args.lancamento
        };
        tenisData.push(tenis);
        return tenis;
      }
    },
    removerTenis: {
      type: TenisType,
      args: { id: { type: GraphQLID } },
      resolve(parent, args) {
        const index = tenisData.findIndex(tenis => tenis.id === args.id);
        if (index === -1) throw new Error('Tênis não encontrado');
        const tenisRemovido = tenisData[index];
        tenisData = tenisData.filter(tenis => tenis.id !== args.id);
        return tenisRemovido;
      }
    }
  }
});

module.exports = new GraphQLSchema({
  query: RootQuery,
  mutation: Mutation
});