import React from "react";

const TimeList = () => {
  return (
    <div id="time-intervals" className="bg-primary-subtle">
      <div
        className="btn-group-vertical position-absolute top-50 start-50 translate-middle w-75 pb-5"
        role="group"
        aria-label="Vertical button group"
      >
        <button type="button" className="btn btn-outline-primary">
          Today
        </button>
        <button type="button" className="btn btn-outline-primary">
          Last week
        </button>
        <button type="button" className="btn btn-outline-primary">
          Last month
        </button>
        <button type="button" className="btn btn-outline-primary">
          Last year
        </button>
        <button type="button" className="btn btn-outline-primary">
          Last 5 years
        </button>
      </div>
    </div>
  );
};

export default TimeList;
