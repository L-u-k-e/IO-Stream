exports.param_to_query = function (params) {
	return function (req, res, next) {
		next();
	};
}