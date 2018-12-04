const AWS = require("aws-sdk");
const querystring = require("querystring");
const ddb = new AWS.DynamoDB.DocumentClient();

exports.handler = (event, context, callback) => {
  console.log("Received event: ", event);
  let eventBody = querystring.parse(event.body);
  console.log("Received event body: ", eventBody);
  const Provider = "BadgeBook";
  const Email = eventBody.email;
  const UserID = eventBody.userid;

  postUserScore(UserID, Email, Provider).then(() => {
    // You can use the callback function to provide a return value from your Node.js
    // Lambda functions. The first parameter is used for failed invocations. The
    // second parameter specifies the result data of the invocation.

    // Because this Lambda function is called by an API Gateway proxy integration
    // the result object must use the following structure.
    callback(null, {
      statusCode: 201,
      body: JSON.stringify({
        userID: UserID,
        email: Email,
        provider: Provider
      }),
      headers: {
        "Access-Control-Allow-Origin": "*"
      }
    });
  });
};

function postUserScore(UserID, Email, Provider) {
  console.log("UserID", UserID);
  return ddb
    .put({
      TableName: "QuizUsers",
      Item: {
        userID: UserID,
        email: Email,
        provider: Provider
      }
    })
    .promise();
}
