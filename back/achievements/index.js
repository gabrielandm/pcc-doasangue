const ObjectId = require('mongodb').ObjectId;
const { connectDB, header } = require("../functions/apiFunctions");

async function Post(context, req) {
    context.res = {
        status: 400,
        body: {
            status: "not able to create object via API"
        },
        headers: header
    };
}

async function Get(context, req) {
    /*
        idValue - Valor que será buscado na chave idName
        idName - Nome do valor que se deseja buscar (doner_id, corp_cnpj, campaign_id)
    */
    const collections = await connectDB(['Achievement']);
    const achievementCollection = collections[0];

    let foundDoc = await achievementCollection.find();
    foundDoc = await foundDoc.toArray();

    if (foundDoc !== null) {
        context.res = {
            status: 200,
            body: foundDoc,
            headers: header
        }
    } else {
        context.res = {
            status: 400,
            headers: header
        };
    }
}

async function Put(context, req) {
    context.res = {
        status: 400,
        body: {
            status: "not able to update object via API"
        },
        headers: header
    };
}

async function Delete(context, req) {
    context.res = {
        status: 400,
        body: {
            status: "not able to delete object via API"
        },
        headers: header
    };
}

async function Options(context, req) {
    context.res = {
        status: 204,
        headers: header
    };
}


module.exports = async function (context, req) {
    switch (req.method) {
        case "POST":
            await Post(context, req);
            break;
        case "GET":
            await Get(context, req);
            break;
        case "PUT":
            await Put(context, req);
            break;
        case "DELETE":
            await Delete(context, req);
            break;
        case "OPTIONS":
            await Options(context, req);
            break;
        default:
            context.res = {
                body: { status: "Method not allowed" },
                status: 400,
                headers: header
            };
            break;
    }
}