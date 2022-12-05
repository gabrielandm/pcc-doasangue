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

	console.log(req.body)

	// Validating
	const campaign = await campaignCollection.findOne({ '_id': ObjectId(campaign_id) })
	if (campaign === null) {
		console.log('campaign not found')
		context.res = {
			status: 400,
			body: { "status": "campaign not found" },
			headers: header
		};
		return;
	}
	const doner = await donerCollection.findOne({ '_id': ObjectId(doner_id) })
	if (doner === null) {
		console.log('doner not found')
		context.res = {
			status: 400,
			body: { "status": "doner not found" },
			headers: header
		};
		return;
	}
	const corp = await corpCollection.findOne({ 'cnpj': corp_cnpj })
	if (corp === null) {
		console.log('corp not found')
		context.res = {
			status: 400,
			body: { "status": "corp not found" },
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

	const idValue = req.query.idValue;
	const idName = req.query.idName;

	/* TRI DATA */
	var currentDate = new Date();
	let lastTriMonth = new Date(currentDate);
	lastTriMonth.setDate(currentDate.getDate() - 90);
	var foundDoc = null;
	var foundDoc = await donationdateollection.find({ [idName]: { "$eq": idValue } }).sort({ _id: -1 }).limit(1);
	// Saving data
	foundDoc = await foundDoc.toArray()
	let triData = null;
	if (foundDoc.length == 0) {
		var temp = new Date('2005-06-12T03:33:00');
		triData = temp.toISOString();
	} else {
		triData = foundDoc[0]['donation_date'];
	}

	/* QUADRI DATA */
	var currentDate = new Date();
	let lastQuadriMonth = new Date(currentDate);
	lastQuadriMonth.setDate(currentDate.getDate() - 120);
	var foundDoc = null;
	var foundDoc = await donationdateollection.find({ [idName]: { "$eq": idValue } }).sort({ _id: -1 }).limit(1);
	// Saving data
	foundDoc = await foundDoc.toArray();
	let quadriData = null;
	if (foundDoc.length == 0) {
		var temp = new Date('2005-06-12T03:33:00');
		quadriData = temp.toISOString();
	} else {
		quadriData = foundDoc[0]['donation_date'];
	}

	/* OVERALL DATA */
	var foundDoc = null;
	var foundDoc = await donationdateollection.find({ [idName]: { "$eq": idValue } });
	// Saving data
	foundDoc = await foundDoc.toArray();
	let overallCount = null;
	if (foundDoc == null) {
		overallCount = 0
	} else {
		overallCount = foundDoc.length;
	}

	/* MONTHLY DATA */
	var currentDate = new Date();
	let lastMonth = new Date(currentDate);
	lastMonth.setDate(currentDate.getDate() - 30);
	var foundDoc = null;
	foundDoc = await donationdateollection.aggregate([
		{ "$addFields": { "mousse": { "$toDate": "$donation_date" } } },
		{
			"$match": {
				"mousse": { "$gte": lastMonth, "$lte": currentDate },
				[idName]: { "$eq": idValue }
			}
		},
		{ "$count": "count" }
	]);
	// Saving data
	foundDoc = await foundDoc.toArray();
	foundDoc = foundDoc[0];
	let monthData = 0;
	if (foundDoc == null) {
		monthData = 0;
	} else {
		monthData = foundDoc['count'];
	}

	/* WEEKLY DATA */
	let weekData = [];
	var currentDate = new Date();
	for (var i = 1; i < 8; i++) {
		// Reducing day of current date
		if (i > 1) {
			currentDate.setDate(currentDate.getDate() - 1);
		}
		// Getting day before date
		var yDate = new Date(currentDate);
		yDate.setDate(currentDate.getDate() - 1);
		// Fetching data from DB
		var foundDoc = null;
		foundDoc = await donationdateollection.aggregate([
			{ "$addFields": { "mousse": { "$toDate": "$donation_date" } } },
			{
				"$match": {
					"mousse": { "$gte": yDate, "$lte": currentDate },
					[idName]: { "$eq": idValue }
				}
			},
			{ "$count": "count" }
		]);
		// Saving data
		foundDoc = await foundDoc.toArray();
		foundDoc = foundDoc[0];
		if (foundDoc == null) {
			weekData.push({
				count: 0,
				weekDay: currentDate.getDay(),
			});
		} else {
			weekData.push({
				count: foundDoc['count'],
				weekDay: currentDate.getDay(),
			});
		}
	}

	/* WEEK TOTAL DATA */
	var currentDate = new Date();
	let lastWeek = new Date(currentDate);
	lastWeek.setDate(currentDate.getDate() - 7);
	var foundDoc = null;
	foundDoc = await donationdateollection.aggregate([
		{ "$addFields": { "mousse": { "$toDate": "$donation_date" } } },
		{
			"$match": {
				"mousse": { "$gte": lastWeek, "$lte": currentDate },
				[idName]: { "$eq": idValue }
			}
		},
		{ "$count": "count" }
	]);
	// Saving data
	foundDoc = await foundDoc.toArray();
	foundDoc = foundDoc[0];
	let weekTotalData = 0;
	if (foundDoc == null) {
		weekTotalData = 0;
	} else {
		weekTotalData = foundDoc['count'];
	}

	context.res = {
		status: 200,
		body: {
			// First element is current day
			weekCount: weekData,
			monthCount: monthData,
			weekTotalCount: weekTotalData,
			triData: triData,
			quadriData: quadriData,
			overallCount: overallCount,
		},
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
