var AWS = require("aws-sdk");
const dynamodb = new AWS.DynamoDB({ apiVersion: "2012-08-10" });
const querystring = require("querystring");
var params = {
  TableName: "QuizScores" /* required */
};

exports.handler = (event, context, callback) => {
  //path urls for the response
  let iconPath = "http://path/to/icon";
  let quizUrl = "http://url/to/quizapp";

  let eventBody = querystring.parse(event.body);
  //the parameters for retreiving the items in DB

  let headerToken = event.queryStringParameters.AppToken;
  let headerUser = event.queryStringParameters.Userid;
  console.log(headerUser);
  console.log(headerToken);
  //scans db for all items
  dynamodb.scan(params, function(err, data) {
    if (err) console.log(err, err.stack);
    // an error occurred
    else console.log("DB Get Items Success"); // successful response

    //gets unique users
    let usersList = getUniqueUsers(data);
    //constructed response JSON object
    let responseObject = constructResponseObject(headerUser, data.Items);

    // Response for callbacks
    let response;

    const successResponse = {
      statusCode: 200,
      body: JSON.stringify(responseObject),
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Credentials": "true",
        "Access-Control-Allow-Methods": "GET,HEAD,OPTIONS,POST,PUT",
        "Access-Control-Allow-Headers":
          "Access-Control-Allow-Headers, Origin,Accept, X-Requested-With, Content-Type, Access-Control-Request-Method, Access-Control-Request-Headers,AppToken,Userid"
      }
    };

    const errorResponse = {
      statusCode: 401,
      body: JSON.stringify("Token Error"),
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Credentials": "true",
        "Access-Control-Allow-Methods": "GET,HEAD,OPTIONS,POST,PUT",
        "Access-Control-Allow-Headers":
          "Access-Control-Allow-Headers, Origin,Accept, X-Requested-With, Content-Type, Access-Control-Request-Method, Access-Control-Request-Headers,AppToken,Userid"
      }
    };

    const noUserResponse = {
      statusCode: 403,
      body: JSON.stringify("No User Error"),
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Credentials": "true",
        "Access-Control-Allow-Methods": "GET,HEAD,OPTIONS,POST,PUT",
        "Access-Control-Allow-Headers":
          "Access-Control-Allow-Headers, Origin,Accept, X-Requested-With, Content-Type, Access-Control-Request-Method, Access-Control-Request-Headers,AppToken,Userid"
      }
    };

    if (validHeaderToken(headerToken)) {
      response = successResponse;
    } else {
      response = errorResponse;
    }

    if (!validUser(usersList, headerUser)) {
      response = noUserResponse;
    }

    console.log(response);
    callback(null, response);
  });
};

function validHeaderToken(headerToken) {
  //token that will be validated against
  let successToken = "DXykInYFcz";
  //token verification
  if (headerToken == successToken) {
    return true;
  }
  return false;
}

function constructResponseObject(user, items) {
  //constructed response JSON object
  let responseObject = [];
  let currentItem = {};
  items.forEach(function(element) {
    currentItem = {};
    if (element.quizTaker.S == user) {
      console.log("Element from db: ", element);
      currentItem["QuizType"] = element.quizType.S;
      currentItem["QuizCreator"] = element.quizCreator.S;
      currentItem["Score"] = element.score.N;
      responseObject.push(currentItem);
    }
  });
  return responseObject;
}

function getUniqueUsers(data) {
  //creates a list of every unique user in the table
  let usersList = [];
  data.Items.forEach(function(element) {
    if (usersList.indexOf(element.quizTaker.S) === -1) {
      usersList.push(element.quizTaker.S);
    }
  });
  return usersList;
}

function validUser(usersList, headerUser) {
  let valid = false;
  usersList.forEach(function(element) {
    console.log(headerUser, element);
    if (element == headerUser) {
      valid = true;
    }
  });
  console.log("User valid? ", valid);
  return valid;
}
