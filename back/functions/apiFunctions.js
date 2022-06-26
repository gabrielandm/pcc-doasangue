/* MongoDB */
const { MongoClient } = require("mongodb");
const { config } = require('../functions/config');

/* Blob Storage */
const uuid = require('uuid');
const { BlobServiceClient } = require("@azure/storage-blob");

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

async function saveBlob(rawImage, fileName, imageType) {
  const connStr = "DefaultEndpointsProtocol=https;AccountName=doasanguefiles;AccountKey=CCwuT+nXra5AxbTjt5M4UZCvqK7vqHU+wfd+NiY0DIPQCBk0sYUac1G6j6CA82/DHutN86FL/nr4+AStloCiSA==;EndpointSuffix=core.windows.net";
  const blobServiceClient = BlobServiceClient.fromConnectionString(connStr);

  let oldImageType = ""
  // let matches = rawImage.match(/^data:([A-Za-z-+\/]+);base64,(.+)$/);
  // let type = matches[1];
  if (fileName === undefined) {
    fileName = uuid.v4().toString() + '.jpg';
    oldImageType = fileName.split('.')[fileName.split('.').length - 1]
    imageType = fileName.split('.')[fileName.split('.').length - 1]
  }
  let buffer = new Buffer(rawImage, 'base64');

  const containerClient = blobServiceClient.getContainerClient('doasangueblob');
  let blockBlobClient = containerClient.getBlockBlobClient(fileName);
  // Verify if the image has the same type
  if (imageType !== oldImageType) {
    // Delete old file
    await blockBlobClient.delete();
    // Set new filename
    fileName = uuid.v4().toString() + '.' + imageType;
    // Create new file
    blockBlobClient = containerClient.getBlockBlobClient(fileName);
  }

  const uploadBlobResponse = await blockBlobClient.upload(buffer, buffer.length);

  return {
    response: uploadBlobResponse,
    fileUrl: `https://doasanguefiles.blob.core.windows.net/doasangueblob/${fileName}`
  };
}

async function deleteBlob(fileName) {
  const connStr = "DefaultEndpointsProtocol=https;AccountName=doasanguefiles;AccountKey=CCwuT+nXra5AxbTjt5M4UZCvqK7vqHU+wfd+NiY0DIPQCBk0sYUac1G6j6CA82/DHutN86FL/nr4+AStloCiSA==;EndpointSuffix=core.windows.net";
  const blobServiceClient = BlobServiceClient.fromConnectionString(connStr);

  if (fileName === undefined) {
    fileName = uuid.v4().toString() + '.jpg';
  }

  const containerClient = blobServiceClient.getContainerClient('doasangueblob');
  const blockBlobClient = containerClient.getBlockBlobClient(fileName);
  const uploadBlobResponse = await blockBlobClient.delete();

  return {
    response: uploadBlobResponse,
    fileUrl: null,
  };
}

const header = {
  'Access-Control-Allow-Credentials': 'false',
  'Access-Control-Allow-Origin': '*',
  'Content-Type': 'application/json',
  "Access-Control-Allow-Methods": "PUT, GET, POST, DELETE",
  "Access-Control-Allow-Headers": "*",
  "Access-Control-Max-Age": "86400"
}

function UpdateUser(userData, email, pass, validated, name, last_name, phone, blood_type, last_donation, city, state, country, gender, birth_date, profile_link) {
  // Preparing data for validation
  userData = {
    ...userData,
    name: userData.name.replace(/\s+/g, ' ').trim(),
    last_name: userData.last_name.replace(/\s+/g, ' ').trim(),
    phone: userData.phone.replace(/\s+/g, ' ').trim(),
    country: userData.country.replace(/\s+/g, ' ').trim(),
    state: userData.state.replace(/\s+/g, ' ').trim(),
    city: userData.city.replace(/\s+/g, ' ').trim(),
    birth_date: new Date(userData.birth_date),
    last_donation: new Date(userData.last_donation),
    profile_link: userData.profile_link.replace(/\s+/g, ' ').trim(),
  }
  // Variable to check if some change was made
  const oldUserData = JSON.stringify(userData);
  // Validation check variable
  let isValid = true;
  // Email validation
  if (email !== undefined && isValid) { // Not yet changeable
    userData.email = email;
  }
  // Password validation ✔️
  if (pass !== undefined && isValid) {
    // Check if pass has 8 digits with numbers and special characters and upper case letters
    if (
      pass.length > 8 &&
      pass.match(/[0-9]/) &&
      pass.match(/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/) &&
      pass.match(/[A-Z]/)) {
      userData.pass = pass;
    } else {
      isValid = false;
    }
  }
  // Validated validation ✔️
  if (validated !== undefined && isValid) { // Not yet changeable
    // Check if validated is a boolean
    if (typeof validated === 'boolean') {
      userData.validated = validated;
    } else {
      isValid = false;
    }
  }
  // Name validation ✔️
  if (name !== undefined && isValid) {
    // Check if name has more than 2 letters and if has only letters or brazilian letters
    if (name.length > 2 && name.match(/^[a-zA-ZÀ-ÿ ]+$/)) {
      userData.name = name;
    } else {
      isValid = false;
    }
  }
  // Last name validation ✔️
  if (last_name !== undefined && isValid) {
    // Check if name has 1 or letters and if has only letters or brazilian letters
    if (last_name.length >= 1 && last_name.match(/^[a-zA-ZÀ-ÿ ]+$/)) {
      userData.last_name = last_name;
    } else {
      isValid = false;
    }
  }
  // Phone validation ✔️
  if (phone !== undefined && isValid) {
    // Check if has 10 or 11 digits and if has only numbers
    if ((phone.length === 10 || phone.length === 11) && phone.match(/^[0-9]+$/)) {
      userData.phone = phone;
    } else {
      isValid = false;
    }
  }
  // Blood type validation ✔️
  if (blood_type !== undefined && isValid) {
    // Check if blood type is one of the following: O+, O-, A+, A-, B+, B-, AB+, AB-
    if (blood_type.match(/^(O\+|O-|A\+|A-|B\+|B-|AB\+|AB-)$/)) {
      userData.blood_type = blood_type;
    } else {
      isValid = false;
    }
  }
  // Last donation validation ✔️
  if (last_donation !== undefined && isValid) {
    // If last_donation is not null and if birth_date is not null. check if is after birth_date
    if (last_donation !== null && userData.birth_date !== null) {
      if (last_donation > userData.birth_date) {
        userData.last_donation = last_donation;
      } else {
        isValid = false;
      }
      // if last_donation is Date
    } else if (last_donation instanceof Date && isValid) {
      userData.last_donation = last_donation;
    } else {
      isValid = false;
    }
  }
  // City validation
  if (city !== undefined && isValid) {
    userData.city = city;
  }
  // State validation
  if (state !== undefined && isValid) {
    userData.state = state;
  }
  // Country validation
  if (country !== undefined && isValid) { // Not yet changeable
    userData.country = country;
  }
  // Gender validation ✔️
  if (gender !== undefined && isValid) {
    // Check if gender is 0 or 1
    if (gender === 0 || gender === 1) {
      userData.gender = gender;
    } else {
      isValid = false;
    }
  }
  // Birth date validation ✔️
  if (birth_date !== undefined && isValid) {
    // Check if birth_date is instance of Date
    if (birth_date instanceof Date) {
      if (new Date() > birth_date) {
        userData.birth_date = birth_date;
      } else {
        isValid = false;
      }
    } else {
      isValid = false;
    }
  }
  // Profile link validation
  if (profile_link !== undefined && isValid) {
    // Check if profile_link is a syting or null
    if (profile_link === null || typeof profile_link === 'string') {
      userData.profile_link = profile_link;
    } else {
      isValid = false;
    }
  }
  // If no changes were made ✔️
  if (oldUserData === JSON.stringify(userData) && isValid) {
    isValid = false;
  }
  return { userData: userData, isValid: isValid };
}

function UpdateCorp(corpData, cnpj, pass, name, country, city, address, coordinates, phone, email, state, subscription_type, subscription_start, subscription_end, profile_link) {
  // Preparing data for validation
  corpData = {
    ...corpData,
    name: corpData.name.replace(/\s+/g, ' ').trim(),
    phone: corpData.phone.replace(/\s+/g, ' ').trim(),
    country: corpData.country.replace(/\s+/g, ' ').trim(),
    state: corpData.state.replace(/\s+/g, ' ').trim(),
    city: corpData.city.replace(/\s+/g, ' ').trim(),
    subscription_start: new Date(corpData.subscription_start),
    subscription_end: new Date(corpData.subscription_end),
    profile_link: corpData.profile_link.replace(/\s+/g, ' ').trim()
  }
  // Variable to check if some change was made
  const oldCorpData = JSON.stringify(corpData);
  // Validation check variable
  let isValid = true;
  let notValidData = '';
  // cnpj validation ✔️
  if (cnpj !== undefined && isValid) {
    // Check if cnpj follow cnpj rules
    if (cnpj.match(/^[0-9]{2}\.?[0-9]{3}\.?[0-9]{3}\/?[0-9]{4}\-?[0-9]{2}$/) || cnpj === '000') {
      corpData.cnpj = cnpj;
    } else {
      isValid = false;
      notValidData = 'cnpj';
    }
  }
  // Pass validation ✔️
  if (pass !== undefined && isValid) {
    // Check if pass has 8 digits with numbers and special characters and upper case letters
    if (
      pass.length > 8 &&
      pass.match(/[0-9]/) &&
      pass.match(/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/) &&
      pass.match(/[A-Z]/)) {
      userData.pass = pass;
    } else {
      isValid = false;
      notValidData = 'pass';
    }
  }
  // Name validation ✔️
  if (name !== undefined && isValid) {
    // Check if name has 3 or more letters and if has only letters or brazilian letters
    if (name.length >= 3 && name.match(/^[a-zA-ZÀ-ÿ ]+$/)) {
      corpData.name = name;
    } else {
      isValid = false;
      notValidData = 'name';
    }
  }
  // Country validation
  if (country !== undefined && isValid) { // Not yet changeable
    corpData.country = country;
  }
  // State validation
  if (state !== undefined && isValid) {
    corpData.state = state;
  }
  // City validation
  if (city !== undefined && isValid) {
    corpData.city = city;
  }
  // Address validation
  if (address !== undefined && isValid) {
    corpData.address = address;
  }
  // Coordinates validation ✔️
  if (coordinates !== undefined && isValid) {
    // Check if is an Array with 2 numbers inside
    if (Object.keys(coordinates).length === 2 && Object.values(coordinates).every(function(element) {return typeof element === 'number';})) {
      corpData.coordinates = coordinates;
    } else {
      isValid = false;
      notValidData = 'coordinates';
    }
  }
  // Phone validation ✔️
  if (phone !== undefined && isValid) {
    // Check if has 10 or 11 digits and if has only numbers
    if (phone.length === 10 || phone.length === 11 && phone.match(/^[0-9]+$/)) {
      corpData.phone = phone;
    } else {
      isValid = false;
      notValidData = 'phone';
    }
  }
  // Email validation
  if (email !== undefined && isValid) { // Not yet changeable
    corpData.email = email;
  }
  // Subscription type validation ✔️
  if (subscription_type !== undefined && isValid) {
    // Check if it's a number between 0 and 5
    /*
      0 = Free
      1 = Basic
      2 = Standard
      3 = Premium
      4 = Ultimate
      5 = Mousse
    */
    if (typeof subscription_type === 'number' && subscription_type >= 0 && subscription_type <= 5) {
      corpData.subscription_type = subscription_type;
    } else {
      isValid = false;
      notValidData = 'subscription_type';
    }
  }
  // Subscription start validation ✔️
  if (subscription_start !== undefined && isValid) {
    // Check if subscription_start is instance of Date
    if (subscription_start instanceof Date) {
      corpData.subscription_start = subscription_start;
    } else {
      isValid = false;
      notValidData = 'subscription_start';
    }
  }
  // Subscription end validation ✔️
  if (subscription_end !== undefined && isValid) {
    // Check if subscription_end is instance of Date
    if (subscription_end instanceof Date) {
      corpData.subscription_end = subscription_end;
    } else {
      isValid = false;
      notValidData = 'subscription_end';
    }
  }
  // Profile link validation ✔️
  if (profile_link !== undefined && isValid) {
    // Check if profile_link is a string or null
    if (profile_link === null || typeof profile_link === 'string') {
      corpData.profile_link = profile_link;
    } else {
      isValid = false;
      notValidData = 'profile_link';
    }
  }
  // If no changes were made ✔️
  if (oldCorpData === JSON.stringify(corpData) && isValid) {
    isValid = false;
    notValidData = 'oldCorpData';
  }

  return { corpData: corpData, isValid: isValid, notValidData: notValidData };
}

function UpdateCampaign(foundDoc, cnpj, start_date, end_date, open_time, close_time, country, state, city, address, coordinates, phone, creation_date, num_doners, campaign_rating, observation, blood_types, header_color, banner_link) {
  // Preparing data for validation
  foundDoc = {
    ...foundDoc,
    name: foundDoc.name.replace(/\s+/g, ' ').trim(),
    phone: foundDoc.phone.replace(/\s+/g, ' ').trim(),
    country: foundDoc.country.replace(/\s+/g, ' ').trim(),
    state: foundDoc.state.replace(/\s+/g, ' ').trim(),
    city: foundDoc.city.replace(/\s+/g, ' ').trim(),
    subscription_start: new Date(foundDoc.subscription_start),
    subscription_end: new Date(foundDoc.subscription_end),
    profile_link: foundDoc.profile_link.replace(/\s+/g, ' ').trim()
  }
  // Variable to check if some change was made
  const oldCampaignData = JSON.stringify(foundDoc);
  // Validation check variable
  let isValid = true;
  let notValidData = '';
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
  // If no changes were made ✔️
  if (oldCampaignData === JSON.stringify(foundDoc) && isValid) {
    isValid = false;
    notValidData = 'oldCampaignData';
  }

  return { corpData: corpData, isValid: isValid, notValidData: notValidData };
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

function getCampaignFilters(query) {
  let filters = {};
  for (key in query) {
    if (key !== 'no_filter') {
      filters[key] = query[key];
    }
  }
  return filters;
}

module.exports = { connectDB, saveBlob, deleteBlob, UpdateUser, UpdateCorp, UpdateCampaign, UpdateDonationDate, getCampaignFilters, header };
