const Joi = require('joi');
const Boom = require('boom');

const App = require('../models/app');

exports.createOrUpdateApp = {
	validate: {
		params: {
			name: Joi.string().required()
		},
		payload: {
			// If pageId is provided, will try to poll Facebook to pull data
			imageUrl: Joi.string().description('Avatar image for the app'),
			pageId: Joi.string().description('Facebook Page Id'),
      template: Joi.object().required().description('JSX template for the app').allow(true),
      coordinates: {
        longitude: Joi.number().min(-180).max(180).required(),
        latitude: Joi.number().min(-90).max(90).required()
      }
		}
	},
	handler: async (req, res) => {
		const {payload, params: {name}} = req;
		try {
			const data = await App.createOrUpdateAppByName(name, payload);
			return res({data});
		} catch (err) {
			return res(Boom.badRequest(err));
		}
	}
};

exports.getAppByName = {
	validate: {
		params: {
			name: Joi.string().required()
		}
	},
	handler: async (req, res) => {
		const {name} = req.params;
		try {
			const data = await App.getAppByName(name);
			return res({data});
		} catch (err) {
			return res(Boom.badRequest(err));
		}
	}
};

exports.getAllApps = {
	handler: async (req, res) => {
		try {
			const data = await App.getAllApps();
			return res({data});
		} catch (err) {
			return res(Boom.badRequest(err));
		}
	}
}

exports.getNearbyApps = {
  validate: {
    query: {
      longitude: Joi.number().min(-180).max(180).required(),
      latitude: Joi.number().min(-90).max(90).required(),
      radius: Joi.number().default(1)
    }
  },
  handler: async (req, res) => {
    const {longitude, latitude, radius} = req.query;
    try {
      const data = await App.getNearbyApps(latitude, longitude, radius);
      return res({data});
    } catch (err) {
      return res(Boom.badRequest(err));
    }
  }
}
