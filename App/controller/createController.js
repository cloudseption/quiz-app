class CreateController {
  constructor() {}

  jsButtonAction() {
    dataManager.setCurrentQuizType("JavaScript");
    createViewManager.enableButtons();
  }

  javaButtonAction() {
    dataManager.setCurrentQuizType("Java");
    createViewManager.enableButtons();
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
}

let createController = new CreateController();
