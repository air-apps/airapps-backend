const Hapi = require('hapi');
const Mongoose = require('mongoose');
const Env = require('./env');
const Routes = require('./routes');

const {log} = console;

const server = new Hapi.Server();

server.connection({
	host: '0.0.0.0',
	port: 3000,
	routes: {
		cors: {
			origin: ['*']
		}
	}
});

server.register([], err => {
	if (err) {
		throw err;
	}

	server.route(Routes);
});

server.on('response', request => {
	log(`Payload: ${JSON.stringify(request.payload)}`);
	log(
		`${request.info.remoteAddress}: ${request.method.toUpperCase()} ${request
			.url.path} --> ${request.response.statusCode}`
	);
});

server.start(err => {
	if (err) {
		throw err;
	}
	Mongoose.Promise = global.Promise;
	Mongoose.connect(Env.MONGO_URI, {
		useMongoClient: true
	}, err => {
		if (err) {
			throw err;
		}
		log('> Server start on localhost:3000');
	});
});
