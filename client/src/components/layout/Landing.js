import React, { Component } from "react";
import { Link } from "react-router-dom";

class Landing extends Component {
  render() {
    return (
      <div style={{ height: "75vh" }} className="container valign-wrapper">
        <div className="row">
          <div className="col s12 left-align">
            <h4>
              <b>Contribute</b> to a ridgewalking database so no one has to
              check the same place twice!
    
            </h4>
            <p className="flow-text grey-text text-darken-1">  
                      
              <ul>
                <li>Mark locations and areas that you have checked.</li>
                <li>Upload custom points.</li>
                <li>Overlay USGS hillshade elevation data.</li>
                <li>Overlay Open Street Maps.</li>
                <li>Search areas and points.</li>
              </ul>
            </p>
            <br />
            <div className="col s6">
              <Link
                to="/register"
                style={{
                  width: "140px",
                  borderRadius: "3px",
                  letterSpacing: "1.5px"
                }}
                className="btn btn-large waves-effect waves-light hoverable blue accent-3"
              >
                Register
              </Link>
              <Link
                to="/login"
                style={{
                  width: "140px",
                  borderRadius: "3px",
                  letterSpacing: "1.5px",
                  marginLeft: '30px'
                }}
                className="btn btn-large waves-effect waves-light hoverable blue accent-3"
              >
                Log In
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default Landing;