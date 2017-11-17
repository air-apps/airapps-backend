const {env} = process;

exports.MONGO_URI = env.MONGO_URI || 'mongodb://localhost:27017/airapps';
