const { MongoClient } = require("mongodb");
const { connectDB, header } = require("../functions/apiFunctions");

module.exports = async function (context, req) {
	const collections = await connectDB(['Corp']);
	const corpCollection = collections[0];

	const cnpj = req.query.cnpj;
	const type = req.query.type;

	const foundDoc = await corpCollection.findOne({
		"cnpj": cnpj
	});

	if (foundDoc !== null) {
		if (type === "check") {
			context.res = {
				// status: 200, /* Defaults to 200 */
				body: {
					"status": "success",
					"exist": true
				},
				headers: header
			};
		} else if (type === "login") {
			const pass = req.query.password;
			if (foundDoc["pass"] === pass) {
				context.res = {
					// status: 200, /* Defaults to 200 */
					body: {
						"status": "success",
						"id": foundDoc["_id"]
					},
					headers: header
				};
			} else {
				context.res = {
					// status: 200, /* Defaults to 200 */
					body: {
						"status": "success",
						"exist": false
					},
					headers: header
				};
			}
		} else if (type === "data") {
			context.res = {
				// status: 200, /* Defaults to 200 */
				body: {
					"status": "success",
					"data": foundDoc
				},
				headers: header
			}
		} else if (type === "id") {
			context.res = {
				// status: 200, /* Defaults to 200 */
				body: {
					"status": "success",
					"id": foundDoc["_id"]
				},
				headers: header
			};
		}
	} else {
		context.res = {
			// status: 200, /* Defaults to 200 */
			body: {
				"status": "success",
				"exist": false
			},
			headers: header
		};
	}
}