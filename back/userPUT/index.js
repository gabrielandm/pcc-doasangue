const { MongoClient } = require("mongodb");
const ObjectId = require('mongodb').ObjectId;
const { connectDB, UpdateUser, header } = require("../functions/apiFunctions");

module.exports = async function (context, req) {
    const collections = await connectDB(['Doner']);
    const donerCollection = collections[0];

    const email = req.body.email;
    const pass = req.body.pass;
    const validated = req.body.validated;

    const res = await donerCollection.find({"email": email});
    let user = await res.toArray();
    user = user[0];
    user = UpdateUser(user, email, pass, validated);

    donerCollection.updateOne(
        {"email": email},
        {$set: user}
    );

    context.res = {
        body: {status: "updated"},
        headers: header
    };
}