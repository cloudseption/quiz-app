window._config = {
  cognito: {
    userPoolId: "us-west-2_FGZojdNFM", // e.g. us-east-2_uXboG5pAb
    userPoolClientId: "3525h1vedrp388ju74ldm2vegn", // e.g. 25ddkmj4v6hfsfvruhpfi7n4hv
    region: "us-west-2" // e.g. us-east-2
  },
  api: {
    invokeUrl: "https://ziatyh0y7a.execute-api.us-west-2.amazonaws.com/1/" // e.g. https://rc7nyt4tql.execute-api.us-west-2.amazonaws.com/prod',
  }
};

AWS.config = new AWS.Config();
AWS.config.credentials = _config.cognito;
AWS.config.update({ region: "us-west-2" });
