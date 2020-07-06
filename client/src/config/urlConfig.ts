const serverBaseURL = process.env.REACT_APP_SERVER_BASE_URL
  ? process.env.REACT_APP_SERVER_BASE_URL
  : 'http://localhost:5000/';
const siteBaseURL = 'http://localhost:3000/';

export {serverBaseURL, siteBaseURL};
