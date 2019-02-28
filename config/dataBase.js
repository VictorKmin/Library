module.exports = Object.freeze({
    "host":     process.env.DB_HOST || "localhost",
    "dialect":  process.env.DB_DIALECT || "postgres",
    "username": process.env.DB_USER || 'ukrinsoft',
    "password": process.env.DB_PASSWORD || '2009',
    "database": process.env.DB_NAME || 'library'
});