const App = require('./controllers/app.js');
module.exports = [
	{
		method: 'GET',
		path: '/apps/{name}',
		config: App.getAppByName
	},
	{
		method: 'PUT',
		path: '/apps/{name}',
		config: App.createOrUpdateApp
	},
	{
		method: 'GET',
		path: '/apps',
		config: App.getAllApps
	}
];
