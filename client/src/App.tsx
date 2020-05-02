import React from "react";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";

/* route imports */
import { UploadCSV } from './pages/upload'
import { MapView } from "./components/MapView";
import { NavBar } from './components/NavBar'


function App() {
  return (
    <div className="App">
      <Router>
          <div className="App">
            {/* Protected Routes */}
            <NavBar></NavBar>
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
