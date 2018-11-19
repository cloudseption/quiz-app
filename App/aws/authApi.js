/*global inQuizite _config AmazonCognitoIdentity AWSCognito*/
let cognitoidentityserviceprovider = new AWS.CognitoIdentityServiceProvider({
  apiVersion: "2016-04-18"
});

var inQuizite = window.inQuizite || {};
(function requestScopeWrapper($) {
  var authToken;
  inQuizite.authToken
    .then(function setAuthToken(token) {
      if (token) {
        authToken = token;
      } else {
        console.log("no sign in redirecting to homepage");
        window.location.href = "../../index.html";
      }
    })
    .catch(function handleTokenError(error) {
      alert(error);
      window.location.href = "../../index.html";
    });

  // Register click handler for #request button
  $(function onDocReady() {
    console.log("doc ready");
    $("#signOut").click(function() {
      inQuizite.signOut();
      alert("You have been signed out.");
      window.location = "../../index.html";
    });

    if (!_config.api.invokeUrl) {
      alert("No api");
    }
  });
})(jQuery);
