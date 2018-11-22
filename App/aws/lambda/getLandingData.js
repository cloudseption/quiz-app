var AWS = require("aws-sdk");
const dynamodb = new AWS.DynamoDB({ apiVersion: "2012-08-10" });
var params = {
  TableName: "QuizScores" /* required */
};

exports.handler = (event, context, callback) => {
  //constants for the response
  let iconPath =
    "http://inquizitive-images.s3-website-us-west-2.amazonaws.com/quiz-badge-24x24.png";
  let quizUrl =
    "http://inquizitive.s3-website-us-west-2.amazonaws.com/index.html";
  let landingEndpoint =
    "https://ziatyh0y7a.execute-api.us-west-2.amazonaws.com/1/user/landing-data/";
  let appName = "InQuizitive";
  let quizAppToken = "DXykInYFcz";

  //response JSON
  let responseObject = {};
  let landingData = [];

  let headerUser = event.headers.Userid;
  let headerAuthToken = event.headers.Authorization;

  console.log(event.headers);

  //sent request
  let requestObject = constructRequestObject(
    landingEndpoint,
    headerUser,
    quizAppToken
  );

  //scans db for all items
  dynamodb.scan(params, function(err, data) {
    if (err) console.log(err, err.stack);
    // an error occurred
    else console.log("DB Get Items Success"); // successful response

    let listOfData = [];
    let landingDataObject = constructLandingDataObject(
      appName,
      iconPath,
      listOfData,
      quizUrl
    );
    landingData.push(landingDataObject);
    //gets uniques
    let quizTypes = getUniqueQuizTypesForThisUser(data, headerUser);
    console.log("quizTypes: ", quizTypes);

    //construct badgeText for each quiz type
    quizTypes.forEach(function(qt) {
      let avg = getUserAverages(data.Items, headerUser, qt);
      let displayText = constructDisplayAverage(qt, avg);
      listOfData.push(displayText);
    });

    responseObject["request"] = requestObject;
    responseObject["landingData"] = landingData;
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

    const noUserResponse = {
      statusCode: 403,
      body: JSON.stringify("No User Error"),
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

    if (!validUser(getAllUniqueUsers(data), headerUser)) {
      response = noUserResponse;
    }

    callback(null, response);
  });
};

function constructDisplayAverage(qt, avg) {
  let text = qt + " Average: " + avg + "%";
  return text;
}

function getUserAverages(items, requestedUser, qt) {
  let sum = 0;
  let avg = 0;
  let count = 0;
  items.forEach(function(item) {
    if (item.quizTaker.S == requestedUser && item.quizType.S == qt) {
      sum += parseInt(item.score.N);
      count++;
    }
  });
  avg = sum / count;
  return Math.round(avg);
}

function validHeaderToken(headerToken) {
  //token verification
  let quizAppToken = "DXykInYFcz";
  if (headerToken == quizAppToken) {
    return true;
  }
  return false;
}

function constructRequestObject(receivedHref, receivedUserId, receivedToken) {
  let request = {
    href: receivedHref,
    userid: receivedUserId,
    token: receivedToken
  };
  return request;
}

function constructLandingDataObject(AppName, IconPath, ListOfData, QuizUrl) {
  //constructed response JSON object
  let landingDataObject = {};
  landingDataObject["name"] = AppName;
  landingDataObject["img-url"] = IconPath;
  landingDataObject["data"] = ListOfData;
  landingDataObject["link"] = QuizUrl;
  return landingDataObject;
}

function getUniqueQuizTypesForThisUser(data, user) {
  let quizTypes = [];
  data.Items.forEach(function(element) {
    if (user == element.quizTaker.S) {
      if (quizTypes.indexOf(element.quizType.S) === -1) {
        quizTypes.push(element.quizType.S);
      }
    }
  });
  return quizTypes;
}

function getAllUniqueUsers(data) {
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
