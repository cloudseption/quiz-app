const AWS = require("aws-sdk");
const querystring = require("querystring");
const ddb = new AWS.DynamoDB.DocumentClient();

exports.handler = (event, context, callback) => {
  console.log("Received event: ", event);
  let eventBody = querystring.parse(event.body);
  console.log("Received event body: ", eventBody);
  const username = eventBody.userId;
  const quizType = eventBody.quizType;
  const question = eventBody.question;
  const answer1 = eventBody.answer1;
  const answer2 = eventBody.answer2;
  const answer3 = eventBody.answer3;
  const answer4 = eventBody.answer4;
  const correct = eventBody.correct;

  postQuizQuestion(
    username,
    question,
    answer1,
    answer2,
    answer3,
    answer4,
    correct,
    quizType
  ).then(() => {
    // You can use the callback function to provide a return value from your Node.js
    // Lambda functions. The first parameter is used for failed invocations. The
    // second parameter specifies the result data of the invocation.

    // Because this Lambda function is called by an API Gateway proxy integration
    // the result object must use the following structure.
    callback(null, {
      statusCode: 201,
      body: JSON.stringify({
        userId: username,
        question: question,
        answer1: answer1,
        answer2: answer2,
        answer3: answer3,
        answer4: answer4,
        correct: correct,
        quizType: quizType
      }),
      headers: {
        "Access-Control-Allow-Origin": "*"
      }
    });
  });
};

function postQuizQuestion(
  username,
  question,
  answer1,
  answer2,
  answer3,
  answer4,
  correct,
  quizType
) {
  return ddb
    .put({
      TableName: "QuizQuestions",
      Item: {
        userId: username,
        question: question,
        answer1: answer1,
        answer2: answer2,
        answer3: answer3,
        answer4: answer4,
        correct: correct,
        quizType: quizType
      }
    })
    .promise();
}
