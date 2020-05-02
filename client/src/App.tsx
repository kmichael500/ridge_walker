import React from "react";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";

/* route imports */
import { UploadCSV } from './components/upload'
import { MapView } from "./components/MapView";
import  { NavBar } from './components/NavBar'
import { uploadPoints } from "./pages/uploadPoints"


function App() {
  return (
    <div className="App">
      <Router>
          <div className="App">
            {/* Protected Routes */}
            
            <Switch>
              {/* Non Protected Routes */}
              <NavBar>
              <Route exact path="/upload" component={ uploadPoints } />
              <Route exact path="/map" component={ MapView } />
              </NavBar>
            </Switch>
          </div>
        </Router>
    </div>
  );
}

export default App;
