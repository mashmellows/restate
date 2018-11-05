import React from "react";
import Rodal from "rodal";
import "rodal/lib/rodal.css";

const PopupRodal = (visible, data, distance, hide) => (
  <Rodal width={800} height={600} visible={visible} onClose={() => hide()}>
    {!!data && (
      <div>
        <div> {data.name} </div>
        <div> Address: {data.address}</div>
        <div> Description: {data.description} </div>
        <div> Distance: {distance.toFixed(2)} KM </div>
        <img className="house-image" src={data.picture} alt="house" />
      </div>
    )}
  </Rodal>
);

export default PopupRodal;
