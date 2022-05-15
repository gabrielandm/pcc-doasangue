const { connectDB, header } = require("../functions/apiFunctions");

module.exports = async function (context, req) {
    const collections = await connectDB(['DonationDate', 'Campaign', 'Doner', 'Corp']);
    const donationdateCollection = collections[0];
    // const campaignCollection = collections[1]; // For future validation
    // const donerCollection = collections[2]; // For future validation
    // const corpCollection = collections[3]; // For future validation

    const doner_email = req.body.doner_email;
    const corp_cnpj = req.body.corp_cnpj;
    const campaign_code = req.body.campaign_code;
    const ammount_date = req.body.ammount;
    const donation_date = req.body.donation_date;
    const validated = req.body.validated;

    const createdDoc = await donationdateCollection.insertOne({
        "doner_email": doner_email,
        "corp_cnpj": corp_cnpj,
        "campaign_code": campaign_code,
        "ammount_date": ammount_date,
        "donation_date": donation_date,
        "validated": validated
    });

    context.res = {
        status: 201,
        body: { "status": "success", "id": createdDoc.insertedId },
        headers: header
    };
}