// import React from 'react'
// import { useNavigate } from 'react-router-dom';

import React from "react";

const Crypto = () => {
    localStorage.setItem("pp","adarsh");
sessionStorage.setItem("pp","vsfdcx");
  return (
    <div>
      yhrtgfdvcx
      <button onClick={()=>localStorage.removeItem("pp")}>Remove</button>
      <button onClick={()=>window.location.reload()}>Reload</button>
    </div>
  )
}

export default Crypto
