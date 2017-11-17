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
  },
  totalCheckins: {type: Number, default: 0},
  checkins: [{
    time: {type: Date, default: Date.now},
    amount: {type: Number, default: 0}
  }]
});
AppSchema.index({name: 1}, {unique: true});

const AppModel = Mongoose.model('App', AppSchema);

exports.createOrUpdateAppByName = async (name, data) => {
	return AppModel.findOneAndUpdate({name}, data, {upsert: true, new: true});
}

const logCheckIn = async name => {
  const {totalCheckins} = await AppModel.findOne({name});
  const log = {
    time: Date.now(),
    amount: totalCheckins + 1
  };
  return AppModel.findOneAndUpdate({name}, {$inc: {totalCheckins: 1}, $push: {checkins: log}});
};

exports.getAppByName = async name => {
  await logCheckIn(name);
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
