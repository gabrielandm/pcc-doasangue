const { MongoClient } = require("mongodb");
const ObjectId = require('mongodb').ObjectId;
const { connectDB, UpdateCampaign, header } = require("../functions/apiFunctions");

module.exports = async function (context, req) {
    const collections = await connectDB(['Campaign']);
    const campaignCollection = collections[0];

    const id = req.body.id;

    const cnpj = req.body.cnpj;
    const start_date = req.body.start_date;
    const end_date = req.body.end_date;
    const open_time = req.body.open_time;
    const close_time = req.body.close_time;
    const country = req.body.country;
    const state = req.body.state;
    const city = req.body.city;
    const address = req.body.address;
    const coordinates = req.body.coordinates;
    const phone = req.body.phone;
    const creation_date = new Date();
    const num_doners = req.body.num_doners;
    const campaign_rating = req.body.campaign_rating;
    const observation = req.body.observation;
    const blood_types = req.body.blood_types;
    const header_color = req.body.header_color;
    const banner_link = req.body.banner_link;

    let foundDoc = await campaignCollection.findOne({
        '_id': ObjectId(id)
    });
    foundDoc = UpdateCampaign(foundDoc, cnpj, start_date, end_date, open_time, close_time, country, state, city, address, coordinates, phone, creation_date, num_doners, campaign_rating, observation, blood_types, header_color, banner_link);

    campaignCollection.updateOne(
        {'_id': ObjectId(id)},
        {$set: foundDoc}
    );

    context.res = {
        body: {status: "updated"},
        headers: header
    }
}