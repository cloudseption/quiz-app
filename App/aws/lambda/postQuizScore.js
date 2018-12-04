const AWS = require("aws-sdk");
const querystring = require("querystring");
const ddb = new AWS.DynamoDB.DocumentClient();

exports.handler = (event, context, callback) => {
  console.log("Received event: ", event);
  let eventBody = querystring.parse(event.body);
  console.log("Received event body: ", eventBody);
  const AppToken = "DXykInYFcz";
  const QuizID = eventBody.QuizID;
  const QuizType = eventBody.QuizType;
  const QuizCreator = eventBody.QuizCreator;
  const QuizTaker = eventBody.QuizTaker;
  const Score = parseInt(eventBody.Score);

  postUserScore(QuizID, AppToken, QuizCreator, QuizTaker, QuizType, Score).then(
    () => {
      // You can use the callback function to provide a return value from your Node.js
      // Lambda functions. The first parameter is used for failed invocations. The
      // second parameter specifies the result data of the invocation.

      // Because this Lambda function is called by an API Gateway proxy integration
      // the result object must use the following structure.
      callback(null, {
        statusCode: 201,
        body: JSON.stringify({
          quizID: QuizID,
          appToken: AppToken,
          quizCreator: QuizCreator,
          quizTaker: QuizTaker,
          quizType: QuizType,
          score: Score
        }),
        headers: {
          "Access-Control-Allow-Origin": "*"
        }
      });
    }
  );
};

function postUserScore(
  QuizID,
  AppToken,
  QuizCreator,
  QuizTaker,
  QuizType,
  Score
) {
  console.log("QuizID", QuizID);
  return ddb
    .put({
      TableName: "QuizScores",
      Item: {
        quizID: QuizID,
        appToken: AppToken,
        quizCreator: QuizCreator,
        quizTaker: QuizTaker,
        quizType: QuizType,
        score: Score
      }
    })
    .promise();
}
