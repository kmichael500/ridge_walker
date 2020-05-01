
import React, { Component } from "react";

import L, { map, LayerGroup } from 'leaflet';
import { Map, TileLayer, Marker, Popup, WMSTileLayer, LayersControl, GeoJSON, CircleMarker} from 'react-leaflet';

// search bar
import ReactLeafletSearch from "react-leaflet-search";

// tcs data in GeoJson format
// import file from '../../assets/tcsv.js'

// used to cluster points
// import MarkerClusterGroup from 'react-leaflet-markercluster/dist/react-leaflet-markercluster';
import MarkerClusterGroup from 'react-leaflet-markercluster';
import 'react-leaflet-markercluster/dist/styles.min.css';
import { Points } from "./geoJsonInterface.js";

// marker for adding points (right click)
const MyMarker = props => {

  const initMarker = ref => {
    if (ref) {
      ref.leafletElement.openPopup()
    }
  }

  return <Marker ref={initMarker} {...props}/>
}

interface State {
    currentPos: any,  // used for right clicking points
    center: any, // starting map loc
    data: Points,
    zoom: number,
    maxZoom: number
}

class MapView extends Component<any, State> {
  // map data
  constructor(props) {
    super(props);
    this.state = {
      currentPos: null,  // used for right clicking points
      center: [35.845600, -86.390300], // starting map loc
      data: {} as Points,
      zoom: 10,
      maxZoom: 18
    };
    // used for right click event
    this.handleClick = this.handleClick.bind(this);
  }

  // handles right clicks
  handleClick(e){
    this.setState({ currentPos: e.latlng });
  }
 
  render() {
    
    return (
        <Map
          className="map"
          center={this.state.center}
          zoom={this.state.zoom}
          maxZoom = {this.state.maxZoom}
          doubleClickZoom={true}
          oncontextmenu={this.handleClick} //event lister for right click
          
        >
          {/* USGS Lidar and OSM Layers that you can toggle */}
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
              opacity= {1}
            />
          </LayersControl.BaseLayer>
        </LayersControl>

        {/* right click to get point */}
        {this.state.currentPos && <MyMarker position={this.state.currentPos}>
            <Popup position={this.state.currentPos}>
              Current location: <pre>{JSON.stringify(this.state.currentPos, null, 2)}</pre>
            </Popup>
          </MyMarker>}

        {/* // Clusters points */}
        <MarkerClusterGroup>
            {/* loads tcs data in GeoJSON format */}
            <GeoJSON
                data={this.state.data.features}
                color='red'
                fillColor='green'
                weight={1}
                
                //  Popup w/ info for each point
                onEachFeature={function(feature, layer) {
                    var popupContent = "<p>" + "<b>" +
                    feature.properties.name + "</b><br>" + "Lat/Long: " + 
                    feature.geometry.coordinates[1] + ", " +
                    feature.geometry.coordinates[0] + "</p>";
                    
                    layer.bindPopup(popupContent)
                }}
                //  circle for each point
                pointToLayer = {function(feature, latlng){
                    return L.circleMarker(latlng, null)
                    }}
            />
        </MarkerClusterGroup>

        {/* search box */}
        <ReactLeafletSearch
            position="topleft"
            inputPlaceholder="Enter a place"
            search={[]} // Setting this to [lat, lng] gives initial search input to the component and map flies to that coordinates, its like search from props not from user
            zoom={15} // Default value is 10
            showMarker={true}
            showPopup={false}
            openSearchOnLoad={false} // By default there's a search icon which opens the input when clicked. Setting this to true opens the search by default.
            closeResultsOnClick={false} // By default, the search results remain when you click on one, and the map flies to the location of the result. But you might want to save space on your map by closing the results when one is clicked. The results are shown again (without another search) when focus is returned to the search input.
            providerOptions={{searchBounds: []}} // The BingMap and OpenStreetMap providers both accept bounding coordinates in [se,nw] format. Note that in the case of OpenStreetMap, this only weights the results and doesn't exclude things out of bounds.
            // customProvider={undefined | {search: (searchString)=> {}}} // see examples to usage details until docs are ready
          />
      </Map>
    );
  }
}


export {MapView}