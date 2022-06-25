const { connectDB, saveBlob, deleteBlob, UpdateCorp, header } = require("../functions/apiFunctions");

async function Post(context, req) {
	const collections = await connectDB(['Corp']);
	const corpCollection = collections[0];

	// Save each variable to create a new corp
	const cnpj = req.body.cnpj;
	const pass = req.body.pass;
	const name = req.body.name;
	const country = req.body.country;
	const city = req.body.city;
	const address = req.body.address;
	const coordinates = req.body.coordinates;
	const phone = req.body.phone;
	const email = req.body.email;
	const state = req.body.state;
	const entry_date = new Date();
	const subscription_type = req.body.subscription_type;
	const subscription_start = req.body.subscription_start;
	const subscription_end = req.body.subscription_end;

	const createdDoc = await corpCollection.insertOne({
		"cnpj": cnpj,
		"pass": pass,
		"name": name,
		"country": country,
		"city": city,
		"address": address,
		"coordinates": coordinates,
		"phone": phone,
		"email": email,
		"state": state,
		"entry_date": entry_date.toISOString(),
		"subscription_type": subscription_type,
		"subscription_start": subscription_start,
		"subscription_end": subscription_end
	});

	context.res = {
		status: 201,
		body: { "status": "success", "id": createdDoc.insertedId },
		headers: header
	};
}

async function Get(context, req) {
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
			console.log(foundDoc)
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

async function Put(context, req) {
	const collections = await connectDB(['Corp']);
	const corpCollection = collections[0];

	const cnpj = req.body.cnpj;
	const pass = req.body.pass;
	const name = req.body.name;
	const country = req.body.country;
	const city = req.body.city;
	const address = req.body.address;
	const coordinates = req.body.coordinates;
	const phone = req.body.phone;
	const email = req.body.email;
	const state = req.body.state;
	const subscription_type = req.body.subscription_type;
	const subscription_start = req.body.subscription_start;
	const subscription_end = req.body.subscription_end;

	/* Image stuff */
	const profile_link = req.body.profile_link; // Null if doesn't exist
	const image_type = req.body.image_type;
	let fileName = undefined;
	if (typeof profile_link == 'string') {
		fileName = profile_link.split('/')[profile_link.split('/').length - 1];
	}
	const deleteImage = req.body.delete_image; // True if user want's to delete current image
	// Image
	const image = req.body.image;
	if (image != null && deleteImage === false) {
		blobResult = await saveBlob(image, fileName, image_type);
	} else if (deleteImage === true && fileName != null) {
		blovResult = await deleteBlob(fileName);
	}
	/* End of image stuff */

	const res = await corpCollection.find({ "cnpj": cnpj });
	let corp = await res.toArray();
	corp = corp[0];
	corp = UpdateCorp(corp, cnpj, pass, name, country, city, address, coordinates, phone, email, state, subscription_type, subscription_start, subscription_end, blobResult.fileUrl);

	if (corp.isValid) {
		corpCollection.updateOne(
			{ "cnpj": cnpj },
			{ $set: corp.corpData }
		);

		context.res = {
			body: {
				status: "updated"
			},
			headers: header
		};
	} else {
		context.res = {
			status: 400,
			body: {
				status:"not valid update"
			},
			headers: header
		};
	}
}

async function Delete(context, req) {
	const collections = await connectDB(['Corp']);
	const corpCollection = collections[0];

	const cnpj = context.req.params.cnpj;

	const foundDoc = await corpCollection.deleteOne({
		"cnpj": cnpj
	});

	context.res = {
		// status: 200, /* Defaults to 200 */
		body: {
			"status": "deleted"
		},
		headers: header
	};
}

async function Options(context, req) {
	context.res = {
		status: 204,
		headers: header
	};
}

module.exports = async function (context, req) {
	switch (req.method) {
		case "POST":
			await Post(context, req);
			break;
		case "GET":
			await Get(context, req);
			break;
		case "PUT":
			await Put(context, req);
			break;
		case "DELETE":
			await Delete(context, req);
			break;
		case "OPTIONS":
			await Options(context, req);
			break;
		default:
			context.res = {
				body: { status: "Method not allowed" },
				status: 400,
				headers: header
			};
			break;
	}
}