const ObjectId = require('mongodb').ObjectId;
const { connectDB, UpdateDonationDate, header } = require("../functions/apiFunctions");

module.exports = async function (context, req) {
    const collections = await connectDB(['DonationDate', 'Campaign', 'Doner', 'Corp']);
    const donationdateCollection = collections[0];
    // const campaignCollection = collections[1];
    // const donerCollection = collections[2];
    // const corpCollection = collections[3];

    const id = req.body.id;
    const doner_email = req.body.doner_email;
    const corp_cnpj = req.body.corp_cnpj;
    const campaign_code = req.body.campaign_code;
    const ammount_date = req.body.ammount;
    const donation_date = req.body.donation_date;
    const validated = req.body.validated;
    
    let res = await corpCollection.findOne({"_id": ObjectId(id)});
    res = UpdateDonationDate(res, doner_email, corp_cnpj, campaign_code, ammount_date, donation_date, validated);
    corpCollection.updateOne(
        {"_id": ObjectId(id)},
        {$set: res}
    );

    context.res = {
        body: {status: "updated"},
        headers: header
    };
}