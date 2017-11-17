const babel = require('babel-core');

const options = {
  plugins: ['transform-react-jsx']
};

module.exports = code => {
	const {code: transformed} = babel.transform(code, options);
	return transformed;
};
