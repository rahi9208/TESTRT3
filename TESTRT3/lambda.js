let AWS = require('aws-sdk');
const s3 = new AWS.S3();
const ddb = new AWS.DynamoDB.DocumentClient();
let validateJS = require("validate.js");
exports.handler = function (event, context, callback) {

	let validation = validateJS(event, {
		itemCode: { presence: true }
	});

	if (validation) {
		callback(JSON.stringify(validation), null);
		return;
	}

	let image = Buffer.from(event.itemImage, "base64");
	let objectKey = event.itemCode + ".jpg";

	ddb.put({
		TableName: 'TestRT3',
		Item: { 'itemCode': event.itemCode, 'itemName': event.itemName, 'itemPrice': event.itemPrice, 'itemType': event.itemType }
	}, function (err, data) {
		s3.putObject({
			"Body": image,
			"Bucket": "mybucketx.demo",
			"Key": objectKey,
			"ACL": "public-read",
			"ContentType": "image/jpeg"
		})
			.promise()
			.then(data => {
				callback(null, "Successfully persisted");
			})
			.catch(err => {
				callback(err, null);
			});

	});



}