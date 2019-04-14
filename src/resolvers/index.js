// import { Group } from './Group'
// import { User } from './User'
import { authQueries } from './Auth'

const Query = {
  ...authQueries
}

const resolvers = {
  // Group,
  // User,
  Query
}

module.exports = {
  resolvers,
}