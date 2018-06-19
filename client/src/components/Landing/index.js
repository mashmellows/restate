// imports
import Rodal from 'rodal';
import 'rodal/lib/rodal.css';
import gql from 'graphql-tag';
import { graphql } from 'react-apollo';
import React, { Component } from 'react';
import * as TI from 'react-icons/lib/ti';
import { BarLoader } from 'react-spinners';
// import { withFirebase } from 'react-redux-firebase';
import ReactMapboxGl, { Layer, Feature, Popup, Marker, ZoomControl } from 'react-mapbox-gl';
import { FormGroup, FormControl, ControlLabel, ButtonGroup, Button } from 'react-bootstrap';

// css import
import './app.css';

// config import
import * as config from '../../stores/config';

// delcare MapboxGL Map using API_KEY
// key located in ../../stores/config.js
const Map = ReactMapboxGl({
  accessToken: config.MAPBOX_KEY,
});

class LandingPage extends Component {
  constructor(props) {
    super(props);
    // declaring states
    this.state = {
      data: null,
      center: [144.963169, -37.814251],
      visible: false,
      distance: null,
      value: '',
      filter: [],
      mapType: 'mapbox://styles/mapbox/streets-v9',
    };
    // state binding
    // binded here instead of function.bind() due to poor readability.
    this.showPosition = this.showPosition.bind(this);
    this.show = this.show.bind(this);
    this.hide = this.hide.bind(this);
    this.haversine = this.haversine.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.keywordFilter = this.keywordFilter.bind(this);
    this.mapChanger = this.mapChanger.bind(this);
  }

  componentDidMount() {
    this.getLocation();
  }

  /**
  * @description
  * getLocation()
  * invokes browser geolocation API to fetch user Longitude and Latitude
  * @param {null}
  * @return {true} = if able to fetch user long/lat using browser API
  * @return {false} = if unable to fetch user long/lat due to user saying NO or unsupported browser
  */

  getLocation() {
    // disabling next line due to eslint not understanding navigator.
    // eslint-disable-next-line
    if (navigator.geolocation) {
      // disabling next line due to eslint not understanding navigator.
      // eslint-disable-next-line
      navigator.geolocation.getCurrentPosition(this.showPosition);
    }
    return true;
  }

  /**
  * @description
  * showPosition()
  * this function gets the user long/lat and sets it as the component state
  * @param {position} = Object with User Longitude and Latitude.
  * @return {null}
  */

  showPosition(position) {
    const coordinates = [position.coords.longitude, position.coords.latitude];
    this.setState({ center: coordinates });
  }

  /**
  * @description
  * handleChange()
  * Use the dynamic values provided by the onChange function @react-bootstrap form.
  * Use the words/letters provided to filter the displayed data.
  * when data is received. It invokes the keywordFilter() function.
  * @param {userInput} = string value that contains every letter/word typed.
  * @return {null}
  */

  handleChange(userInput) {
    try {
      const splitValues = userInput.target.value.split(' ');

      this.setState({ filter: splitValues });
      this.setState({ value: userInput.target.value });

      if (userInput.target.value === '') {
        this.setState({ filter: [] });
      }
      if (this.state.filter[0].length < 1) {
        this.setState({ filter: [] });
      }

      this.keywordFilter();
      return null;
    } catch (error) {
      return null;
    }
  }

  /**
  * show()
  * @description
  * This function sets the component states for the @param value and visibile state.
  * this helps to open the Modals via Rodal.
  * @param {value} = Object that has all the data related to homes.
  */

  show(value) {
    this.setState({ visible: true });
    this.setState({ data: value });
  }

  /**
  * @description
  * hide()
  * This function is used to hide the modal upon closing.
  */

  hide() {
    this.setState({ visible: false });
  }

  /**
  * @description
  * keywordFilter()
  * This function takes the home object {dataObject} and splits all the values into a list.
  * It also checks to see if the current typed word is in the list of word.
  * If the word is in the list. It returns true.
  * @param {dataObject} = home object with all the home related data.
  * @return {true} = if word has indexed in the list.
  */

  keywordFilter(dataObject) {
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

      // Patching a mistake in the data submissions.
      // Sale should be Buy because Sale/Rent makes no sense.
      if (typeArray[0] === 'Sale') {
        filteredWords.push('Buy');
      }

      filteredWords = filteredWords.join('|').toLowerCase().split('|');
      return this.state.filter.every(item => filteredWords.indexOf(item.toLowerCase()) !== -1);
    } catch (error) {
      return false;
    }
  }

  /**
  * @description
  * mapChanger()
  * This changes the type of map that is displayed.
  * @param {type} = string value that has the type of map provided by react-bootstrap button
  */

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

  /**
  * @description
  * haversine()
  * Uses the haversine formula to calculate distance between your position and filtered homes.
  * Ref: https://en.wikipedia.org/wiki/Haversine_formula
  * @param {targetCoordinates} = array that contains the home position (lat/long)
  * @param {data} = Object with home related data.
  */

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
            <Button
              onClick={() => this.mapChanger('Light')}
              disabled={this.state.mapType === 'mapbox://styles/mapbox/light-v9'}
            >
              <TI.TiEyeOutline color="#63A29C" size={20} />
            </Button>
            <Button
              onClick={() => this.mapChanger('Dark')}
              disabled={this.state.mapType === 'mapbox://styles/mapbox/dark-v9'}
            >
              <TI.TiEye color="#63A29C" size={20} />
            </Button>
            <Button
              onClick={() => this.mapChanger('Streets')}
              disabled={this.state.mapType === 'mapbox://styles/mapbox/streets-v9'}
            >
              <TI.TiMap color="#63A29C" size={20} />
            </Button>
            <Button
              onClick={() => this.mapChanger('Satellite')}
              disabled={this.state.mapType === 'mapbox://styles/mapbox/satellite-v9'}
            >
              <TI.TiWorldOutline color="#63A29C" size={20} />
            </Button>
          </ButtonGroup>

        </div>

        <Rodal width={800} height={600} visible={this.state.visible} onClose={() => this.hide()}>
          {this.state.data !== null &&
            <div>
              <div> {this.state.data.name} </div>
              <div> Address: {this.state.data.address}</div>
              <div> Description: {this.state.data.description} </div>
              <div> Distance: {this.state.distance.toFixed(2)} KM </div>
              <img className="house-image" src={this.state.data.picture} alt="house" />
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
            {this.props.data.homes.map(home => (
              <Feature
                coordinates={[home.longitude, home.latitude]}
                key={home}
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
            <img src="https://fd.ru/images/Mail/flag-point.png" alt="marker" />
          </Marker>
          {this.state.filter.length === 0 &&
              this.props.data.homes.map(home =>
                (
                  <div>
                    <Popup
                      className="popup-marker-v1"
                      coordinates={[home.longitude, home.latitude]}
                      offset={{
                        // eslint-disable-next-line
                        'bottom-left': [12, -38], 'bottom': [0, -10], 'bottom-right': [-12, -38],
                      }}
                      key={home}
                    >
                      <div className="popup-marker-v1">
                        {home.type}
                      </div>
                      <div className="popup-marker-v1">
                        Price: ${home.price}
                      </div>
                    </Popup>

                    <Marker
                      coordinates={[home.longitude, home.latitude]}
                      onClick={() => this.haversine(
                        [parseFloat(home.longitude), parseFloat(home.latitude)],
                        home,
                      )}
                      anchor="bottom"
                    >
                      <img src="http://maps.google.com/mapfiles/ms/icons/red-dot.png" alt="marker" />
                    </Marker>
                  </div>
              ))
            }

          {this.state.filter.length !== 0 &&
              this.props.data.homes.map(home => (
                <div>
                  {this.keywordFilter(home) &&
                    <Popup
                      className="popup-marker-v1"
                      coordinates={[home.longitude, home.latitude]}
                      offset={{
                        // eslint-disable-next-line
                        'bottom-left': [12, -38],  'bottom': [0, -10], 'bottom-right': [-12, -38]
                      }}
                      key={home}
                    >
                      <div className="popup-marker-v1">Price: ${home.price}</div>
                    </Popup>
                  }

                  <Marker
                    coordinates={[home.longitude, home.latitude]}
                    onClick={() => this.haversine(
                      [parseFloat(home.longitude), parseFloat(home.latitude)],
                      home,
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
      picture,
      description,
      propertyType,
      price,
      agencyId {
        name
        phoneNumber
      }
    }
  }
`;

export default graphql(query)(LandingPage);
