// imports
import React, { Component } from "react";
import { graphql } from "react-apollo";
import gql from "graphql-tag";

// importing local components
import Mapbox from "./components/mapbox";
import Search from "./components/search";
import Loader from "./components/loader";
import MapButtons from "./components/map-buttons";
import PopupRodal from "./components/popup-rodal";

// css import
import "./app.css";

/**
 * @description
 * delcare MapboxGL Map using API_KEY
 * key located in ../../stores/config.js
 */

const maps = {
  Dark: "mapbox://styles/mapbox/dark-v9",
  Light: "mapbox://styles/mapbox/light-v9",
  Streets: "mapbox://styles/mapbox/streets-v9",
  Satellite: "mapbox://styles/mapbox/satellite-v9"
};

class LandingPage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      value: "",
      data: null,
      filter: [],
      visible: false,
      distance: null,
      center: [144.963169, -37.814251],
      mapType: "mapbox://styles/mapbox/streets-v9"
    };
  }

  /**
   * @description
   * getLocation()
   * invokes browser geolocation API to fetch user Longitude and Latitude
   * @return {true} = if able to fetch user long/lat using browser API
   * @return {false} = if unable to fetch user long/lat due to user saying NO or unsupported browser
   */

  getLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(this.showPosition);
    }
    return true;
  };

  /**
   * @description
   * showPosition()
   * this function gets the user long/lat and sets it as the component state
   * @param position = Object with User Longitude and Latitude.
   * @return {null}
   */

  showPosition = position => {
    const { longitude, latitude } = position.coords;
    this.setState({ center: [longitude, latitude] });
  };

  /**
   * @description
   * handleChange()
   * Use the dynamic values provided by the onChange function @react-bootstrap form.
   * Use the words/letters provided to filter the displayed data.
   * when data is received. It invokes the keywordFilter() function.
   * @param userInput = string value that contains every letter/word typed.
   * @return {null}
   */

  handleChange = userInput => {
    try {
      const splitValues = userInput.target.value.split(" ");

      this.setState({ filter: splitValues, value: userInput.target.value });

      if (userInput.target.value === "") {
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
  };

  /**
   * show()
   * @description
   * This function sets the component states for the @param value and visibile state.
   * this helps to open the Modals via Rodal.
   * @param value = Object that has all the data related to homes.
   */

  show = value => {
    this.setState({ visible: true, data: value });
  };

  /**
   * @description
   * hide()
   * This function is used to hide the modal upon closing.
   */

  hide = () => {
    this.setState({ visible: false });
  };

  /**
   * @description
   * keywordFilter()
   * This function takes the home object {dataObject} and splits all the values into a list.
   * It also checks to see if the current typed word is in the list of word.
   * If the word is in the list. It returns true.
   * @param dataObject = home object with all the home related data.
   * @return true = if word has indexed in the list.
   */

  keywordFilter = dataObject => {
    let filteredWords = [""];
    try {
      const descriptionArray = dataObject.description.split(" ");
      const nameArray = dataObject.name.split(" ");
      const addressArray = dataObject.address.split(" ");
      const typeArray = dataObject.type.split(" ");

      // use ... over concat due to ES6 way.

      filteredWords = [
        ...filteredWords,
        ...descriptionArray,
        ...nameArray,
        ...addressArray,
        ...typeArray,
        ...[dataObject.propertyType]
      ];

      /**
       * @description
       * Patching a mistake in the data submissions.
       * Sale should be Buy because Sale/Rent makes no sense.
       */

      if (typeArray[0] === "Sale") {
        filteredWords.push("Buy");
      }

      filteredWords = filteredWords
        .join("|")
        .toLowerCase()
        .split("|");
      return this.state.filter.every(item => filteredWords.indexOf(item.toLowerCase()) !== -1);
    } catch (error) {
      return false;
    }
  };

  /**
   * @description
   * mapChanger()
   * This changes the type of map that is displayed.
   * @param type = string value that has the type of map provided by react-bootstrap button
   */

  mapChanger = type => {
    this.setState({ mapType: maps[type] });
  };

  /**
   * @description
   * haversine()
   * Uses the haversine formula to calculate distance between your position and filtered homes.
   * Ref: https://en.wikipedia.org/wiki/Haversine_formula
   * @param targetCoordinates = array that contains the home position (lat/long)
   * @param data = Object with home related data.
   */

  haversine = (targetCoordinates, data) => {
    /**
     * @description
     * haversine formula ACOS(SIN(Lat1)*SIN(Lat2) +COS(Lat1)*COS(Lat2)*COS(Lon2-Lon1)) *6371
     * this does not account for roads. Just straightline distance.
     */

    const earthRadius = 6371;

    const userCoordinates = this.state.center;

    const userLat = userCoordinates[1];
    const userLong = userCoordinates[0];

    const targetLat = targetCoordinates[1];
    const targetLong = targetCoordinates[0];

    const deltaLat = (targetLat - userLat) * (Math.PI / 180);
    const deltaLong = (targetLong - userLong) * (Math.PI / 180);

    const sinDelta = Math.sin(deltaLat / 2) * Math.sin(deltaLat / 2);

    const cosDelta =
      Math.cos(userLat) * Math.cos(targetLat) * Math.sin(deltaLong / 2) * Math.sin(deltaLong / 2);

    const value = sinDelta + cosDelta;
    const calculate = 2 * Math.atan2(Math.sqrt(value), Math.sqrt(1 - value));

    const haversine = earthRadius * calculate;

    this.setState({ distance: haversine });

    this.show(data);
  };

  componentDidMount() {
    this.getLocation();
  }

  /**
   * @description
   * render()
   * Main react Render Component
   * @return { Component } = Renders and Returns the React Component.
   */

  render() {
    const { value, mapType, visible, data, distance, center, filter } = this.state;

    /**
     * @description
     * disabling next line due to proptype validation
     * If the GraphQL data is in it's loading state. This will render a loading bar.
     */

    // eslint-disable-next-line
    if (this.props.data.loading) {
      return <Loader />;
    }

    /**
     * @description
     * If the data is not loading. Return the Main React Component.
     */

    return (
      <div>
        <Search value={value} handleChange={this.handleChange} />
        <MapButtons mapType={mapType} mapChanger={this.mapChanger} />
        <PopupRodal visible={visible} data={data} distance={distance} hide={this.hide} />
        <Mapbox
          center={center}
          filter={filter}
          mapType={mapType}
          data={this.props.data}
          haversine={this.haversine}
          keywordFilter={this.keywordFilter}
        />
      </div>
    );
  }
}

/**
 * @description
 * This is the raw GraphQL query converted to a string.
 */

const query = gql`
  {
    homes {
      type
      name
      address
      latitude
      longitude
      picture
      description
      propertyType
      price
      agencyId {
        name
        phoneNumber
      }
    }
  }
`;

/**
 * @description
 * Exporting the Component wrapped with the GraphQL query.
 * @param query - GraphQL Query via gql
 * @param LandingPage - Our React Component returned via Render.
 */

export default graphql(query)(LandingPage);
