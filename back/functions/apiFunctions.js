const { MongoClient } = require("mongodb");
const { config } = require('../functions/config');

async function connectDB(collection_names) {
  /*
    Connect to the database
  */
    const client = new MongoClient(config['conn'], { useUnifiedTopology: true });
    await client.connect();
    const database = client.db(config['db']);
    const collections = []
    for (let i = 0; i < collection_names.length; i++) {
      collections.push(database.collection(collection_names[i]));
    }

    return collections;
}

const header = {
  'Access-Control-Allow-Credentials': 'false',
  'Access-Control-Allow-Origin': '*',
  'Content-Type': 'application/json',
  "Access-Control-Allow-Methods": "PUT, GET, POST, DELETE",
  "Access-Control-Allow-Headers": "*",
  "Access-Control-Max-Age": "86400"
}

function UpdateUser(list, email, pass, validated, name, last_name, phone, blood_type, last_donation, city, state, country, gender, birth_date) {
  if (email !== undefined) {
    list.email = email;
  }
  if (pass !== undefined) {
    list.pass = pass;
  }
  if (validated !== undefined) {
    list.validated = validated;
  }
  if (name !== undefined) {
    list.name = name;
  }
  if (last_name !== undefined) {
    list.last_name = last_name;
  }
  if (phone !== undefined) {
    list.phone = phone;
  }
  if (blood_type !== undefined) {
    list.blood_type = blood_type;
  }
  if (last_donation !== undefined) {
    list.last_donation = last_donation;
  }
  if (city !== undefined) {
    list.city = city;
  }
  if (state !== undefined) {
    list.state = state;
  }
  if (country !== undefined) {
    list.country = country;
  }
  if (gender !== undefined) {
    list.gender = gender;
  }
  if (birth_date !== undefined) {
    list.birth_date = birth_date;
  }

  return list;
}

function UpdateCorp(corp, cnpj, pass, name, country, city, address, coordinates, phone, email, state, entry_date, subscription_type, subscription_start, subscription_end) {
  if (cnpj !== undefined) {
    corp.cnpj = cnpj;
  }

  if (pass !== undefined) {
    corp.pass = pass;
  }

  if (name !== undefined) {
    corp.name = name;
  }

  if (country !== undefined) {
    corp.country = country;
  }

  if (city !== undefined) {
    corp.city = city;
  }

  if (address !== undefined) {
    corp.address = address;
  }

  if (coordinates !== undefined) {
    corp.coordinates = coordinates;
  }

  if (phone !== undefined) {
    corp.phone = phone;
  }

  if (email !== undefined) {
    corp.email = email;
  }

  if (state !== undefined) {
    corp.state = state;
  }

  if (entry_date !== undefined) {
    corp.entry_date = entry_date;
  }

  if (subscription_type !== undefined) {
    corp.subscription_type = subscription_type;
  }

  if (subscription_start !== undefined) {
    corp.subscription_start = subscription_start;
  }

  if (subscription_end !== undefined) {
    corp.subscription_end = subscription_end;
  }

  return corp;
}

function UpdateCampaign(foundDoc, cnpj, start_date, end_date, open_time, close_time, country, state, city, address, coordinates, phone, creation_date, num_doners, campaign_rating, observation, blood_types, header_color, banner_link) {
  if (cnpj !== undefined) {
    foundDoc.cnpj = cnpj;
  }

  if (start_date !== undefined) {
    foundDoc.start_date = start_date;
  }

  if (end_date !== undefined) {
    foundDoc.end_date = end_date;
  }

  if (open_time !== undefined) {
    foundDoc.open_time = open_time;
  }

  if (close_time !== undefined) {
    foundDoc.close_time = close_time;
  }

  if (country !== undefined) {
    foundDoc.country = country;
  }

  if (state !== undefined) {
    foundDoc.state = state;
  }

  if (city !== undefined) {
    foundDoc.city = city;
  }

  if (address !== undefined) {
    foundDoc.address = address;
  }

  if (coordinates !== undefined) {
    foundDoc.coordinates = coordinates;
  }

  if (phone !== undefined) {
    foundDoc.phone = phone;
  }

  if (creation_date !== undefined) {
    foundDoc.creation_date = creation_date;
  }

  if (num_doners !== undefined) {
    foundDoc.num_doners = num_doners;
  }

  if (campaign_rating !== undefined) {
    foundDoc.campaign_rating = campaign_rating;
  }

  if (observation !== undefined) {
    foundDoc.observation = observation;
  }

  if (blood_types !== undefined) {
    foundDoc.blood_types = blood_types;
  }

  if (header_color !== undefined) {
    foundDoc.header_color = header_color;
  }

  if (banner_link !== undefined) {
    foundDoc.banner_link = banner_link;
  }

  return foundDoc;
}

function UpdateDonationDate(res, doner_email, corp_cnpj, campaign_code, ammount_date, donation_date) {
  if (doner_email !== undefined) {
    res.doner_email = doner_email;
  }

  if (corp_cnpj !== undefined) {
    res.corp_cnpj = corp_cnpj;
  }

  if (campaign_code !== undefined) {
    res.campaign_code = campaign_code;
  }

  if (ammount_date !== undefined) {
    res.ammount_date = ammount_date;
  }

  if (donation_date !== undefined) {
    res.donation_date = donation_date;
  }

  return res;
}

module.exports = { connectDB, UpdateUser, UpdateCorp, UpdateCampaign, UpdateDonationDate, header };
