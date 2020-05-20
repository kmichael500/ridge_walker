import React from "react";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";

/* route imports */
import { UploadCSV } from './components/upload'
import { MapView } from "./components/MapView";
import  { NavBar } from './components/NavBar'
import { uploadPoints } from "./pages/uploadPoints"
import { CaveInfo } from "./pages/CaveInfo";
import { CavePointTable } from "./pages/CavePointTable";
import { AddCave } from "./pages/AddCave";
import { ReviewPoint } from "./pages/ReviewPoint";
import { ReviewCaveInfo } from "./pages/reviewCaveInfo";
import { UserContextProvider } from "./context/userContext"
// Authentication
import { Register } from "./pages/Register";
import { LoginPage } from "./pages/Login";
import ProtectedRoute from "./components/ProtectedRoute";


function App() {
  return (
    <div className="App">
      <UserContextProvider>
      <Router>
          <div className="App">
            {/* Protected Routes */}
            
            <Switch>
              {/* Non Protected Routes */}
              <NavBar>
              {/* <Route exact path="/upload" component={uploadPoints} /> */}
              <ProtectedRoute exact path="/upload" component = {uploadPoints} userType="Admin"/>
              <ProtectedRoute exact path="/map" component= {MapView} />
              <ProtectedRoute exact path="/points/" component= {CavePointTable} />
              <ProtectedRoute exact path="/points/:id" component= {CaveInfo} />
              <ProtectedRoute exact path="/add/points/" component= {AddCave} />
              <ProtectedRoute exact path="/review/points/" component= {ReviewPoint} />
              <ProtectedRoute exact path="/review/points/:id" component= {ReviewCaveInfo} />
              <Route exact path="/register" component= {Register} />
              <Route exact path="/login" component= {LoginPage} />
              </NavBar>
            </Switch>
          </div>
        </Router>
        </UserContextProvider>
    </div>
  );
}

export default App;
