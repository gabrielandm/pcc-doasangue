const ObjectId = require('mongodb').ObjectId;
const { connectDB, saveBlob, deleteBlob, header, getCampaignFilters, UpdateCampaign } = require("../functions/apiFunctions");

async function Post(context, req) {
	const collections = await connectDB(['Campaign', 'Corp']);
	const campaignCollection = collections[0];
	// const corpCollection = collections[1]; // Needed for authentication of cnpj

	const cnpj = req.body.cnpj;
	const name = req.body.name;
	const start_date = new Date(req.body.start_date);
	const end_date = new Date(req.body.end_date);
	const open_time = req.body.open_time;
	const close_time = req.body.close_time;
	const country = req.body.country;
	const state = req.body.state;
	const city = req.body.city;
	const address = req.body.address;
	let coordinates = req.body.coordinates;
	const phone = req.body.phone;
	const creation_date = new Date();
	const num_doners = 0;
	const campaign_rating = 0;
	const observation = req.body.observation;
	const blood_types = req.body.blood_types;
	const header_color = req.body.header_color;

	/* Image stuff */
	const image_type = req.body.image_type;
	// Image
	const image = req.body.image;
	let blobResult = undefined;
	if (image != null) {
		blobResult = await saveBlob(image, undefined, image_type);
	}
	/* End of image stuff */

	/* Default coordinates, delete this in the future */
	if (coordinates == undefined) {
		coordinates = { latitude: -22.907370, longitude: -47.062901 };
	}

	const createdDoc = await campaignCollection.insertOne({
		"cnpj": cnpj,
		"name": name,
		"start_date": start_date.toISOString(),
		"end_date": end_date.toISOString(),
		"open_time": open_time,
		"close_time": close_time,
		"country": country,
		"state": state,
		"city": city,
		"address": address,
		"coordinates": coordinates,
		"phone": phone,
		"creation_date": creation_date.toISOString(),
		"num_doners": num_doners,
		"campaign_rating": campaign_rating,
		"observation": observation,
		"blood_types": blood_types,
		"header_color": header_color,
		"banner_link": blobResult.fileUrl
	});

	context.res = {
		status: 201,
		body: {
			"status": "success",
			"id": createdDoc.insertedId
		},
		headers: header
	};
}

async function Get(context, req) {
	const collections = await connectDB(['Campaign']);
	const campaignCollection = collections[0];

	const no_Filter = req.query.no_filter;
	let foundDoc = [];

	if (no_Filter == 'true') {
		foundDoc = await campaignCollection.find();
		foundDoc = await foundDoc.toArray();
		context.res = {
			body: foundDoc,
			headers: header
		};
	} else if (no_Filter == 'false') {
		const filters = getCampaignFilters(req.query);
		foundDoc = await campaignCollection.find(filters);
		foundDoc = await foundDoc.toArray();
		context.res = {
			body: foundDoc,
			headers: header
		};
	} else {
		context.res = {
			status: 400,
			headers: header
		};
	}
}

async function Put(context, req) {
	const collections = await connectDB(['Campaign']);
	const campaignCollection = collections[0];

	const id = req.body.id;

	const cnpj = req.body.cnpj;
	const start_date = req.body.start_date;
	const end_date = req.body.end_date;
	const open_time = req.body.open_time;
	const close_time = req.body.close_time;
	const country = req.body.country;
	const state = req.body.state;
	const city = req.body.city;
	const address = req.body.address;
	const coordinates = req.body.coordinates;
	const phone = req.body.phone;
	const creation_date = new Date();
	const num_doners = req.body.num_doners;
	const campaign_rating = req.body.campaign_rating;
	const observation = req.body.observation;
	const blood_types = req.body.blood_types;
	const header_color = req.body.header_color;

	/* Image stuff */
	const banner_link = req.body.banner_link; // Null if doesn't exist
	const image_type = req.body.image_type;
	let fileName = undefined;
	if (typeof banner_link == 'string') {
		fileName = banner_link.split('/')[banner_link.split('/').length - 1];
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

	let foundDoc = await campaignCollection.findOne({
		'_id': ObjectId(id)
	});
	if (foundDoc === undefined) {
		context.res = {
			status: 400,
			body: {
				status: "campaign id not found",
				notValidData: "campaign id"
			},
			headers: header
		};
		return;
	}
	foundDoc = UpdateCampaign(foundDoc, cnpj, start_date, end_date, open_time, close_time, country, state, city, address, coordinates, phone, creation_date, num_doners, campaign_rating, observation, blood_types, header_color, banner_link);

	if (corp.isValid) {
		const newCampaignData = {
			...corp.corpData,
			start_date: corp.corpData.start_date.toISOString(),
			end_date: corp.corpData.end_date.toISOString(),
			creation_date: corp.corpData.creation_date.toISOString(),
		}
		campaignCollection.updateOne(
			{ '_id': ObjectId(id) },
			{ $set: newCampaignData }
		);
		context.res = {
			body: { status: "updated" },
			headers: header
		}
	} else {
		context.res = {
			status: 400,
			body: {
				status: "not valid update",
				notValidData: corp.notValidData
			},
			headers: header
		};
	}
}

async function Delete(context, req) {
	const collections = await connectDB(['Campaign']);
	const campaignCollection = collections[0];

	const id = context.req.params.id;
	if (id == undefined) {
		context.res = {
			body: { status: "To delete, id is required" },
			status: 400,
			headers: header
		};
		return;
	}

	// Get the document that will be deleted
	let old = await campaignCollection.findOne({ "_id": ObjectId(id) });
	// Delete the image for the curent document from the blob storage
	await deleteBlob(old.banner_link.split('/')[old.banner_link.split('/').length-1]);
	// Delete the document from database
	const foundDoc = await campaignCollection.deleteOne({ "_id": ObjectId(id) });

	context.res = {
		// status: 200, /* Defaults to 200 */
		body: {
			"status": "deleted",
			"data": foundDoc
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