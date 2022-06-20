const ObjectId = require('mongodb').ObjectId;
const { connectDB, header } = require("../functions/apiFunctions");

async function Post(context, req) {
	const collections = await connectDB(['DonationDate', 'Campaign', 'Doner', 'Corp']);
	const donationdateCollection = collections[0];
	// const campaignCollection = collections[1]; // For future validation
	// const donerCollection = collections[2]; // For future validation
	// const corpCollection = collections[3]; // For future validation

	const doner_email = req.body.doner_email;
	const corp_cnpj = req.body.corp_cnpj;
	const campaign_code = req.body.campaign_code;
	const ammount_date = req.body.ammount;
	const donation_date = req.body.donation_date;
	const validated = req.body.validated;

	const createdDoc = await donationdateCollection.insertOne({
		"doner_email": doner_email,
		"corp_cnpj": corp_cnpj,
		"campaign_code": campaign_code,
		"ammount_date": ammount_date,
		"donation_date": donation_date,
		"validated": validated
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

	const id = req.body.id;

	const foundDoc = await donationdateollection.findOne({
		"_id": ObjectId(id),
	});

	context.res = {
		status: 200,
		body: foundDoc,
		headers: header
	};
}

async function Put(context, req) {
	const collections = await connectDB(['DonationDate', 'Campaign', 'Doner', 'Corp']);
	const donationdateCollection = collections[0];
	// const campaignCollection = collections[1];
	// const donerCollection = collections[2];
	// const corpCollection = collections[3];

	const id = req.body.id;
	const doner_email = req.body.doner_email;
	const corp_cnpj = req.body.corp_cnpj;
	const campaign_code = req.body.campaign_code;
	const ammount_date = req.body.ammount;
	const donation_date = req.body.donation_date;
	const validated = req.body.validated;

	let res = await corpCollection.findOne({ "_id": ObjectId(id) });
	res = UpdateDonationDate(res, doner_email, corp_cnpj, campaign_code, ammount_date, donation_date, validated);
	corpCollection.updateOne(
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