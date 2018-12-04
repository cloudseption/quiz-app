var AWS = require("aws-sdk");
const querystring = require("querystring");
const ddb = new AWS.DynamoDB({ apiVersion: "2012-08-10" });
const ddbClient = new AWS.DynamoDB.DocumentClient();

async function updateQuizLeaderboard(UserId, receivedQuizType) {
  const USERID = UserId;
  const QUIZTYPE = receivedQuizType;

  let QuizScoresParams = {
    TableName: "QuizScores" /* required */
  };
  let QuizLeaderboardsParams = {
    TableName: "QuizLeaderboards",
    Keys: {
      userId: {
        S: USERID
      }
    }
  };

  try {
    // synchronously call each method and store resolved promises.
    let results1 = await ddb.scan(QuizScoresParams).promise();
    let avg = getUserAverages(results1.Items, USERID, QUIZTYPE);
    let tempNumberObject = { N: avg };
    QuizLeaderboardsParams.Keys[QUIZTYPE] = tempNumberObject;
    console.log(QuizLeaderboardsParams);
    let results2 = await ddbClient
      .update({
        TableName: "QuizLeaderboards",
        Key: {
          userId: USERID
        },
        UpdateExpression: "set #u = :t",
        ExpressionAttributeNames: {
          "#u": QUIZTYPE.toLowerCase()
        },
        ExpressionAttributeValues: {
          ":t": avg
        }
      })
      .promise();

    //console.log(JSON.stringify(results1));
    console.log(JSON.stringify(results2));
    console.log("average: ", avg);
  } catch (e) {
    console.error(e);
  }
}

exports.handler = (event, context, callback) => {
  console.log("Received event: ", event);
  let eventBody = querystring.parse(event.body);
  console.log("Received event body: ", eventBody);
  const userId = eventBody.userId;
  const receivedQuizType = eventBody.QuizType;
  //TEST FROM BODY
  // const userId = event.userId;
  // const receivedQuizType = event.QuizType;

  console.log("Received Type: ", receivedQuizType);
  console.log("Received UserID: ", userId);
  updateQuizLeaderboard(userId, receivedQuizType);
  // TODO implement
  let responseObject = {};
  let response;

  const successResponse = {
    statusCode: 200,
    body: JSON.stringify(responseObject),
    headers: {
      "Access-Control-Allow-Origin": "*"
    }
  };

  const errorResponse = {
    statusCode: 401,
    body: JSON.stringify("Token Error"),
    headers: {
      "Access-Control-Allow-Origin": "*"
    }
  };

  return response;
};

function getUserAverages(items, user, qt) {
  let sum = 0;
  let avg = 0;
  let count = 0;
  console.log("User: ", user);
  console.log("QuizType:", qt);
  items.forEach(function(item) {
    if (item.quizTaker.S == user && item.quizType.S == qt) {
      sum += parseInt(item.score.N);
      count++;
    }
  });
  avg = sum / count;
  return avg;
}

function validHeaderToken(headerToken) {
  //token verification
  let quizAppToken = "DXykInYFcz";
  if (headerToken == quizAppToken) {
    return true;
  }
  return false;
}
