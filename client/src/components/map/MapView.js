import React, { Component } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { logoutUser } from "../../actions/authActions";
import { Link } from "react-router-dom";

import L from 'leaflet';
import { Map, TileLayer, Marker, Popup, WMSTileLayer, LayersControl, GeoJSON} from 'react-leaflet';
import leafGreen from '../../assets/leaf-green.png';
import leafRed from '../../assets/leaf-red.png';
import leafOrange from '../../assets/leaf-orange.png';
import leafShadow from '../../assets/leaf-shadow.png';

const MyMarker = props => {

  const initMarker = ref => {
    if (ref) {
      ref.leafletElement.openPopup()
    }
  }

  return <Marker ref={initMarker} {...props}/>
}

class MapView extends Component {


  
  onLogoutClick = e => {
    e.preventDefault();
    this.props.logoutUser();
  };

  constructor(props) {
    super(props);
    this.state = {
      currentPos: null
    };
    this.handleClick = this.handleClick.bind(this);
  }


  handleClick(e){
    this.setState({ currentPos: e.latlng });
  }

  



  render() {
    const { user } = this.props.auth;
    const mapCenterLoc = [35.849602, -86.368077];
    

    return (
        <Map
        className="map"
        center={mapCenterLoc}
        zoom={10}
        doubleClickZoom={true}
        oncontextmenu={this.handleClick}
        >
          <LayersControl position="topright">
            <LayersControl.BaseLayer name="Open Street Maps">
              <TileLayer
                attribution='&amp;copy <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              />
            </LayersControl.BaseLayer>
          <LayersControl.BaseLayer name="3DEP Elevation">
            <WMSTileLayer
              url="https://elevation.nationalmap.gov/arcgis/services/3DEPElevation/ImageServer/WMSServer?"
              layers="3DEPElevation:Hillshade Gray"
              opacity=".4"
            />
          </LayersControl.BaseLayer>
        </LayersControl>
        {this.state.currentPos && <MyMarker position={this.state.currentPos}>
            <Popup position={this.state.currentPos}>
              Current location: <pre>{JSON.stringify(this.state.currentPos, null, 2)}</pre>
            </Popup>
          </MyMarker>}
      </Map>
    );
  }
}

MapView.propTypes = {
  logoutUser: PropTypes.func.isRequired,
  auth: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
  auth: state.auth
});

export default connect(
  mapStateToProps,
  { logoutUser }
)(MapView);