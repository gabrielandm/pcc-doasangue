const { connectDB, header } = require("../functions/apiFunctions");

module.exports = async function (context, req) {
    const collections = await connectDB(['Campaign', 'Corp']);
    const campaignCollection = collections[0];
    // const corpCollection = collections[1]; // Needed for authentication of cnpj

    const cnpj = req.body.cnpj;
    const name = req.body.name;
    const start_date = req.body.start_date;
    const end_date = req.body.end_date;
    const open_time = req.body.open_time;
    const close_time = req.body.close_time;
    const country = req.body.country;
    const state = req.body.state;
    const city = req.body.city;
    const address = req.body.address;
    let coordinates = req.body.coordinates;
    const phone = req.body.phone;
    const creation_date = new Date();
    const num_doners = 0;
    const campaign_rating = 0;
    const observation = req.body.observation;
    const blood_types = req.body.blood_types;
    const header_color = req.body.header_color;
    const banner_link = req.body.banner_link;

    if (coordinates == undefined) {
        coordinates = { latitude: -22.907370, longitude: -47.062901 };
    }

    const createdDoc = await campaignCollection.insertOne({
        "cnpj": cnpj,
        "name": name,
        "start_date": start_date,
        "end_date": end_date,
        "open_time": open_time,
        "close_time": close_time,
        "country": country,
        "state": state,
        "city": city,
        "address": address,
        "coordinates": coordinates,
        "phone": phone,
        "creation_date": creation_date.toISOString(),
        "num_doners": num_doners,
        "campaign_rating": campaign_rating,
        "observation": observation,
        "blood_types": blood_types,
        "header_color": header_color,
        "banner_link": banner_link
    });

    context.res = {
        status: 201,
        body: { "status": "success", "id": createdDoc.insertedId },
        headers: header
    };
}