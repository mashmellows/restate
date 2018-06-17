/* eslint-disable */
import React, { Component } from 'react';
import gql from 'graphql-tag';
import { graphql } from 'react-apollo';
import { BarLoader } from 'react-spinners';
import ReactMapboxGl, { Layer, Feature } from "react-mapbox-gl";
import { ZoomControl } from "react-mapbox-gl";
import Rodal from 'rodal';

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
      visible: false
    }
    this.showPosition = this.showPosition.bind(this);
    this.show = this.show.bind(this);
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
              <div> </div>
              <div> {this.state.data.address}</div>
              <div> </div>
              <div> {this.state.data.description} </div>
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
                  onClick={() => this.show(k)}
                  coordinates={[k.longitude, k.latitude]}
                  key={k}
                />
              ))
            }
          </Layer>
          <ZoomControl/>
        </Map>
      </div>
    )
  }
}

const query = gql`
  {
    homes {
      name,
      address,
      latitude,
      longitude,
      description,
    }
  }
`;

export default graphql(query)(LandingPage);
