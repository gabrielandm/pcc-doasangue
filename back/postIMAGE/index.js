const uuid = require('uuid');
const { BlobServiceClient } = require("@azure/storage-blob");

module.exports = async function (context, req) {
	const connStr = "DefaultEndpointsProtocol=https;AccountName=doasanguefiles;AccountKey=CCwuT+nXra5AxbTjt5M4UZCvqK7vqHU+wfd+NiY0DIPQCBk0sYUac1G6j6CA82/DHutN86FL/nr4+AStloCiSA==;EndpointSuffix=core.windows.net";
	const blobServiceClient = BlobServiceClient.fromConnectionString(connStr);
	
	let filename = uuid.v4().toString() + '.jpg';
	filename = 'dbce9fd4-f26f-4f14-81c1-c964b7af5d08.jpg';
	let rawImage = req.body.image;
	let matches = rawImage.match(/^data:([A-Za-z-+\/]+);base64,(.+)$/);
	let type = matches[1];
	console.log(type);
	let buffer = new Buffer(matches[2], 'base64');

	const containerClient = blobServiceClient.getContainerClient('doasangueblob');
	const blockBlobClient = containerClient.getBlockBlobClient(filename);
  const uploadBlobResponse = await blockBlobClient.upload(buffer, buffer.length);

	context.res = {
		// status: 200, /* Defaults to 200 */
		body: uploadBlobResponse
	};
}