/* eslint-disable */
import React, { Component } from 'react';
import gql from 'graphql-tag';
import { graphql } from 'react-apollo';
import { BarLoader } from 'react-spinners';
import ReactMapboxGl, { Layer, Feature, Popup, Marker } from "react-mapbox-gl";
import { ZoomControl } from "react-mapbox-gl";
import Rodal from 'rodal';
import { Tooltip } from 'react-bootstrap';

import './app.css';
import 'rodal/lib/rodal.css';

const Map = ReactMapboxGl({
  accessToken: "pk.eyJ1IjoieHVyYSIsImEiOiJjamlpam5mczQxdGZjM3F0NDU4d2Z5NWJ2In0.bStw02eNHWj4PhkmzWDeOg"
});



class LandingPage extends Component {

  constructor(props) {
    super(props)
    this.state = {
      data: null,
      center: [144.963169, -37.814251],
      visible: false,
      distance: null,
      popup: false,
    }
    // state binding
    this.showPosition = this.showPosition.bind(this);
    this.show = this.show.bind(this);
    this.haversine = this.haversine.bind(this);

  }

  show(data) {
    this.setState({ visible: true });
    this.setState({ data: data });
  }

  hide() {
    this.setState({ visible: false });
  }

  dataStore() {
    return this.props.data.homes
  }

  haversine(targetCoordinates, data) {

    // haversine formula ACOS(SIN(Lat1)*SIN(Lat2) +COS(Lat1)*COS(Lat2)*COS(Lon2-Lon1)) *6371
    // this does not account for roads. Just straightline distance.
    // Way around it would be to put lat/long points on the road path and then sum up the total distance.

    let earthRadius = 6371;

    let userCoordinates = this.state.center;

    let userLat = userCoordinates[1]
    let userLong = userCoordinates[0]

    let targetLat = targetCoordinates[1];
    let targetLong = targetCoordinates[0];

    let deltaLat = (targetLat-userLat) * (Math.PI / 180)
    let deltaLong = (targetLong-userLong) * (Math.PI / 180)

    let value = Math.sin(deltaLat / 2) * Math.sin(deltaLat / 2) + Math.cos(userLat) * Math.cos(targetLat) * Math.sin(deltaLong / 2) * Math.sin(deltaLong / 2)
    let calculate = 2 * Math.atan2(Math.sqrt(value), Math.sqrt(1-value))

    let haversine = earthRadius * calculate

    this.setState({ distance: haversine })

    this.show(data);
  }


  getLocation() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(this.showPosition);

    } else {
        alert('Geolocation is not supported on this browser')
      }
  }

  showPosition(position) {
    let coordinates = [position.coords.longitude, position.coords.latitude]

    this.setState({ center: coordinates})
  }

  componentDidMount() {
    this.getLocation()
  }

  showTooltip() {
    this.setState({ popup: true })
  }

  render() {

    if (this.props.data.loading) {
      return <div className='loader'> <BarLoader color={'#7d82b5'}/> </div>
    }

    return (
      <div>

        <Rodal width={800} height={600} visible={this.state.visible} onClose={this.hide.bind(this)}>
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
          style="mapbox://styles/mapbox/streets-v9"
          center={this.state.center}
          containerStyle={{
            height: "100vh",
            width: "100vw"
          }}
          >
            <Layer type="circle" id="marker" radius={400} fillColor='#f87362'>
              {
                this.props.data.homes.map(k => (
                    <Feature
                      coordinates={[k.longitude, k.latitude]}
                      onMouseEnter={() => <Tooltip/>}
                      key={k}
                    />

                ))
              }
            </Layer>
            {
              this.props.data.homes.map(k => (
                <div>
                    <Popup
                      className='popup-marker-v1'
                      coordinates={[k.longitude, k.latitude]}
                      offset={{
                        'bottom-left': [12, -38],  'bottom': [0, -10], 'bottom-right': [-12, -38]
                      }}>

                        <div className='popup-marker-v1'>{k.type} / ${k.price}</div>

                    </Popup>
                  <Marker
                    coordinates={[k.longitude, k.latitude]}
                    onClick={() => this.haversine([parseFloat(k.longitude), parseFloat(k.latitude)], k)}
                    anchor="bottom">
                    <img src={'http://maps.google.com/mapfiles/ms/icons/red-dot.png'}/>
                  </Marker>
                </div>
              ))
            }

          <ZoomControl/>
        </Map>
      </div>
    )
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
      price,
    }
  }
`;

export default graphql(query)(LandingPage);
