const { MongoClient } = require("mongodb");
const { connectDB, header } = require("../functions/apiFunctions");

module.exports = async function (context, req) {
    const collections = await connectDB(['Corp']);
    const corpCollection = collections[0];

    const cnpj = req.body.cnpj;

    const foundDoc = await corpCollection.deleteOne({
        "cnpj": cnpj
    });

    context.res = {
        // status: 200, /* Defaults to 200 */
        body: {
            "status": "deleted"
        },
        headers: header
    };
}