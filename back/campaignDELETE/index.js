const { MongoClient } = require("mongodb");
const ObjectId = require('mongodb').ObjectId;
const { connectDB, header } = require("../functions/apiFunctions");

module.exports = async function (context, req) {
    const collections = await connectDB(['Campaign']);
    const campaignCollection = collections[0];

    const id = req.body.id;

    const foundDoc = await campaignCollection.deleteOne({
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