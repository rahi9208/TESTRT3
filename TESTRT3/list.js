let AWS = require('aws-sdk');
const ddb = new AWS.DynamoDB.DocumentClient();
exports.handler = function (event, context, callback) {
	let response = {
		"isBase64Encoded": 1,
		"statusCode": 200,
		"headers": {
			"Access-Control-Allow-Origin": "*"
		},
		"body": "..."
	};

	let itemType = event.queryStringParameters.type;
	ddb.scan({
		TableName: 'TestRT3', ExpressionAttributeValues: { ':it': itemType }, FilterExpression: 'itemType = :it'
	}, function (err, data) {
		if (data.Items) {
			response.body = JSON.stringify(data.Items);
		} else {
			response.statusCode = 404;
		}
		callback(null, response);
	});


}
