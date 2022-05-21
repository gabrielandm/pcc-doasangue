const { MongoClient } = require("mongodb");
const { header } = require("../functions/apiFunctions");

// Two different ways to call //
// id -> returns the id of the document
// check -> returns if the email exists or not

module.exports = async function (context, req) {
    const client = new MongoClient('mongodb+srv://adm:adm@mousse.ed5s0.mongodb.net/myFirstDatabase?retryWrites=true&w=majority', { useUnifiedTopology: true });
	await client.connect();
	const database = client.db("MousseDB");
	const donerCollection = database.collection("Doner");

    const email = req.query.email;
    const pass = req.query.pass;
    const type = req.query.type;

    const foundDoc = await donerCollection.findOne({
        "email": email
    });

    if (foundDoc !== null) {
        if (type === "check") {
            context.res = {
                // status: 200, /* Defaults to 200 */
                body: {
                    "status": "found",
                    "exist": true
                },
                headers: header
            };
        } else if (type === "id") {
            context.res = {
                // status: 200, /* Defaults to 200 */
                body: {
                    "status": "found",
                    "id": foundDoc["_id"]
                },
                headers: header
            };
        } else if (type === 'login') {
            if (foundDoc["pass"] === pass) {
                context.res = {
                    // status: 200, /* Defaults to 200 */
                    body: {
                        "status": "success",
                        "id": foundDoc["_id"]
                    },
                    headers: header
                };
            } else {
                context.res = {
                    // status: 200, /* Defaults to 200 */
                    body: {
                        "status": "fail",
                        "message": "Wrong password"
                    },
                    headers: header
                };
            }
        }
    } else {
        context.res = {
            // status: 200, /* Defaults to 200 */
            body: {
                "status": "not found",
                "exist": false
            },
            headers: header
        };
    }
}