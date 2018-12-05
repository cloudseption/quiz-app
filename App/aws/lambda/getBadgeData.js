var AWS = require("aws-sdk");
const dynamodb = new AWS.DynamoDB({ apiVersion: "2012-08-10" });
var params = {
  TableName: "QuizScores" /* required */
};

exports.handler = (event, context, callback) => {
  //const for the response
  let iconPath =
    "http://inquizitive-images.s3-website-us-west-2.amazonaws.com/quiz-badge-24x24.png";
  let quizUrl =
    "http://inquizitive.s3-website-us-west-2.amazonaws.com/index.html";
  let badgeEndpoint =
    "https://ziatyh0y7a.execute-api.us-west-2.amazonaws.com/1/user/badge/";
  let badgeid = "badgeId";
  let quizAppToken = "DXykInYFcz";

  let responseObject = {};
  let badgeData = [];

  let headerUser = event.headers.userid;
  let headerAuthToken = event.headers.Authorization;

  //let headerQuizType = event.headers.QuizType;
  let requestObject = constructRequestObject(
    badgeEndpoint,
    headerUser,
    quizAppToken
  );
  //scans db for all items
  dynamodb.scan(params, function(err, data) {
    if (err) console.log(err, err.stack);
    // an error occurred
    else console.log("DB Get Items Success"); // successful response

    //gets uniques
    let quizTypes = getUniqueQuizTypesForThisUser(data, headerUser);
    console.log("quizTypes: ", quizTypes);

    //construct badgeText for each quiz type
    quizTypes.forEach(function(qt) {
      let badgeidtext = badgeid + "_" + qt + "_" + headerUser;
      let usersList = getUniqueUsersForThisQuizType(data, qt);
      console.log("usersList: ", usersList);
      let topPercent = getUserAverages(usersList, data.Items, headerUser, qt);
      let badgeText = generateTextForBadge(topPercent, qt);
      let badgeObject = constructBadgeObject(
        iconPath,
        badgeText,
        quizUrl,
        badgeidtext
      );
      badgeData.push(badgeObject);
    });

    responseObject["request"] = requestObject;
    responseObject["badgeData"] = badgeData;
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
      statusCode: 401,
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

function generateTextForBadge(topPercent, quizType) {
  let text = quizType + ": " + "Top " + topPercent + "%";

  return text;
}

function getUserAverages(userList, items, requestedUser, qt) {
  let averages = [];
  let sum;
  let avg;
  let count;
  let requestedUserAverage;
  let result;
  userList.forEach(function(user) {
    avg = 0;
    sum = 0;
    count = 0;
    items.forEach(function(item) {
      if (item.quizTaker.S == user && item.quizType.S == qt) {
        sum += parseInt(item.score.N);
        count++;
      }
    });
    avg = sum / count;
    if (user == requestedUser) {
      requestedUserAverage = avg;
    }
    averages.push(avg);
  });
  averages = averages.sort(function(a, b) {
    return b - a;
  });
  let scoreIndex = averages.indexOf(requestedUserAverage);
  result = (100 / averages.length) * (scoreIndex + 1);
  return Math.floor(result);
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

function constructBadgeObject(iconPath, badgeText, quizUrl, badgeid) {
  //constructed response JSON object
  let badgeObject = {};
  badgeObject["icon-url"] = iconPath;
  badgeObject["text"] = badgeText;
  badgeObject["link"] = quizUrl;
  badgeObject["badgeid"] = badgeid;
  return badgeObject;
}

function getUniqueUsersForThisQuizType(data, quizType) {
  //creates a list of every unique user in the table
  let usersList = [];
  data.Items.forEach(function(element) {
    if (element.quizType.S == quizType) {
      if (usersList.indexOf(element.quizTaker.S) === -1) {
        usersList.push(element.quizTaker.S);
      }
    }
  });
  return usersList;
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
