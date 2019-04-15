'use strict'

import { GraphQLServer } from 'graphql-yoga'
import { Prisma } from './generated/prisma-client'
import { resolvers, fragmentReplacements } from './resolvers'
import { mergeSchemas, makeExecutableSchema } from 'graphql-tools'
import prismaSchema from './generated/prisma/prisma.graphql' 
import mainSchema from './schema.graphql'

var session = require('express-session');
var Keycloak = require('keycloak-connect');

let kcConfig = {
  clientId: 'node',
  bearerOnly: true,
  serverUrl: 'http://localhost:8080/auth',
  realm: 'sso',
  realmPublicKey: 'MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEAk5XDSRUHHu+R5blR0BEyL2mVpHr4nevywjvUT3Dj0t7X0/fygc/1THXleuOJ7L3D9PA6tBcecnYj/yE//44yDB95xra7SAILIui6p+IL7sYITpNnhpco7QTE3mTrAIWVDBO45cLG4VXgZjnxtIk759MuPwJhQ2uJORCe7+YAUgiRE8upD4hErXrs3SFIXvueL+iiEFKL+oMBlcWXhSHwhJ/CTmiGd2PrbvVd6NEelPetdAPy8ceHyg4hNd08MEanwvYSJDSo0TmyfAgSlsbHaZHEWd8XIxqre9ac+2rTkxq4YoAPf/xkx1FEkQ77VjzRxyf4KGN/yVpDR+NaUfryywIDAQAB'
};

var memoryStore = new session.MemoryStore();
var keycloak = new Keycloak({}, kcConfig);

const prisma = new Prisma({ 
  debug: true 
})

const schema = mergeSchemas({
  schemas: [
    makeExecutableSchema({
      typeDefs: mainSchema,
      resolvers: resolvers
    })
  ]
})


// how to expose only yoga stuff without copy & paste prisma stuff
const server = new GraphQLServer({
  // schema,
  typeDefs: mainSchema,
  resolvers: resolvers,
  context: { prisma },
})

const options = { 
  port: 4100,
  playground: '/playground',
  endpoint: '/graphql',
}

const keycloakMiddleware = keycloak.middleware();
const usedKeycloakMiddleware = [keycloakMiddleware[0], keycloakMiddleware[3]]

server.express.use(keycloakMiddleware);
// server.use(usedKeycloakMiddleware);
server.express.post('/graphql', keycloak.protect());

server.start(options, ({ port }) =>
  console.log(`Server is running on http://localhost:${port}`),
)
