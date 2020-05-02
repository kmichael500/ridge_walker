
import React, { Component } from "react";
import ReactDOMServer from 'react-dom/server';
import L, { map, LayerGroup, latLng } from 'leaflet';
import { Map, TileLayer, Marker, Popup, WMSTileLayer, LayersControl, GeoJSON, CircleMarker} from 'react-leaflet';

// search bar
import ReactLeafletSearch from "react-leaflet-search";

// tcs data in GeoJson format
// import file from '../../assets/tcsv.js'

// used to cluster points
// import MarkerClusterGroup from 'react-leaflet-markercluster/dist/react-leaflet-markercluster';
import MarkerClusterGroup from 'react-leaflet-markercluster';
import 'react-leaflet-markercluster/dist/styles.min.css';
import { Points, Feature } from "../pages/geoJsonInterface.js";
import 'leaflet/dist/leaflet.css';

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
    zoom: number,
    maxZoom: number
}

interface Props {
  data: Feature
}

class MapView extends Component<Props, State> {
  // map data
  constructor(props) {
    super(props);
    this.state = {
      currentPos: null,  // used for right clicking points
      center: [35.845600, -86.390300], // starting map loc
      zoom: 10,
      maxZoom: 18
    };
    // used for right click event
    this.handleRightClick = this.handleRightClick.bind(this);
  }

  // handles right clicks
  handleRightClick(e){
    this.setState({ currentPos: e.latlng });
  }

  // renders geoJSON data
  getGeoJSONComponent() {
    return(
        <GeoJSON
            data={this.props.data}
            color='red'
            fillColor='green'
            weight={1}
            onEachFeature={this.onEachFeature} 
            pointToLayer={this.pointToLayer}/>
    );
  }

  // information to display for a point
  onEachFeature(feature: Feature, layer) {
    if (feature.properties && feature.properties.name) {
      const latLong = feature.geometry.coordinates[0] + ", " + feature.geometry.coordinates[1];
      let popupContent = JSON.stringify(feature.properties, null, 2)
      popupContent = popupContent.replace(/["{}]/g, "").replace(/:( )*/g, ": ")
      popupContent = ReactDOMServer.renderToStaticMarkup(
        <div>
          <h3
            style={{textAlign:"center", fontWeight:"bold"}}>
            {feature.properties.name}
          </h3>
          <h4
            style={{textAlign:"center", fontWeight:550}}>
            {feature.properties.tcsnumber}
          </h4>
          <p
            style={{textAlign:"center"}}
            >{latLong}
          </p>
          <pre>{popupContent}</pre>
        </div>
      )
      layer.bindPopup(popupContent);
    }
  }


  // icon shown on map
  pointToLayer(feature, latlng){
    const icon = L.icon({
      iconUrl: 'https://api.iconify.design/mdi-map-marker.svg?height=25',
      popupAnchor: [15,0] // centers popup over point
      // shadowUrl: 'http://leafletjs.com/examples/custom-icons/leaf-shadow.png'
    })
    return L.marker(latlng, {icon})
    // L.marker(latlng, {icon})              
  }

  // map layers
  renderLayers(){
    return(
      <LayersControl position="topright">
            <LayersControl.BaseLayer name="Open Street Maps" checked={true}>
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
    )
  }

  
 
  render() {
    console.log("LEAF")
    return (
        <Map
          style={{height:"100vh"}}
          center={this.state.center}
          zoom={this.state.zoom}
          maxZoom = {this.state.maxZoom}
          doubleClickZoom={true}
          oncontextmenu={this.handleRightClick} //event lister for right click
          
        >
          {/* USGS Lidar and OSM Layers that you can toggle */}
          {this.renderLayers()}

        {/* right click to get point */}
        {this.state.currentPos &&
          <MyMarker position={this.state.currentPos}>
            <Popup position={this.state.currentPos}>
              Current location: <pre>{JSON.stringify(this.state.currentPos, null, 2)}</pre>
            </Popup>
          </MyMarker>
        }

        {/* // Clusters points */}
        <MarkerClusterGroup>
            {this.getGeoJSONComponent()}
        </MarkerClusterGroup>

        {/* search box */}
        <ReactLeafletSearch
            position="topleft"
            inputPlaceholder="Enter a place"
            // search={[]} // Setting this to [lat, lng] gives initial search input to the component and map flies to that coordinates, its like search from props not from user
            zoom={15} // Default value is 10
            showMarker={true}
            showPopup={false}
            openSearchOnLoad={false} // By default there's a search icon which opens the input when clicked. Setting this to true opens the search by default.
            closeResultsOnClick={false} // By default, the search results remain when you click on one, and the map flies to the location of the result. But you might want to save space on your map by closing the results when one is clicked. The results are shown again (without another search) when focus is returned to the search input.
            // providerOptions={{searchBounds: []}} // The BingMap and OpenStreetMap providers both accept bounding coordinates in [se,nw] format. Note that in the case of OpenStreetMap, this only weights the results and doesn't exclude things out of bounds.
            // customProvider={undefined | {search: (searchString)=> {}}} // see examples to usage details until docs are ready
          />
      </Map>
    );
  }
}


export {MapView}