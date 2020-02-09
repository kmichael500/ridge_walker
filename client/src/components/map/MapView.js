
import React, { Component } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { logoutUser } from "../../actions/authActions";
import { Link } from "react-router-dom";

import L, { map, LayerGroup } from 'leaflet';
import { Map, TileLayer, Marker, Popup, WMSTileLayer, LayersControl, GeoJSON, CircleMarker} from 'react-leaflet';

import ReactLeafletSearch from "react-leaflet-search";
import $ from 'jquery';
import file from '../../assets/tcsv.js'

import MarkerClusterGroup from 'react-leaflet-markercluster/dist/react-leaflet-markercluster';
import 'react-leaflet-markercluster/dist/styles.min.css';

class MapView extends Component {

  onLogoutClick = e => {
    e.preventDefault();
    this.props.logoutUser();
  };

  constructor(props) {
    super(props);
    this.state = {
      currentPos: null,
    };
  }


  
  onEachFeature(feature, layer) {
		var popupContent = "<p>I started out as a GeoJSON " +
				feature.geometry.type + ", but now I'm a Leaflet vector!</p>";

		if (feature.properties && feature.properties.popupContent) {
			popupContent += feature.properties.popupContent;
		}

		layer.bindPopup(popupContent);
	}
  
  pointToLayer(feature, latlng) {
    console.log('--- Point to layer');
    console.log('feature: ', feature);
    console.log('latlng: ', latlng);
    return L.circleMarker(latlng, null); // Change marker to circle
  }
 
  render() {
    const { user } = this.props.auth;
    const Markers = 
    
    //39.74739, -105
    //const mapCenterLoc = [35.845600, -86.390300];
    console.log(file.bicycleRental);
      return (
          <Map
          className="map"
          center={[35.927, -84.264611111]}
          zoom={10}
          maxZoom = {18}
          doubleClickZoom={true}
          oncontextmenu={this.handleClick}
          >
          <TileLayer
            url="https://api.mapbox.com/styles/v1/mapbox/light-v9/tiles/{z}/{x}/{y}?access_token=pk.eyJ1IjoibWFwYm94IiwiYSI6ImNpejY4NXVycTA2emYycXBndHRqcmZ3N3gifQ.rJcFIG214AriISLbB6B5aw"
          />
          

        <MarkerClusterGroup>
            <GeoJSON
                data={file.caving}
                color='red'
                fillColor='green'
                weight={1}
                
                onEachFeature={function(feature, layer) {
                    var popupContent = "<p>" + "<b>" +
                    feature.properties.name + "</b><br>" + "Lat/Long: " + 
                    feature.geometry.coordinates[1] + ", " +
                    feature.geometry.coordinates[0] + "</p>";
                    
                    layer.bindPopup(popupContent)
                }}
                pointToLayer = {function(feature, latlng){
                    return L.circleMarker(latlng, null)
                    }}
            />
        </MarkerClusterGroup>
        </Map>
      );
  }
}

/*

<GeoJSON
                key={Math.random}
                data={bicycleRental}

                pointToLayer = {function(feature, latlng){
                return L.circleMarker(latlng, null)
                }}
                
            />
*/

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