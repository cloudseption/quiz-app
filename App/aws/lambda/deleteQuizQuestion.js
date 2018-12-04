const AWS = require("aws-sdk");
const querystring = require("querystring");
const ddb = new AWS.DynamoDB();

exports.handler = (event, context, callback) => {
  console.log("Received event: ", event);
  let eventBody = querystring.parse(event.body);
  console.log("Received event body: ", eventBody);
  const questionReceived = event.question;
  console.log(questionReceived);
  ddb.deleteItem(
    {
      TableName: "QuizQuestions",
      Key: {
        question: {
          S: questionReceived
        }
      }
    },
    function(err, data) {
      if (err) {
        context.fail("FAIL:  Error deleting item from dynamodb - " + err);
      } else {
        console.log("DEBUG:  deleteItem worked. ");
        context.succeed(data);
      }
    }
  );
};
