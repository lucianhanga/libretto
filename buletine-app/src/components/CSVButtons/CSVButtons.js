import React from "react";
import "./CSVButtons.css";

const CSVButtons = () => {
  return (
    <div className="button-group">
      <button className="btn btn-primary">Show CSV</button>
      <button className="btn btn-danger">Clear CSV</button>
      <button className="btn btn-success">Download CSV</button>
    </div>
  );
};

export default CSVButtons;