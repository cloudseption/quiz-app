/*global inQuizite _config AmazonCognitoIdentity AWSCognito*/

var inQuizite = window.inQuizite || {};

(function scopeWrapper($) {
  //The index path in AWS s3 Bucket
  let signinUrl = "./App/index.html";

  let poolData = {
    UserPoolId: _config.cognito.userPoolId,
    ClientId: _config.cognito.userPoolClientId
  };

  let userPool;

  if (
    !(
      _config.cognito.userPoolId &&
      _config.cognito.userPoolClientId &&
      _config.cognito.region
    )
  ) {
    $("#noCognitoMessage").show();
    return;
  }

  userPool = new AmazonCognitoIdentity.CognitoUserPool(poolData);

  if (typeof AWSCognito !== "undefined") {
    AWSCognito.config.region = _config.cognito.region;
  }

  inQuizite.signOut = function signOut() {
    userPool.getCurrentUser().signOut();
  };

  inQuizite.authToken = new Promise(function fetchCurrentAuthToken(
    resolve,
    reject
  ) {
    let cognitoUser = userPool.getCurrentUser();

    if (cognitoUser) {
      inQuizite.email = cognitoUser.getUsername();
      cognitoUser.getSession(function sessionCallback(err, session) {
        if (err) {
          reject(err);
        } else if (!session.isValid()) {
          resolve(null);
        } else {
          resolve(session.getIdToken().getJwtToken());
        }
      });
    } else {
      resolve(null);
    }
  });

  /*
   * Cognito User Pool functions
   */

  let register = (email, password, onSuccess, onFailure) => {
    let dataEmail = {
      Name: "email",
      Value: email
    };
    let attributeEmail = new AmazonCognitoIdentity.CognitoUserAttribute(
      dataEmail
    );

    userPool.signUp(
      email,
      password,
      [attributeEmail],
      null,
      function signUpCallback(err, result) {
        if (!err) {
          onSuccess(result);
        } else {
          onFailure(err);
        }
      }
    );
  };

  let signin = (email, password, onSuccess, onFailure) => {
    let authenticationDetails = new AmazonCognitoIdentity.AuthenticationDetails(
      {
        Username: email,
        Password: password
      }
    );

    let cognitoUser = createCognitoUser(email);
    cognitoUser.authenticateUser(authenticationDetails, {
      onSuccess: onSuccess,
      onFailure: onFailure
    });
  };

  let verify = (email, code, onSuccess, onFailure) => {
    createCognitoUser(email).confirmRegistration(
      code,
      true,
      function confirmCallback(err, result) {
        if (!err) {
          onSuccess(result);
        } else {
          onFailure(err);
        }
      }
    );
  };

  let createCognitoUser = email => {
    return new AmazonCognitoIdentity.CognitoUser({
      Username: email,
      Pool: userPool
    });
  };

  /*
   *  Event Handlers
   */

  $(function onDocReady() {
    $("#signinForm").submit(handleSignin);
    $("#registrationForm").submit(handleRegister);
    $("#verifyForm").submit(handleVerify);
  });

  let handleSignin = event => {
    let email = $("#emailLogin").val();
    let password = $("#pwdLogin").val();
    event.preventDefault();
    signin(
      email,
      password,
      function signinSuccess() {
        window.location.href = "./App/home.html";
      },
      function signinError(err) {
        alert(err);
      }
    );
  };

  let handleRegister = event => {
    let email = $("#emailRegister").val();
    let password = $("#pwdRegister").val();
    let password2 = $("#pwdRegisterConfirm").val();

    let onSuccess = function registerSuccess(result) {
      let cognitoUser = result.user;
      console.log("user name is " + cognitoUser.getUsername());
      var confirmation =
        "Registration successful. Please check your email inbox or spam folder for your verification code.";
      if (confirmation) {
        $("#myModalVerify").modal("show");
      }
    };
    let onFailure = function registerFailure(err) {
      alert(err);
    };
    event.preventDefault();

    if (password === password2) {
      register(email, password, onSuccess, onFailure);
    } else {
      alert("Passwords do not match");
    }
  };

  let handleVerify = event => {
    let email = $("#emailVerify").val();
    let code = $("#verifyCode").val();
    event.preventDefault();
    verify(
      email,
      code,
      function verifySuccess(result) {
        console.log("call result: " + result);
        console.log("Successfully verified");
        alert(
          "Verification successful. You will now be redirected to the home page."
        );
        window.location.href = signinUrl;
      },
      function verifyError(err) {
        alert(err);
      }
    );
  };
})(jQuery);
