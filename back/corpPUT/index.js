const { MongoClient } = require("mongodb");
const { connectDB, UpdateCorp, header } = require("../functions/apiFunctions");

module.exports = async function (context, req) {
    const collections = await connectDB(['Corp']);
    const corpCollection = collections[0];

    const cnpj = req.body.cnpj;
    const pass = req.body.pass;
    const name = req.body.name;
    const country = req.body.country;
    const city = req.body.city;
    const address = req.body.address;
    const coordinates = req.body.coordinates;
    const phone = req.body.phone;
    const email = req.body.email;
    const state = req.body.state;
    const entry_date = new Date();
    const subscription_type = req.body.subscription_type;
    const subscription_start = req.body.subscription_start;
    const subscription_end = req.body.subscription_end;

    const res = await corpCollection.find({"cnpj": cnpj});
    let corp = await res.toArray();
    corp = corp[0];
    corp = UpdateCorp(corp, cnpj, pass, name, country, city, address, coordinates, phone, email, state, entry_date, subscription_type, subscription_start, subscription_end);
    // 6277c41632b4f7308bb02d55
    corpCollection.updateOne(
        {"cnpj": cnpj},
        {$set: corp}
    );

    context.res = {
        body: {status: "updated"},
        headers: header
    };
}