const { MongoClient } = require("mongodb");
const ObjectId = require('mongodb').ObjectId;
const { connectDB, UpdateUser, header } = require("../functions/apiFunctions");

module.exports = async function (context, req) {
    const collections = await connectDB(['Doner']);
    const donerCollection = collections[0];

    const email = req.body.email;
    const pass = req.body.pass;
    const validated = req.body.validated;
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
    const profile_link = req.body.profile_link;

    const res = await donerCollection.find({"email": email});
    let user = await res.toArray();
    user = user[0];
    user = UpdateUser(user, email, pass, validated, name, last_name, phone, blood_type, last_donation, city, state, country, gender, birth_date, profile_link);

    donerCollection.updateOne(
        {"email": email},
        {$set: user}
    );

    context.res = {
        body: {status: "updated"},
        headers: header
    };
}