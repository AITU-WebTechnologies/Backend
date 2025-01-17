const redis = require('redis');

const redisClient = redis.createClient();

redisClient.on('error', (err) => console.error('Redis Client Error', err));

(async () => {
    await redisClient.connect();
    console.log('Connected to Redis');
})();

module.exports = redisClient;
