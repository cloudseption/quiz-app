class TakeController {
  constructor() {
    console.log("Constructing takeController");
  }

  submitAnswers() {
    console.log("Submit!");
    if (takeViewManager.checkCount()) {
      this.checkUserAnswers(takeViewManager.getUserAnswers());
      takeViewManager.setModalScore();
      takeViewManager.setScoreInModal(dataManager.getUserScore());
      dataManager.postCurrentQuizScore();
    } else {
      takeViewManager.setModalError();
    }
  }

  signOutAction() {
    console.log("Signing out");
    inQuizite.signOut();
    alert("You have been signed out.");
    window.location = "../../index.html";
  }

  rowClickAction(rowElement) {
    dataManager.setCurrentQuizCreatorForScores(rowElement);
    takeViewManager.getQuestionsFromThisElement(rowElement);
  }

  checkUserAnswers(answers) {
    let userAnswers = answers;
    let questionsCountVisible = $("#questions").children().length;
    let ids = takeViewManager.getQuestionIdFromView();
    let correctCount = 0;
    let storage;
    let correct;
    let tempid;
    let myQuestion;
    storage = JSON.parse(localStorage.getItem("storage"));

    for (let j = 0; j < userAnswers.length; j++) {
      tempid = "#q_" + j + "text";
      myQuestion = $(tempid).html();
      storage.questions.forEach(q => {
        if (myQuestion == q.question) {
          correct = q.correct;
        }
      });

      console.log(correct);
      if (userAnswers[j] != correct) {
        takeViewManager.renderAnswerWrong(ids[j], userAnswers[j], correct);
      } else {
        takeViewManager.renderAnswerCorrect(ids[j], userAnswers[j]);
        correctCount = correctCount + 1;
      }
    }

    let scoreInDecimal = correctCount / questionsCountVisible;
    dataManager.setUserScore(scoreInDecimal);
  }
}

let takeController = new TakeController();
