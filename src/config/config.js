const jwtConfig = {
  secretKey : "a",
  options: {
    algorithm: "HS256",
    expiresIn: "30m",
    issuer: "wnalstjr"
  }
}

const corsOptions = {
  origin: 'http://localhost:5100',
  credentials: true
}

module.exports = {jwtConfig,corsOptions}