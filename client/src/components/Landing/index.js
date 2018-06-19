import React, { Component } from 'react';
import gql from 'graphql-tag';
import { graphql } from 'react-apollo';
import { BarLoader } from 'react-spinners';
import ReactMapboxGl, { Layer, Feature, Popup, Marker, ZoomControl } from 'react-mapbox-gl';
import Rodal from 'rodal';
import { FormGroup, FormControl, ControlLabel, ButtonGroup, Button } from 'react-bootstrap';
import * as TI from 'react-icons/lib/ti';
import 'rodal/lib/rodal.css';
import * as config from '../../stores/config';
import './app.css';

const Map = ReactMapboxGl({
  accessToken: config.MAPBOX_KEY,
});

class LandingPage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      data: null,
      center: [144.963169, -37.814251],
      visible: false,
      distance: null,
      value: '',
      filter: [],
      mapType: 'mapbox://styles/mapbox/streets-v9',
      target: [],
    };
    // state binding
    this.showPosition = this.showPosition.bind(this);
    this.show = this.show.bind(this);
    this.hide = this.hide.bind(this);
    this.haversine = this.haversine.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.dataStore = this.dataStore.bind(this);
    this.mapChanger = this.mapChanger.bind(this);
    this.mapMover = this.mapMover.bind(this);
  }

  componentDidMount() {
    this.getLocation();
  }

  getLocation() {
    // disabling next line due to eslint not understanding navigator.
    // eslint-disable-next-line
    if (navigator.geolocation) {
      // disabling next line due to eslint not understanding navigator.
      // eslint-disable-next-line
      navigator.geolocation.getCurrentPosition(this.showPosition);
    } else {
      return null;
    }
    return true;
  }

  showPosition(position) {
    const coordinates = [position.coords.longitude, position.coords.latitude];
    this.setState({ center: coordinates });
  }

  handleChange(e) {
    try {
      const splitValues = e.target.value.split(' ');

      this.setState({ filter: splitValues });
      this.setState({ value: e.target.value });

      if (e.target.value === '') {
        this.setState({ filter: [] });
      }
      if (this.state.filter[0].length < 1) {
        this.setState({ filter: [] });
      }

      this.dataStore();
      return null;
    } catch (error) {
      return null;
    }
  }

  show(value) {
    this.setState({ visible: true });
    this.setState({ data: value });
  }

  hide() {
    this.setState({ visible: false });
  }

  dataStore(dataObject) {
    let filteredWords = [''];
    try {
      const descriptionArray = dataObject.description.split(' ');
      const nameArray = dataObject.name.split(' ');
      const addressArray = dataObject.address.split(' ');
      const typeArray = dataObject.type.split(' ');

      // use ... over concat due to ES6 way.
      filteredWords = [
        ...filteredWords,
        ...descriptionArray,
        ...nameArray,
        ...addressArray,
        ...typeArray,
        ...[dataObject.propertyType],
      ];

      filteredWords = filteredWords.join('|').toLowerCase().split('|');
      return this.state.filter.every(item => filteredWords.indexOf(item.toLowerCase()) !== -1);
    } catch (error) {
      return false;
    }
  }

  mapMover(homeObject) {
    this.setState({ center: [homeObject.longitude, homeObject.latitude] });
  }

  mapChanger(type) {
    // I could do it much simply by using an Object with mapped data values.
    if (type === 'Light') {
      this.setState({ mapType: 'mapbox://styles/mapbox/light-v9' });
    }

    if (type === 'Dark') {
      this.setState({ mapType: 'mapbox://styles/mapbox/dark-v9' });
    }

    if (type === 'Streets') {
      this.setState({ mapType: 'mapbox://styles/mapbox/streets-v9' });
    }

    if (type === 'Satellite') {
      this.setState({ mapType: 'mapbox://styles/mapbox/satellite-v9' });
    }
  }

  haversine(targetCoordinates, data) {
    // haversine formula ACOS(SIN(Lat1)*SIN(Lat2) +COS(Lat1)*COS(Lat2)*COS(Lon2-Lon1)) *6371
    // this does not account for roads. Just straightline distance.

    const earthRadius = 6371;

    const userCoordinates = this.state.center;

    const userLat = userCoordinates[1];
    const userLong = userCoordinates[0];

    const targetLat = targetCoordinates[1];
    const targetLong = targetCoordinates[0];

    const deltaLat = (targetLat - userLat) * (Math.PI / 180);
    const deltaLong = (targetLong - userLong) * (Math.PI / 180);

    const sinDelta = Math.sin(deltaLat / 2) * Math.sin(deltaLat / 2);

    const cosDelta = Math.cos(userLat) *
      Math.cos(targetLat) * Math.sin(deltaLong / 2) *
      Math.sin(deltaLong / 2);

    const value = sinDelta + cosDelta;
    const calculate = 2 * Math.atan2(Math.sqrt(value), Math.sqrt(1 - value));

    const haversine = earthRadius * calculate;

    this.setState({ distance: haversine });

    this.show(data);
  }

  render() {
    // disabling next line due to proptype validation
    // eslint-disable-next-line
    if (this.props.data.loading) {
      return <div className="loader"> <BarLoader color="#7d82b5" />   </div>;
    }

    return (
      <div>

        <div className="search-bar">
          <form>
            <FormGroup
              controlId="formBasicText"
            >
              <ControlLabel>Filter Results</ControlLabel>
              <FormControl
                type="text"
                value={this.state.value}
                placeholder="Type Here!"
                onChange={this.handleChange}
              />
            </FormGroup>
          </form>
        </div>

        <div className="button-group">

          <ButtonGroup>
            <Button onClick={() => this.mapChanger('Light')}><TI.TiEyeOutline color="#63A29C" size={20} /></Button>
            <Button onClick={() => this.mapChanger('Dark')}><TI.TiEye color="#63A29C" size={20} /></Button>
            <Button onClick={() => this.mapChanger('Streets')}><TI.TiMap color="#63A29C" size={20} /></Button>
            <Button onClick={() => this.mapChanger('Satellite')}><TI.TiWorldOutline color="#63A29C" size={20} /></Button>
          </ButtonGroup>

        </div>

        <Rodal width={800} height={600} visible={this.state.visible} onClose={() => this.hide()}>
          {this.state.data !== null &&
            <div>
              <div> {this.state.data.name} </div>
              <div> Address: {this.state.data.address}</div>
              <div> Description: {this.state.data.description} </div>
              <div> Distance: {this.state.distance.toFixed(2)} KM </div>
            </div>
          }
        </Rodal>

        <Map
          // eslint-disable-next-line
          style={this.state.mapType}
          center={this.state.center}
          containerStyle={{
            height: '100vh',
            width: '100vw',
          }}
        >
          <Layer type="circle" id="marker" radius={400} fillColor="#f87362">

            {/* /* disabling next line due to proptype validation */}
            {/* eslint-disable-next-line */}
            {this.props.data.homes.map(k => (
              <Feature
                coordinates={[k.longitude, k.latitude]}
                key={k}
              />
              ))
            }
          </Layer>

          <Popup
            className="popup-marker-v1"
            coordinates={this.state.center}
            offset={{
              // eslint-disable-next-line
              'bottom-left': [12, -38], 'bottom': [0, -10], 'bottom-right': [-12, -38],
            }}
          >
            <div className="popup-marker-v1">
              You are Here!
            </div>
          </Popup>

          <Marker
            coordinates={this.state.center}
            anchor="bottom"
          >
            <img src="http://maps.google.com/mapfiles/ms/icons/red-dot.png" alt="marker" />
          </Marker>
          {this.state.filter.length === 0 &&
              this.props.data.homes.map(k =>
                (
                  <div>
                    <Popup
                      className="popup-marker-v1"
                      coordinates={[k.longitude, k.latitude]}
                      offset={{
                        // eslint-disable-next-line
                        'bottom-left': [12, -38], 'bottom': [0, -10], 'bottom-right': [-12, -38],
                      }}
                    >
                      <div className="popup-marker-v1">
                        {k.type}
                      </div>
                      <div className="popup-marker-v1">
                        Price: ${k.price}
                      </div>
                    </Popup>

                    <Marker
                      coordinates={[k.longitude, k.latitude]}
                      onClick={() => this.haversine(
                        [parseFloat(k.longitude), parseFloat(k.latitude)],
                        k,
                      )}
                      anchor="bottom"
                    >
                      <img src="http://maps.google.com/mapfiles/ms/icons/red-dot.png" alt="marker" />
                    </Marker>
                  </div>
              ))
            }

          {this.state.filter.length !== 0 &&
              this.props.data.homes.map(k => (
                <div>
                  {this.dataStore(k) &&
                    <Popup
                      className="popup-marker-v1"
                      coordinates={[k.longitude, k.latitude]}
                      offset={{
                        // eslint-disable-next-line
                        'bottom-left': [12, -38],  'bottom': [0, -10], 'bottom-right': [-12, -38]
                      }}
                    >
                      <div className="popup-marker-v1">Price: ${k.price}</div>
                    </Popup>
                  }

                  <Marker
                    coordinates={[k.longitude, k.latitude]}
                    onClick={() => this.haversine(
                      [parseFloat(k.longitude), parseFloat(k.latitude)],
                      k,
                    )}
                    anchor="bottom"
                  >
                    <img src="http://maps.google.com/mapfiles/ms/icons/red-dot.png" alt="marker" />
                  </Marker>
                </div>
              ))
            }

          <ZoomControl />
        </Map>
      </div>
    );
  }
}


const query = gql`
  {
    homes {
      type,
      name,
      address,
      latitude,
      longitude,
      description,
      propertyType,
      price,
    }
  }
`;

export default graphql(query)(LandingPage);
