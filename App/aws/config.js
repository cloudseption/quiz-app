window._config = {
  cognito: {
    userPoolId: "us-west-2_rY2yMMLjo", // e.g. us-east-2_uXboG5pAb
    userPoolClientId: "1h2ei8rcjrl622egf30lp1ka0g", // e.g. 25ddkmj4v6hfsfvruhpfi7n4hv
    region: "us-west-2", // e.g. us-east-2
    accessKeyId: "AKIAIINF4K4EGDMHELYA",
    secretAccessKey: "5xY4QdJiwW0vveqQtaeDm9nlP7nWdvohy1ESfodP"
  },
  api: {
    invokeUrl: "https://ziatyh0y7a.execute-api.us-west-2.amazonaws.com/1/" // e.g. https://rc7nyt4tql.execute-api.us-west-2.amazonaws.com/prod',
  }
};

AWS.config = new AWS.Config();
AWS.config.credentials = _config.cognito;
AWS.config.update({ region: "us-west-2" });
