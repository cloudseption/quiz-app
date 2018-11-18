class DataManager {
  constructor() {
    console.log("Constructing dataManager");

    this.currentQuizType;
    this.jsQuizObject = {
      questions: [],
      answers: {}
    };
    this.userQuizScores = [
      {
        QuizType: "JavaScript",
        QuizCreator: "testuser@hotmail.com",
        Score: "100"
      },
      {
        QuizType: "JavaScript",
        QuizCreator: "testuser2@hotmail.com",
        Score: "90"
      }
    ];
    this.api = "https://ziatyh0y7a.execute-api.us-west-2.amazonaws.com/1";
  }

  setCurrentQuizType(qt) {
    this.currentQuizType = qt;
  }

  getCurrentQuizType() {
    return this.currentQuizType;
  }

  getUserScores() {
    return this.userQuizScores;
  }

  removeAllJavaScriptQuestions() {
    this.jsQuizObject.questions = [];
  }

  removeAllJavaScriptAnswers() {
    this.jsQuizObject.answers = {};
  }

  getUserScoresFromDB() {
    let scoreEndPoint = this.api + "/user/score/";
    let responseObject = [];
    $.ajax({
      type: "GET",
      url: scoreEndPoint,
      headers: { AppToken: "successToken", Userid: "jasonhuang16@hotmail.com" }
    }).then(function(data) {
      console.log("get success data: ", data);
      responseObject = data;
    });
    return responseObject;
  }
}

let dataManager = new DataManager();
