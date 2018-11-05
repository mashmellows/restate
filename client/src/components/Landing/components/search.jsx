import React from "react";
import { FormGroup, FormControl, ControlLabel } from "react-bootstrap";

const Search = (value, handleChange) => (
  <div className="search-bar">
    <form>
      <FormGroup controlId="formBasicText">
        <ControlLabel>Filter Results</ControlLabel>
        <FormControl
          type="text"
          /** @description this prop shows the current typed data in the form. */
          value={value}
          placeholder="Type Here!"
          /** @description this prop returns real time changes to the handleChange(). */
          onChange={handleChange}
        />
      </FormGroup>
    </form>
  </div>
);

export default Search;
