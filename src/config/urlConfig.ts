const serverBaseURL = process.env.REACT_APP_SERVER_BASE_URL
  ? process.env.REACT_APP_SERVER_BASE_URL
  : 'http://ridge-walker-server.azurewebsites.net/';
const siteBaseURL = 'http://192.168.0.105:3000/';

export {serverBaseURL, siteBaseURL};
