import KeycloakStrategy from "@exlinc/keycloak-passport";

export default new KeycloakStrategy(
    {
        host: 'http://localhost:8080/',
        authorizationURL: 'http://localhost:8080/',
        tokenURL: 'http://localhost:8080/',
        userInfoURL: 'http://localhost:8080/',
        realm: 'sso',
        clientID: 'node',
        clientSecret: 'process.env.KEYCLOAK_CLIENT_SECRET,',
        callbackURL: `/api/callback`
      },
      (accessToken, refreshToken, profile, done) => {
        console.log('keycloak', profile)
      }
)
