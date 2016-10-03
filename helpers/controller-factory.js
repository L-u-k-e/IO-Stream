var _ = require('lodash');

module.exports = {
	new: function (model) {
		return {
			read:    _.partial(read,    model),
			create:  _.partial(create,  model),
			replace: _.partial(replace, model),
			update:  _.partial(update,  model),
			remove:  _.partial(remove,  model)
		};
	}
};



function read(model, params) {
	return function middleware(req, res, next) {
		var model_args = req.query;
		model_args.inflection = params.inflection;
		model_args.expansions = req.query.includes;
		if (req.params.id) {
			model_args.where = model_args.where || {}; 
			model_args.where.id = req.params.id;
		}

		model.read(model_args)
		.then(_.partial(send_data, 200, res, params.message))
		.catch(function (error) {
			console.log(error);
		});

	};
}



function create(model, params) {
	return function middleware(req, res, next) {
		model.create(req.body)
		.then(_.partial(send_data, 201, res, params.message))
		.catch(function (err) {
			send_data(400, res, err.detail, {});
		});
	};
}



function replace(model, params) {
	return function middleware(req, res, next) {
		var new_row = req.body;
		new_row.id = req.params.id;
		model.replace({
			id: req.params.id,
			values: new_row
		})
		.then(_.partial(send_data, 200, res, params.message))
		.catch(function (err) {
			if (err.name == 'missing properties') {
				send_data(400, res, err.message, {});
			}
		});
	};
}



function update(model, params) {
	return function middleware(req, res, next) {
		model.update({
			id: req.params.id,
			values: req.body
		})
		.then(_.partial(send_data, 200, res, params.message))
		.catch(_.partial(send_data, 400, res, "error"))
	};
}



function remove(model, params) {
	return function middleware(req, res, next) {
		model.remove({id: req.params.id})
		.then(_.partial(send_data, 200, res, params.message))
		.catch(_.partial(send_data, 400, res, "error"))
	};
}









/* --------------- Helpers --------------- */


function send_data(status, res, message, data) {
	res.status((status || 200)).json({
		message: message,
		data: data
	});
}
