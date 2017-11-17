const Mongoose = require('mongoose');

const {Schema} = Mongoose;

const AppSchema = Schema({
	name: {type: String, required: true},
	imageUrl: {type: String},
	pageId: {type: String},
  template: {type: Schema.Types.Mixed},
  coordinates: {
    latitude: {type: Number},
    longitude: {type: Number},
    _id: false
  }
});
AppSchema.index({name: 1}, {unique: true});


const AppModel = Mongoose.model('App', AppSchema);

exports.createOrUpdateAppByName = async (name, data) => {
	// const template = JSON.stringify(data.template);
	// data.template = template;
	return AppModel.findOneAndUpdate({name}, data, {upsert: true, new: true});
}

exports.getAppByName = name => {
	return AppModel.findOne({name});
}

exports.getAllApps = name => {
	return AppModel.find();
}

exports.getNearbyApps = (latitude, longitude, radius) => {
  const lat = parseFloat(latitude);
  const long = parseFloat(longitude);

  return AppModel.aggregate([
    {
      $match: {
        coordinates: {
          $geoWithin: {
            $centerSphere: [
              [long, lat],
              radius/6378.137
            ]
          }
        }
      }
    }
  ]);
};

exports.AppModel = AppModel;
