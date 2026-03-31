import React from 'react';
const safety = ["rgba(186, 250, 255, 1)", 
                "rgba(204, 255, 186,1)", 
                "rgba(255, 241, 183,1)", 
                "rgba(255, 185, 164,1)"];

const safetyDark = ["rgb(110, 164, 168)", 
                    "rgb(129, 168, 113)", 
                    "rgb(181, 166, 115)", 
                    "rgb(165, 110, 93)"];

const ForecastButton = ({safetynum, numval, units, text, click, darkMode}) => {
  
  const bgColour = darkMode ? (safetyDark[safetynum]) : (safety[safetynum])
  return( 
    <button 
      onClick={click} 
      style={{height:"40vw",
              width:"40vw", 
              maxWidth:"180px", 
              maxHeight:"180px", 
              backgroundColor: bgColour}}
      className="btn shadow-sm rounded-5 p-0" 
      type="button"
      data-bs-toggle="modal" 
      data-bs-target="#fModal"
      >
        <div className="row w-100 h-100 text-center align-items-center mx-auto p-0 row-cols-1">
            <h1 className="col mx-auto fw-semibold">{numval}{units}</h1>
            <h5 className="col mx-auto">{text}</h5>
        </div>
    </button>
  );
};

export default ForecastButton;
//state(0,3),float,units,text