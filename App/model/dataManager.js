class DataManager {
  constructor() {
    console.log("Constructing dataManager");

    this.user = "getUser()";
    this.currentQuizType;
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
        this.user
      );
    }
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
      });
      return false;
    });
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

  getCurrentQuizType() {
    return this.currentQuizType;
  }

  getUserScores() {
    return this.userQuizScores;
  }

  getQuizObject() {
    return this.quizObject;
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
