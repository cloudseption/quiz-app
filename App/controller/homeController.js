class HomeController {
  constructor() {
    console.log("Constructing homeController");
  }
  signOutAction() {
    console.log("Signing out");
    inQuizite.signOut();
    alert("You have been signed out.");
    window.location = "../../index.html";
  }
}

let homeController = new HomeController();
