const { connectDB, saveBlob, deleteBlob, UpdateUser, header } = require("../functions/apiFunctions");

async function Post(context, req) {
	const collections = await connectDB(['Doner']);
	const donerCollection = collections[0];

	// Save each variable to create a new user
	const email = req.body.email;
	const pass = req.body.pass;
	const validated = 0;
	const entry_date = new Date();
	const name = req.body.name;
	const last_name = req.body.last_name;
	const phone = req.body.phone;
	const blood_type = req.body.blood_type;
	const last_donation = req.body.last_donation;
	const city = req.body.city;
	const state = req.body.state;
	const country = req.body.country;
	const gender = req.body.gender;
	const birth_date = req.body.birth_date;

	// Save to the database
	const createdDoc = await donerCollection.insertOne({
		"email": email,
		"pass": pass,
		"validated": validated,
		"entry_date": entry_date.toISOString(),
		"name": name,
		"last_name": last_name,
		"phone": phone,
		"blood_type": blood_type,
		"last_donation": last_donation,
		"city": city,
		"state": state,
		"country": country,
		"gender": gender,
		"birth_date": birth_date,
		"profile_link": null,
	});

	context.res = {
		status: 201,
		body: { "status": "success", "id": createdDoc.insertedId },
		headers: header
	};
}

async function Get(context, req) {
	const collections = await connectDB(['Doner']);
	const donerCollection = collections[0];

	const email = req.query.email;
	const pass = req.query.pass;
	const type = req.query.type;

	const foundDoc = await donerCollection.findOne({
		"email": email
	});

	if (foundDoc !== null) {
		if (type === "check") {
			context.res = {
				// status: 200, /* Defaults to 200 */
				body: {
					"status": "found",
					"exist": true
				},
				headers: header
			};
		} else if (type === "id") {
			context.res = {
				// status: 200, /* Defaults to 200 */
				body: {
					"status": "found",
					"id": foundDoc["_id"]
				},
				headers: header
			};
		} else if (type === 'login') {
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
						"status": "fail",
						"message": "Wrong password"
					},
					headers: header
				};
			}
		} else if (type === 'data') {
			context.res = {
				// status: 200, /* Defaults to 200 */
				body: {
					"status": "success",
					"data": foundDoc
				},
				headers: header
			};
		}
	} else {
		context.res = {
			// status: 200, /* Defaults to 200 */
			body: {
				"status": "not found",
				"exist": false
			},
			headers: header
		};
	}
}

async function Put(context, req) {
	const collections = await connectDB(['Doner']);
	const donerCollection = collections[0];

	const email = req.body.email;
	const pass = req.body.pass;
	const validated = req.body.validated;
	const name = req.body.name;
	const last_name = req.body.last_name;
	const phone = req.body.phone;
	const blood_type = req.body.blood_type;
	const last_donation = new Date(req.body.last_donation);
	const city = req.body.city;
	const state = req.body.state;
	const country = req.body.country;
	const gender = req.body.gender;
	const birth_date = new Date(req.body.birth_date);

	const res = await donerCollection.find({ "email": email });
	let user = await res.toArray();
	user = user[0];

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
	let blobResult = undefined;
	if (image != null && deleteImage === false) {
		blobResult = await saveBlob(image, fileName, image_type);
	} else if (deleteImage === true && fileName != null) {
		blobResult = await deleteBlob(fileName);
	}
	/* End of image stuff */
	
	result = UpdateUser(user, email, pass, validated, name, last_name, phone, blood_type, last_donation, city, state, country, gender, birth_date, blobResult);

	if (result.isValid == true) {
		await donerCollection.updateOne(
			{ "email": email },
			{ $set: result.userData }
		);

		context.res = {
			body: {
				status: "updated",
			},
			headers: header
		};
	} else if (result.isValid == false) {
		context.res = {
			status: 400,
			body: {
				status: "not valid update"
			},
			headers: header
		};
	}
}

async function Delete(context, req) {
	const collections = await connectDB(['Doner']);
	const donerCollection = collections[0];

	const email = context.req.params.email;

	// Get document to be deleted
	let doc = await donerCollection.findOne({ "email": email });
	// Delete image from blob storage
	await deleteBlob(doc.profile_link.split('/')[doc.profile_link.split('/').length-1])
	// Delete document
	const foundDoc = await donerCollection.deleteOne({ "email": email });

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