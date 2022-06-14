const { MongoClient } = require("mongodb");
const ObjectId = require('mongodb').ObjectId;
const { connectDB, saveBlob, deleteBlob, UpdateUser, header } = require("../functions/apiFunctions");

module.exports = async function (context, req) {
	const collections = await connectDB(['Doner']);
	const donerCollection = collections[0];

	const email = req.body.email;
	const pass = req.body.pass;
	const validated = req.body.validated;
	const name = req.body.name;
	const last_name = req.body.last_name;
	const phone = req.body.phone;
	const blood_type = req.body.blood_type;
	const last_donation = new Date(req.body.last_donation);
	const city = req.body.city;
	const state = req.body.state;
	const country = req.body.country;
	const gender = req.body.gender;
	const birth_date = new Date(req.body.birth_date);

	/* Image stuff */
	const profile_link = req.body.profile_link; // Null if doesn't exist
	const image_type = req.body.image_type;
	let fileName = undefined;
	if (typeof profile_link == 'string') {
		fileName = profile_link.split('/')[profile_link.split('/').length - 1];
	}
	const deleteImage = req.body.delete_image; // True if user want's to delete current image
	// Image
	const image = req.body.image;
	if (image != null && deleteImage === false) {
		blobResult = await saveBlob(image, fileName, image_type);
	} else if (deleteImage === true && fileName != null) {
		blovResult = await deleteBlob(fileName);
	}
	/* End of image stuff */

	const res = await donerCollection.find({ "email": email });
	let user = await res.toArray();
	user = user[0];
	result = UpdateUser(user, email, pass, validated, name, last_name, phone, blood_type, last_donation, city, state, country, gender, birth_date, blobResult.fileUrl);

	if (result.isValid == true) {
		await donerCollection.updateOne(
			{ "email": email },
			{ $set: result.user }
		);

		context.res = {
			body: {
				status: "updated",
			},
			headers: header
		};
	} else if (result.isValid == false) {
		context.res = {
			status: 400,
			headers: header
		};
	}
}