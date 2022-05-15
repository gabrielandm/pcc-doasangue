const { MongoClient } = require("mongodb");
const ObjectId = require('mongodb').ObjectId;
const { connectDB, header } = require("../functions/apiFunctions");

module.exports = async function (context, req) {
  const collections = await connectDB(['Campaign']);
  const campaignCollection = collections[0];

  const filter = req.query.filter;
  const filter_name = req.query.filter_name;

  console.log(filter_name)
  console.log(filter)
  const foundDoc = await campaignCollection.find({
    filter_name: filter
  });

  context.res = {
    body: foundDoc,
    headers: header
  };
}