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
  realmPublicKey: 'MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEApkDJ7PJtDLZUXcWEq/wLGylEVpkWxEx7cvrJkU+l7FklPp8RDN82TSW1dOyK6qHXx90386gAZ83dRgSEhZSWG4kFRgY2SYdrK85bieJfi3nKrZAHKRUrrqiQRfXMFPNoUfxUXtIdBy52oSumNYZIwiMIHIfJhjU0aUB6Tq1Rzfl1k7tRKiXgHbnzxwANcowMsrvgSCONBxeUFpgovIysffua4WgiXhfi2haj/ah64kQKwmRB7QsHWwLQJwur76rwYInHqGXKyYnrXP0YUONOPdVI1CatFctmwK+KsnrpCbipTol4n7zfk7gkoSw4JtkzuMc+Y8aYsJoFfoB1UzA6DQIDAQAB'
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

server.use(usedKeycloakMiddleware);
server.express.post('/graphql', keycloak.protect());

server.start(options, ({ port }) =>
  console.log(`Server is running on http://localhost:${port}`),
)
