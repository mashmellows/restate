import React from "react";
import { ButtonGroup, Button } from "react-bootstrap";
import * as TI from "react-icons/lib/ti";

const MapButtons = (mapType, mapChanger) => (
  <div className="button-group">
    <ButtonGroup>
      <Button onClick={() => mapChanger("Light")} disabled={mapType === "mapbox://styles/mapbox/light-v9"}>
        <TI.TiEyeOutline color="#63A29C" size={20} />
      </Button>

      <Button onClick={() => mapChanger("Dark")} disabled={mapType === "mapbox://styles/mapbox/dark-v9"}>
        <TI.TiEye color="#63A29C" size={20} />
      </Button>

      <Button
        onClick={() => mapChanger("Streets")}
        disabled={mapType === "mapbox://styles/mapbox/streets-v9"}
      >
        <TI.TiMap color="#63A29C" size={20} />
      </Button>

      <Button
        onClick={() => mapChanger("Satellite")}
        disabled={mapType === "mapbox://styles/mapbox/satellite-v9"}
      >
        <TI.TiWorldOutline color="#63A29C" size={20} />
      </Button>
    </ButtonGroup>
  </div>
);

export default MapButtons;
