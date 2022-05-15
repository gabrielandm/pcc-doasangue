const { header } = require("../functions/apiFunctions");

module.exports = async function (context, req) {
    context.res = {
        status: 204,
        headers: header
    };
}