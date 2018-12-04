var AWS = require("aws-sdk");
const querystring = require("querystring");
const dynamodb = new AWS.DynamoDB({ apiVersion: "2012-08-10" });
var params = {
  TableName: "QuizLeaderboards" /* required */
};

exports.handler = (event, context, callback) => {
  //response JSON
  let responseObject = {};
  let data = [];
  let quizAppToken = "DXykInYFcz";
  let quizUrl =
    "http://inquizitive.s3-website-us-west-2.amazonaws.com/index.html";

  let eventBodyJson = JSON.parse(event.body);
  let headerAuthToken = event.headers.Authorization;
  let skill = eventBodyJson.skill;
  let percentile = parseInt(eventBodyJson.score);
  console.log("Received Skill: ", skill);
  console.log("Received Score: ", percentile);
  //let headerGrade = event.headers.grade;
  //let percentile = parseInt(headerGrade.substring(4,headerGrade.length - 1));

  console.log(event.headers);

  //sent request
  let requestObject = constructRequestObject(headerAuthToken, quizUrl);

  //scans db for all items
  dynamodb.scan(params, function(err, data) {
    if (err) console.log(err, err.stack);
    // an error occurred
    else console.log("DB Get Items Success"); // successful response

    let listOfUsersInPercentile = getUsersInPercentile(
      percentile,
      data.Items,
      skill
    );

    responseObject["request"] = requestObject;
    responseObject["data"] = listOfUsersInPercentile;

    console.log(JSON.stringify(responseObject));

    // Response for callbacks
    let response;

    const successResponse = {
      statusCode: 200,
      body: JSON.stringify(responseObject),
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Headers": "*",
        "Access-Control-Allow-Methods": "GET,HEAD,OPTIONS,POST,PUT"
      }
    };

    const errorResponse = {
      statusCode: 401,
      body: JSON.stringify("Token Error"),
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Headers": "*",
        "Access-Control-Allow-Methods": "GET,HEAD,OPTIONS,POST,PUT"
      }
    };

    if (validHeaderToken(headerAuthToken)) {
      response = successResponse;
    } else {
      response = errorResponse;
    }

    callback(null, response);
  });
};

function validHeaderToken(headerToken) {
  //token verification
  let quizAppToken = "DXykInYFcz";
  if (headerToken == quizAppToken) {
    return true;
  }
  return false;
}

function constructRequestObject(headerAuthToken, receivedHref) {
  let request = {
    token: headerAuthToken,
    href: receivedHref
  };
  return request;
}

function getUsersInPercentile(percentile, items, skill) {
  let usersJson = [];
  items.forEach(element => {
    if (element.hasOwnProperty(skill)) {
      let temp = {};
      temp["user"] = element.userId.S;
      temp["grade"] = element[skill].N;
      usersJson.push(temp);
    } else {
      return usersJson;
    }
  });

  usersJson.sort(function(a, b) {
    return b.grade - a.grade;
  });

  let topIndexes = Math.ceil(usersJson.length * (percentile / 100));
  let topUsers = [];
  console.log("usersJson:", usersJson);
  for (let i = 0; i <= topIndexes - 1; i++) {
    console.log("Index 0: ", usersJson[0].userId);
    topUsers.push(usersJson[i].user);
  }
  console.log(JSON.stringify(topUsers));
  return topUsers;
}
