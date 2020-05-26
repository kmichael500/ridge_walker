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
import { UserContextProvider } from "./context/userContext";
import { Dashboard} from './pages/Dashboard';
import { HomePage } from './pages/HomePage'
// Authentication
import { Register } from "./pages/Register";
import { LoginPage } from "./pages/Login";
import ProtectedRoute from "./components/ProtectedRoute";
import { UploadLeads } from "./components/UploadLeads";


function App() {
  return (
    <div className="App">
      <UserContextProvider>
      <Router>
          <div className="App">            
            <Switch>
              <NavBar>
                {/* Non Protected Routes */}
                <Route exact path="/register" component= {Register} />
                <Route exact path="/login" component= {LoginPage} />
                <Route exact path="/" component={HomePage}/>


                {/* Protected Routes */}
                <ProtectedRoute exact path="/upload" component = {uploadPoints} userType="Admin"/>
                <ProtectedRoute exact path="/upload/leads" component = {UploadLeads}/>
                <ProtectedRoute exact path="/dashboard" component = {Dashboard} />
                <ProtectedRoute exact path="/map/:lat?/:long?" component= {MapView} />
                <ProtectedRoute exact path="/points/" component= {CavePointTable} />
                <ProtectedRoute exact path="/points/:id" component= {CaveInfo} />
                <ProtectedRoute exact path="/add/points/" component= {AddCave} />
                <ProtectedRoute exact path="/review/points/" component= {ReviewPoint} userType="Admin" />
                <ProtectedRoute exact path="/review/points/:id" component= {ReviewCaveInfo} />
              </NavBar>
            </Switch>
          </div>
        </Router>
        </UserContextProvider>
    </div>
  );
}

export default App;
