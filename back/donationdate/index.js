const ObjectId = require('mongodb').ObjectId;
const { connectDB, header, UpdateDonationDate } = require("../functions/apiFunctions");

async function Post(context, req) {
	const collections = await connectDB(['DonationDate', 'Campaign', 'Doner', 'Corp']);
	const donationdateCollection = collections[0];
	const campaignCollection = collections[1]; // For campaign validation
	const donerCollection = collections[2]; // For doner validation
	const corpCollection = collections[3]; // For corp validation

	const doner_id = req.body.doner_id;
	const corp_cnpj = req.body.corp_cnpj;
	const campaign_id = req.body.campaign_id;
	const donation_date = req.body.donation_date;

	// Validating
	const campaign = await campaignCollection.findOne({ '_id': ObjectId(campaign_id) })
	if (campaign === null) {
		context.res = {
			status: 400,
			body: { "status": "campaign not found" },
			headers: header
		};
		return;
	}
	const doner = await donerCollection.findOne({ '_id': ObjectId(donation_date) })
	if (doner === null) {
		context.res = {
			status: 400,
			body: { "status": "doner not found" },
			headers: header
		};
		return;
	}
	const corp = await corpCollection.findOne({ 'cnpj': corp_cnpj })
	if (corp === null) {
		context.res = {
			status: 400,
			body: { "status": "corp not found" },
			headers: header
		};
		return;
	}

	const exists = await donationdateCollection.findOne({
		"doner_id": doner_id,
		"corp_cnpj": corp_cnpj,
		"campaign_id": campaign_id,
	})
	if (exists !== null) {
		context.res = {
			status: 400,
			body: { "status": "donation already registred" },
			headers: header
		};
		return;
	}

	const createdDoc = await donationdateCollection.insertOne({
		"doner_id": doner_id,
		"corp_cnpj": corp_cnpj,
		"campaign_id": campaign_id,
		"donation_date": donation_date,
	});

	context.res = {
		status: 201,
		body: { "status": "success", "id": createdDoc.insertedId },
		headers: header
	};
}

async function Get(context, req) {
	const collections = await connectDB(['DonationDate']);
	const donationdateollection = collections[0];

	const id = req.query.id;
	const startDate = new Date(req.query.startDate);
	const endDate = new Date(req.query.endDate);

	let foundDoc = null
	if (startDate !== undefined && endDate !== undefined) {
		if (isNaN(startDate) || isNaN(endDate)) {
			context.res = {
				status: 400,
				body: { status: 'invalid dates' },
				headers: header
			};
		}
		foundDoc = await donationdateollection.aggregate([
			{ "$addFields": { "mousse": {"$toDate": "$donation_date"} }},
			{ "$match": { "mousse": { "$gte": startDate, "$lte": endDate }}},
			{ "$count": "count" }
		])

		foundDoc = await foundDoc.toArray();
		foundDoc = foundDoc[0]
	} else if (id !== undefined) {
		foundDoc = await donationdateollection.findOne({
			"_id": ObjectId(id),
		});
	} else {
		context.res = {
			status: 400,
			body: { status: 'unknown parameters or just send startDate and endDate' },
			headers: header
		};
	}

	context.res = {
		status: 200,
		body: foundDoc,
		headers: header
	};
}

async function Put(context, req) {
	const collections = await connectDB(['DonationDate', 'Campaign', 'Doner', 'Corp']);
	const donationdateCollection = collections[0];
	const campaignCollection = collections[1];
	const donerCollection = collections[2];
	const corpCollection = collections[3];

	const id = req.body.id;
	const doner_id = req.body.doner_id;
	const corp_cnpj = req.body.corp_cnpj;
	const campaign_id = req.body.campaign_id;
	const donation_date = req.body.donation_date;

	// Validating
	const campaign = await campaignCollection.findOne({ '_id': ObjectId(campaign_id) })
	if (campaign === null) {
		context.res = {
			status: 400,
			body: { "status": "campaign not found" },
			headers: header
		};
		return;
	}
	const doner = await donerCollection.findOne({ '_id': ObjectId(donation_date) })
	if (doner === null) {
		context.res = {
			status: 400,
			body: { "status": "doner not found" },
			headers: header
		};
		return;
	}
	const corp = await corpCollection.findOne({ 'cnpj': corp_cnpj })
	if (corp === null) {
		context.res = {
			status: 400,
			body: { "status": "corp not found" },
			headers: header
		};
		return;
	}

	let res = await donationdateCollection.findOne({ "_id": ObjectId(id) });
	res = UpdateDonationDate(res, doner_id, corp_cnpj, campaign_id, donation_date);
	await donationdateCollection.updateOne(
		{ "_id": ObjectId(id) },
		{ $set: res }
	);

	context.res = {
		body: { status: "updated" },
		headers: header
	};
}

async function Delete(context, req) {
	const collections = await connectDB(['DonationDate']);
	const donationDateCollection = collections[0];

	const id = context.req.params.id;

	const foundDoc = await donationDateCollection.deleteOne({
		"_id": ObjectId(id)
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
