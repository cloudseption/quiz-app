class HomeController {
  constructor() {
    console.log("Constructing HomeController");
    let dataManager = new DataManager();
    let homeViewManager = new HomeViewManager(dataManager.getUserScores());
  }
}

$(document).ready(function() {
  let homeController = new HomeController();
});
