
module.exports = {
	retrieve: retrieve
};


function retrieve(params) {
	return function controller(req, res, next) {
		var model_arguments = req.query;
		model_arguments.inflection = params.inflection;
		if (req.params.id) {
			model_arguments.where = model_arguments.where || {}; 
			model_arguments.where.id = req.params.id;
		}
		
		params.model.get(model_arguments)
		.then(function (data) {
			res.status(200).json({
				message: params.message,
				data: data
			});
		})
		.catch(function (error) {
			console.log(error);
		});
	}
}
