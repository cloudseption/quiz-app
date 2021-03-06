class DataManager {
  constructor() {
    console.log("Constructing dataManager");
    this.api = "https://ziatyh0y7a.execute-api.us-west-2.amazonaws.com/1";
    this.user = window.sessionStorage.getItem("badgebook-user-id");
    this.userEmail = window.sessionStorage.getItem("badgebook-user-email");
    this.userName = window.sessionStorage.getItem("badgebook-user-name");
    this.currentQuizType;
    this.quizTypesList = ["JavaScript", "Java"];
    this.quizObject = {
      JavaScript: {
        questions: [],
        answers: {}
      },
      Java: {
        questions: [],
        answers: {}
      }
    };
    this.userQuizScores = {
      QuizType: "",
      QuizCreator: "",
      Score: 0
    };

    this.userObject = {
      score: 0
    };

    this.userScoreAverages = [];
  }

  populateQuestionsTable() {
    for (
      let i = 0;
      i < this.quizObject[this.currentQuizType].questions.length;
      i++
    ) {
      this.postQuestion(
        this.quizObject[this.currentQuizType].questions[i],
        this.quizObject[this.currentQuizType].answers[i],
        this.currentQuizType,
        this.userEmail
      );
    }
  }

  getAllUsersFromDB() {
    let url = this.api + "/users";

    $(document).ready(function() {
      console.log("DOM ready!");
      $.ajax({
        type: "GET",
        url: url,
        cache: false,
        success: function(data) {
          console.log("Get success");
        }
      })
        .done(data => {
          console.log(data);
          return data;
        })
        .then(data => {
          localStorage.setItem("users", JSON.stringify(data));
        });
      return false;
    });
  }

  getQuestionsFromDB() {
    let url = this.api + "/questions";

    $(document).ready(function() {
      console.log("DOM ready!");
      $.ajax({
        type: "GET",
        url: url,
        cache: false,
        success: function(data) {
          console.log("Get success");
        }
      })
        .done(data => {
          console.log(data);
          return data;
        })
        .then(data => {
          localStorage.setItem("storage", JSON.stringify(data));
        });
      return false;
    });
  }

  postCurrentQuizScore() {
    let urlScore = this.api + "/user/score";
    let urlLeaderboard = this.api + "/leaderboard";
    let currentUser = this.user;
    let quizType = this.userQuizScores["QuizType"];
    let quizCreator = this.userQuizScores["QuizCreator"];
    let score = Math.round(this.getUserScore() * 100);
    let quizId = Math.floor(Math.random() * 10000000);
    let quizTaker = this.getCurrentUser();

    console.log("Posting my score...", quizId, quizType, quizCreator, score);
    $(document).ready(function() {
      $.ajax({
        type: "POST",
        url: urlScore,
        data: {
          QuizID: quizId.toString(),
          QuizType: quizType,
          QuizCreator: quizCreator,
          Score: score,
          QuizTaker: quizTaker
        },
        success: function() {
          console.log("success posting score");
        }
      }).then(() => {
        $.ajax({
          type: "POST",
          url: urlLeaderboard,
          data: {
            userId: currentUser,
            QuizType: quizType
          },
          success: function() {
            console.log("success posting leaderboard");
          }
        });
      });
      return false;
    });
  }

  postQuestion(
    receivedQuestion,
    receivedAnswers,
    receivedQuizType,
    receivedUser
  ) {
    let url = this.api + "/questions";
    let question = receivedQuestion;
    let answers = receivedAnswers;
    let quizType = receivedQuizType;
    let user = receivedUser;
    console.log("Post Question", question, answers, quizType, user);
    $(document).ready(function() {
      $.ajax({
        type: "POST",
        url: url,
        data: {
          quizType: quizType,
          question: question,
          answer1: answers[0],
          answer2: answers[1],
          answer3: answers[2],
          answer4: answers[3],
          correct: answers[4],
          userId: user
        },
        success: function() {
          console.log("success posting");
        }
      }).then(data => {
        console.log("post questions", quizType);
        //localStorage.setItem("storage", JSON.stringify(data));
      });
      return false;
    });
  }

  postUser() {
    let url = this.api + "/user";
    let userId = this.user;
    let userEmail = this.userEmail;
    console.log("Post User", userId, userEmail);
    $(document).ready(function() {
      $.ajax({
        type: "POST",
        url: url,
        data: {
          userid: userId,
          email: userEmail
        },
        success: function() {
          console.log("success posting new user");
        }
      });
      return false;
    });
  }

  getUserScoresFromDB() {
    let scoreEndPoint = this.api + "/user/score/";
    let user = this.getCurrentUser();
    console.log("Sending User: ", user);
    $.ajax({
      type: "GET",
      url: scoreEndPoint,
      data: { AppToken: "DXykInYFcz", Userid: user },
      cache: false,
      statusCode: {
        403: function() {
          console.log("No scores! 403");
        }
      }
    })
      .then(data => {
        console.log("get success data: ", data);
        this.setUserScoreAverage(data);
      })
      .then(() => {
        console.log("sending scores: ", this.userScoreAverages);
        homeViewManager.generateScoresTable(this.userScoreAverages);
      });
  }

  getLocalStorageQuestions() {
    console.log(localStorage.getItem("storage"));
  }

  getCurrentUser() {
    return this.user;
  }

  getCurrentUserName() {
    return this.userName;
  }

  getCurrentUserEmail() {
    return this.userEmail;
  }

  getQuizTypes() {
    console.log(this.quizTypesList);
    return this.quizTypesList;
  }

  getUserScoreAverages() {
    return this.userScoreAverages;
  }

  getCurrentQuizType() {
    return this.currentQuizType;
  }

  getUserScores() {
    return this.userQuizScores;
  }

  getQuizObject() {
    return this.quizObject;
  }

  getUserScore() {
    return this.userObject.score;
  }

  setUserScoreAverage(data) {
    this.userScoreAverages = data;
    console.log("Setting user score averages", this.userScoreAverages);
  }

  setCurrentQuizCreatorForScores(rowElement) {
    let creator = rowElement.children[0].innerHTML;
    let quizType = rowElement.children[1].innerHTML;
    this.userQuizScores["QuizCreator"] = creator;
    this.userQuizScores["QuizType"] = quizType;
    this.userQuizScores["Scores"] = this.userObject["score"];
  }

  setUserScore(scoreInDecimal) {
    this.userObject.score = scoreInDecimal;
  }

  setCurrentQuizType(qt) {
    this.currentQuizType = qt;
  }

  setQuestions(quiztype, questionsList) {
    this.quizObject[quiztype].questions = questionsList;
    console.log(this.quizObject);
  }

  setAnswers(quiztype, answerObject) {
    this.quizObject[quiztype].answers = answerObject;
  }

  removeAllQuestions(quiztype) {
    this.quizObject[quiztype].questions = [];
  }

  removeAllAnswers(quiztype) {
    this.quizObject[quiztype].answers = {};
  }
}

let dataManager = new DataManager();

$(document).ready(function() {
  dataManager.getQuestionsFromDB();
});
