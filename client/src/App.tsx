import React from "react";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";

/* route imports */
import { UploadCSV } from './pages/upload'


function App() {
  return (
    <div className="App">
      <Router>
          <div className="App">
            {/* Protected Routes */}
            <Switch>
              {/* Non Protected Routes */}
              <Route exact path="/upload" component={ UploadCSV } />
            </Switch>
          </div>
        </Router>
    </div>
  );
}

export default App;
