const { MongoClient } = require("mongodb");
const { connectDB, header } = require("../functions/apiFunctions");

module.exports = async function (context, req) {
  const collections = await connectDB(['Corp']);
  const corpCollection = collections[0];

  // Save each variable to create a new corp
  const cnpj = req.body.cnpj;
  const pass = req.body.pass;
  const name = req.body.name;
  const country = req.body.country;
  const city = req.body.city;
  const address = req.body.address;
  const phone = req.body.phone;
  const email = req.body.email;
  const state = req.body.state;
  const entry_date = new Date();
  const subscription_type = req.body.subscription_type;
  const subscription_start = req.body.subscription_start;
  const subscription_end = req.body.subscription_end;

  const createdDoc = await corpCollection.insertOne({
    "cnpj": cnpj,
    "pass": pass,
    "name": name,
    "country": country,
    "city": city,
    "address": address,
    "phone": phone,
    "email": email,
    "state": state,
    "entry_date": entry_date.toISOString(),
    "subscription_type": subscription_type,
    "subscription_start": subscription_start,
    "subscription_end": subscription_end
  });

  context.res = {
    status: 201,
    body: { "status": "success", "id": createdDoc.insertedId },
    headers: header
  };
}