/*
    In production, modify this route to be only called by the Azure Function App or Admin.
    user adm
    pass adm
*/

const { MongoClient } = require("mongodb");
const { connectDB, header } = require("../functions/apiFunctions");

module.exports = async function (context, req) {
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
		body: {"status": "success", "id": createdDoc.insertedId},
		headers: header
	};
}