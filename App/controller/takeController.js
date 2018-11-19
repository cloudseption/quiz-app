class TakeController {
  constructor() {
    console.log("Constructing takeController");
  }
  signOutAction() {
    console.log("Signing out");
    inQuizite.signOut();
    alert("You have been signed out.");
    window.location = "../../index.html";
  }

  rowClickAction(rowElement) {
    takeViewManager.getQuestionsFromThisElement(rowElement);
  }
}

let takeController = new TakeController();
