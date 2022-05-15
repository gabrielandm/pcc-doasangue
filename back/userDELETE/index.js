const { MongoClient } = require("mongodb");
const { connectDB, header } = require("../functions/apiFunctions");

module.exports = async function (context, req) {
    const collections = await connectDB(['Doner']);
    const donerCollection = collections[0];

    const email = req.body.email;

    const foundDoc = await donerCollection.deleteOne({
        "email": email
    });

    context.res = {
        // status: 200, /* Defaults to 200 */
        body: {
            "status": "deleted"
        },
        headers: header
    };
}
