const { MongoClient } = require("mongodb");
const ObjectId = require('mongodb').ObjectId;
const { connectDB, header, getCampaignFilters } = require("../functions/apiFunctions");

module.exports = async function (context, req) {
  const collections = await connectDB(['Campaign']);
  const campaignCollection = collections[0];

  const no_Filter = req.query.no_filter;
  let foundDoc = [];

  if (no_Filter == 'true') {
    foundDoc = await campaignCollection.find();
    foundDoc = await foundDoc.toArray();
    context.res = {
      body: foundDoc,
      headers: header
    };
  } else if (no_Filter == 'false') {
    const filters = getCampaignFilters(req.query);
    foundDoc = await campaignCollection.find(filters);
    foundDoc = await foundDoc.toArray();
    context.res = {
      body: foundDoc,
      headers: header
    };
  } else {
    context.res = {
      status: 400,
      headers: header
    };
  }
}
