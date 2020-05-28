
import React, { Component } from "react";
import ReactDOMServer from 'react-dom/server';
import L, { map, LayerGroup, latLng, Icon } from 'leaflet';
import Control from 'react-leaflet-control';
import { FullscreenOutlined } from '@ant-design/icons'
import { Row } from 'antd'
import { Map, TileLayer, Marker, Popup, WMSTileLayer, LayersControl, GeoJSON, CircleMarker} from 'react-leaflet';

import { getAllMasterPoints } from '../dataservice/getPoints'
import { getAllLeadPoints } from '../dataservice/leadPoints'
import { PointInfoPopup } from '../components/PointInfoPopup'


// search bar
import ReactLeafletSearch from "react-leaflet-search";
import ContainerDimensions from 'react-container-dimensions'


// tcs data in GeoJson format
// import file from '../../assets/tcsv.js'

// used to cluster points
// import MarkerClusterGroup from 'react-leaflet-markercluster/dist/react-leaflet-markercluster';
import MarkerClusterGroup from 'react-leaflet-markercluster';
import 'react-leaflet-markercluster/dist/styles.min.css';
import 'leaflet/dist/leaflet.css';
import { withRouter } from "react-router-dom";
import { Feature } from "../interfaces/geoJsonInterface";
import { LeadFeature } from "../interfaces/LeadPointInterface";
import { UserSlider } from "./userInfo/UserSlider";

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
    maxZoom: number,
    height: number,
    isLoading: boolean,
    isLeadsLoading: boolean
    data: Feature[],
    deadLeads: LeadFeature[],
    clickedFeature: Feature
    isFeatureClicked: boolean
    searchProvider: CustomOpenStreetMap
}

interface Props {
  data?: Feature,
  center?: number[],
  baseLayer?: number
  zoom?: number,
  showFullScreen?: boolean
  onCenterChange?: (center: number[])=>void
}

class MapView extends Component<Props, State> {
  provider = null;
  static defaultProps = {
    center: [35.859710, -86.361997],
    zoom: 7,
    showFullScreen: false
  } as Props

  // map data
  constructor(props) {
    super(props);
    this.state = {
      searchProvider: null,
      currentPos: null,  // used for right clicking points
      center: this.props.center, // starting map loc
      zoom: this.props.zoom,
      maxZoom: 18,
      height: null,
      isLoading: true,
      isLeadsLoading: true,
      data: {} as Feature[],
      deadLeads: undefined,
      clickedFeature: {} as Feature,
      isFeatureClicked: false
    };
    // used for right click event
    this.handleRightClick = this.handleRightClick.bind(this);
    this.onEachFeature = this.onEachFeature.bind(this);
  }

  static getPoints(){
    getAllMasterPoints().then((points)=>{
      return points;
    })
  }
  static getLeads(){
    getAllLeadPoints().then((points)=>{
      return points.map((value)=>(value.point));
    })
  }

  componentDidUpdate(prevProps, prevState, snapshot){
    if (this.state.zoom !== prevState.zoom) {
      // window.scrollTo(0, 0)
    }
  }

  // handles right clicks
  handleRightClick(e){
    this.setState({ currentPos: e.latlng });
  }

  // renders geoJSON data
  getGeoJSONComponent() {
    if(!this.state.isLoading){
    return(
        <GeoJSON
            key="cavepoints"
            data={this.state.data}
            color='red'
            fillColor='green'
            weight={3}
            onEachFeature={this.onEachFeature} 
            pointToLayer={this.pointToLayer}/>
            
    );
    }
  }
    // renders geoJSON data
    getLeadGeoJSON() {
      if(!this.state.isLeadsLoading){
      return(
          <GeoJSON
              key="leads"
              data={this.state.deadLeads}
              color='black'
              fillColor='black'
              weight={3}
              onEachFeature={this.onEachLeadFeature} 
              pointToLayer={this.leadPointToLayer}/>
              
      );
      }
    }

    // information to display for a point
  onEachLeadFeature(feature: LeadFeature, layer) {
    const popupOptions = {
        minWidth: 250,
        maxWidth: 500,
        className: "popup-classname"
    };
    const popupContent = ReactDOMServer.renderToString(
        <UserSlider userID={feature.properties.submitted_by}></UserSlider>
    );
    layer.bindPopup(popupContent, popupOptions);
  
  }

  // information to display for a point
  onEachFeature(feature: Feature, layer) {
      // const popupOptions = {
      //   minWidth: 250,
      //   maxWidth: 500,
      //   className: "popup-classname"
      // };

      const onClick = ()=>{
        // const that = this;
        
      }

      layer.on({
        click: ()=>{
          this.setState({isFeatureClicked: true, clickedFeature: feature})
        }
      });

      // const popupContentNode = <PointInfoPopup id={feature.properties.tcsnumber}></PointInfoPopup>;
      // const popupContentHtml = ReactDOMServer.renderToString(popupContentNode);
    
      // layer.bindPopup(popupContentHtml, popupOptions);
  }

  renderPopup(){
    return(
      <PointInfoPopup
        point={this.state.clickedFeature}
        onClick={()=>{
          this.setState({isFeatureClicked: false})
        }}
      ></PointInfoPopup>
    )
  }


  // icon shown on map
  pointToLayer(feature, latlng){
    const icon = L.icon({
      iconUrl: 'https://api.iconify.design/mdi-map-marker.svg?height=25',
      iconAnchor: [13,24]
      // popupAnchor: [30,10] // centers popup over point
      // shadowUrl: 'http://leafletjs.com/examples/custom-icons/leaf-shadow.png'
    })

    return L.marker(latlng, {icon})
    // L.marker(latlng, {icon})              
  }

  // icon shown on map
  leadPointToLayer(feature, latlng){
    const icon = L.icon({
      iconUrl: 'https://api.iconify.design/mdi:map-marker-alert.svg?color=%23f5222d&height=25',
      iconAnchor: [13,24]

      // popupAnchor: [15,0] // centers popup over point
      // shadowUrl: 'http://leafletjs.com/examples/custom-icons/leaf-shadow.png'
    })
    return L.marker(latlng, {icon})
    // L.marker(latlng, {icon})              
  }

  // map layers
  renderLayers(){
    return(
      <LayersControl position="topright">
          <LayersControl.BaseLayer name="Open Topo" checked={true}>
            <TileLayer
              maxZoom={25}
              attribution='&amp;copy <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
              url="https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png"
            />
          </LayersControl.BaseLayer>
          <LayersControl.BaseLayer name="3DEP Elevation">
            <WMSTileLayer
              url="https://elevation.nationalmap.gov/arcgis/services/3DEPElevation/ImageServer/WMSServer?"
              layers="3DEPElevation:Hillshade Gray"
              opacity= {1}
            />
          </LayersControl.BaseLayer>
          <LayersControl.BaseLayer name="Open Street Maps">
            <TileLayer
              attribution='&amp;copy <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
          </LayersControl.BaseLayer>
                  {/* // Clusters points */}
        <LayersControl.Overlay name="Cave Points" checked>
          <MarkerClusterGroup spiderfyOnMaxZoom={true}>
              {this.getGeoJSONComponent()}
          </MarkerClusterGroup>
        </LayersControl.Overlay>
        <LayersControl.Overlay name="Leads">
          <MarkerClusterGroup
            spiderfyOnMaxZoom={true}
          >
              {this.getLeadGeoJSON()}
          </MarkerClusterGroup>
        </LayersControl.Overlay>
      </LayersControl>
    )
  }


  updateDimensions() {
    const height = window.innerWidth >= 992 ? window.innerHeight : 400
    this.setState({ height: height })
  }
  componentWillMount() {
    this.updateDimensions()
  }
  componentDidMount() {
    window.addEventListener("resize", this.updateDimensions.bind(this))
    if(this.props.match != undefined && this.props.match.params.lat !== undefined && this.props.match.params.long !== undefined){
      this.setState({
        center: [this.props.match.params.lat, this.props.match.params.long],
        zoom:15
      })
    };
    if (this.props.data == undefined){
      getAllMasterPoints().then((requestedPoints)=>{
        this.setState({data: requestedPoints, isLoading: false})
        this.setState({searchProvider: new CustomOpenStreetMap(requestedPoints)})
        // this.provider = new CustomOpenStreetMap();
      })
    }
    else{
      this.setState({data:this.props.data, isLoading:false})
    }

    getAllLeadPoints().then((requestedLeads)=>{
      const leadPoints = requestedLeads.map((leads)=>{return(leads.point)})
      // console.log(leadPoints);
      this.setState({deadLeads: leadPoints, isLeadsLoading: false});
    })


    
  }
  componentWillUnmount() {
    window.removeEventListener("resize", this.updateDimensions.bind(this))
  }


  
 
  render() {
    return (
        <ContainerDimensions>
          { ({ width, height })=>
          <div>
        <Map
          style={{height:height}}
          center={this.state.center}
          zoom={this.state.zoom}
          maxZoom = {this.state.maxZoom}
          
          doubleClickZoom={true}
          oncontextmenu={this.handleRightClick} //event lister for right click
          // onViewportChange={(vp)=>{
          //   // window.scrollTo(0, 0);
          //   this.setState({center: vp.center, zoom: vp.zoom})

          //   if(this.props.onCenterChange){
          //     this.props.onCenterChange(vp.center);
          //   }
            
          // }}
        >
        
        {this.props.showFullScreen &&
        <Control position="topright">
            <Row style={{background:"white", padding: "5px", borderRadius:"5px", boxShadow:"0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19)"}} align="middle">
              <FullscreenOutlined style={{fontSize:"25px", color:"black"}}
                onClick={ () => {this.props.history.push("/map/"+this.state.center[0]+"/"+this.state.center[1])} }
              >
                Full Screen
          </FullscreenOutlined>
          </Row>
        </Control>
        }
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
        {this.state.isFeatureClicked &&
          <div>
            {this.renderPopup()}
          </div>
        }

       
        


        

        {/* search box */}
        {!this.state.isLoading &&
        <ReactLeafletSearch
            position="topleft"
            inputPlaceholder="Enter a place"
            // search={[]} // Setting this to [lat, lng] gives initial search input to the component and map flies to that coordinates, its like search from props not from user
            zoom={15} // Default value is 10
            showMarker={true}
            showPopup={true}
            openSearchOnLoad={false} // By default there's a search icon which opens the input when clicked. Setting this to true opens the search by default.
            closeResultsOnClick={true} // By default, the search results remain when you click on one, and the map flies to the location of the result. But you might want to save space on your map by closing the results when one is clicked. The results are shown again (without another search) when focus is returned to the search input.
            // providerOptions={{points: this.state.points}} // The BingMap and OpenStreetMap providers both accept bounding coordinates in [se,nw] format. Note that in the case of OpenStreetMap, this only weights the results and doesn't exclude things out of bounds.
            customProvider={new CustomOpenStreetMap(this.state.data)}
          />
        }
        </Map>
        
      
      </div>
      }
      </ContainerDimensions>
    );
  }
}

class CustomOpenStreetMap {
  url = null;
  bounds = null;
  points = null as Feature[];

  constructor(points: Feature[], options = { providerKey: null, searchBounds: [] } ) {
    this.points = points;
    let { providerKey, searchBounds} = options;
    //Bounds are expected to be a nested array of [[sw_lat, sw_lng],[ne_lat, ne_lng]].
    // We convert them into a string of 'x1,y1,x2,y2' which is the opposite way around from lat/lng - it's lng/lat
    let boundsUrlComponent = "";
    let regionUrlComponent = "";
    // if (searchBounds.length) {
    //   const reversed = searchBounds.map((el) => {return el.reverse()});
    //   this.bounds = [].concat([],...reversed).join(",");
    //   boundsUrlComponent = `&bounded=1&viewbox=${this.bounds}`;
    // }
    if ('region' in options) {
      regionUrlComponent = `&countrycodes=${options.region}`;
    }
    this.url = `https://nominatim.openstreetmap.org/search?format=json&addressdetails=1&polygon_svg=1&namedetails=1${boundsUrlComponent}${regionUrlComponent}&q=`;
  }

  async search(query) {
    let response = [];
    let filteredPoints = this.points.filter((point)=>{
      if (point.properties.name.toLowerCase().match(query.toLowerCase())){
        return(point)
      }
    })

    filteredPoints = filteredPoints.slice(0,10);

    response = filteredPoints.map((point)=>{
      console.log(point)
      return({
        display_name: point.properties.name,
        lat: point.geometry.coordinates[1],
        lon: point.geometry.coordinates[0]
      })
    });
    console.log("Points", response)
    response = [].concat(response, await fetch(this.url + query)
      .then(res => res.json()));

    return this.formatResponse(response)
  }

  formatResponse(response) {
    console.log(response);
    const resources = response;
    const count = response.length;
    const info = (count > 0) ? resources.map(e => {
      console.log(e);
      return(
        {
          // bounds: e.boundingbox.map(bound => Number(bound)),
          latitude: e.lat,
          longitude: e.lon,
          name: e.display_name,
        }
      )
    }) : 'Not Found';
    return {
      info: info,
      raw: response
    }
  }

}

const mapView = withRouter(MapView)

export {mapView as MapView}