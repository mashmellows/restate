import React from "react";
import ReactMapboxGl, { Layer, Feature, Popup, Marker, ZoomControl, data } from "react-mapbox-gl";
import * as config from "../../../stores/config";

const Map = ReactMapboxGl({
  accessToken: config.MAPBOX_KEY
});

const Mapbox = ({ mapType, center, filter, haversine, keywordFilter }) => (
  <Map style={mapType} center={center}>
    <Layer type="circle" id="marker" radius={400} fillColor="#f87362">
      {data.homes.map(home => (
        <Feature
          /** @description
           * Providing the coordinates from the mapped homes Object.
           * Places a Feature on those coordinates.
           * @prop coordinates - List: A List with longitude and latitude.
           */

          coordinates={[home.longitude, home.latitude]}
          key={home}
        />
      ))}
    </Layer>

    <Popup
      /** @description
       * Places a Popup on the given user coordinates,
       * @prop coordinates - List: A List with longitude and latitude.
       */

      className="popup-marker-v1"
      coordinates={center}
    >
      <div className="popup-marker-v1">You are Here!</div>
    </Popup>

    <Marker
      /** @description
       * Places a marker on your location.
       * @prop coordinates - List: User Long/Lat
       */

      coordinates={center}
      anchor="bottom"
    >
      <img src="https://fd.ru/images/Mail/flag-point.png" alt="marker" />
    </Marker>
    {filter.length === 0 &&
      data.homes.map(home => (
        <div>
          <Popup
            className="popup-marker-v1"
            /** @description
             * When the user starts to type. It filtes the homes.
             * Those filtered homes get a popup with it's type and price.
             * @prop coordinates - List: Homes filtered longitude and latitude.
             */

            coordinates={[home.longitude, home.latitude]}
            offset={{
              // eslint-disable-next-line
              "bottom-left": [12, -38],
              bottom: [0, -10],
              "bottom-right": [-12, -38]
            }}
            key={home}
          >
            <div className="popup-marker-v1">{home.type}</div>
            <div className="popup-marker-v1">Price: ${home.price}</div>
          </Popup>

          <Marker
            /** @description
             * When the user starts to type. It filtes the homes.
             * Those filtered homes get a marker with png.
             * It provides the distance to the house via haversin().
             * @prop coordinates - List: Homes filtered longitude and latitude.
             * @prop onClick - List: Homes filtered longitude and latitude.
             */

            coordinates={[home.longitude, home.latitude]}
            onClick={() => haversine([parseFloat(home.longitude), parseFloat(home.latitude)], home)}
            anchor="bottom"
          >
            <img src="http://maps.google.com/mapfiles/ms/icons/red-dot.png" alt="marker" />
          </Marker>
        </div>
      ))}

    {filter.length !== 0 &&
      data.homes.map(home => (
        <div>
          {keywordFilter(home) && (
            <Popup className="popup-marker-v1" coordinates={[home.longitude, home.latitude]} key={home}>
              <div className="popup-marker-v1">Price: ${home.price}</div>
            </Popup>
          )}

          <Marker
            coordinates={[home.longitude, home.latitude]}
            onClick={() => haversine([parseFloat(home.longitude), parseFloat(home.latitude)], home)}
            anchor="bottom"
          >
            <img src="http://maps.google.com/mapfiles/ms/icons/red-dot.png" alt="marker" />
          </Marker>
        </div>
      ))}

    <ZoomControl />
  </Map>
);

export default Mapbox;
