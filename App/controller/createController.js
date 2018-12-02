class CreateController {
  constructor() {}

  jsButtonAction() {
    dataManager.setCurrentQuizType("JavaScript");
    createViewManager.changeCreateQuizHeader(dataManager.getCurrentQuizType());
    createViewManager.enableButtons();
    createViewManager.removeChildren($(questions));
    createViewManager.generateQuestionsFromLocalStorage();
  }

  javaButtonAction() {
    dataManager.setCurrentQuizType("Java");
    createViewManager.changeCreateQuizHeader(dataManager.getCurrentQuizType());
    console.log("java click", dataManager.getCurrentQuizType());
    createViewManager.enableButtons();
    createViewManager.removeChildren($(questions));
    createViewManager.generateQuestionsFromLocalStorage();
  }

  addButtonAction() {
    let question = "";
    let answers = ["", "", "", ""];
    createViewManager.generateQuestion(question, answers);
  }

  saveButtonAction(quizType) {
    //model
    dataManager.removeAllQuestions(quizType);
    dataManager.removeAllAnswers(quizType);
    dataManager.setQuestions(
      quizType,
      createViewManager.getQuestionsFromView()
    );
    dataManager.setAnswers(quizType, createViewManager.getAnswersFromView());
    dataManager.populateQuestionsTable();
  }

  signOutAction() {
    console.log("Signing out");
    inQuizite.signOut();
    alert("You have been signed out.");
    window.location = "../../index.html";
  }
}

let createController = new CreateController();
