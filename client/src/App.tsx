import React from "react";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";

/* route imports */
import { UploadCSV } from './pages/upload'
import { MapView } from "./pages/MapView";


function App() {
  return (
    <div className="App">
      <Router>
          <div className="App">
            {/* Protected Routes */}
            <Switch>
              {/* Non Protected Routes */}
              <Route exact path="/upload" component={ UploadCSV } />
              <Route exact path="/map" component={ MapView } />
            </Switch>
          </div>
        </Router>
    </div>
  );
}

export default App;
