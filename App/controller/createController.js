class CreateController {
  constructor() {}

  jsButtonAction() {
    dataManager.setCurrentQuizType("JavaScript");
  }

  javaButtonAction() {
    dataManager.setCurrentQuizType("Java");
  }
}

let createController = new CreateController();
