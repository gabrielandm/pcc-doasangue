const ObjectId = require('mongodb').ObjectId;
const { connectDB, header } = require("../functions/apiFunctions");

module.exports = async function (context, req) {
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