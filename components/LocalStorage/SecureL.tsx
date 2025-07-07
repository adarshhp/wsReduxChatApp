// import CryptoJS from 'crypto-js';

import React from "react";

// const secureLocalStorage = {
//   setItem: (key:any, value:any) => {
//     const encryptedValue = CryptoJS.AES.encrypt(value.toString(), 'secretKey').toString();
//     localStorage.setItem(key, encryptedValue);
//   },
//   getItem: (key:any) => {
//     const encryptedValue = localStorage.getItem(key);
//     if (!encryptedValue) return null;
//     const bytes = CryptoJS.AES.decrypt(encryptedValue, 'secretKey');
//     return bytes.toString(CryptoJS.enc.Utf8);
//   }
// };

const SecureL = () => {
    // Example of using localStorage normally
    // localStorage.setItem("fkrehsdix", 34);
    const tryy=()=>{
localStorage.removeItem("fkrehsdix")
    }
    localStorage.removeItem("Hello")
  
    // Assuming secureLocalStorage is some kind of secure storage handler
    // If you have a secureLocalStorage set up (e.g., with encryption), use it here
    // If it's a typo and you're using normal localStorage, you can remove this line or fix it.
//     secureLocalStorage.setItem("efdcx", 2423); // make sure secureLocalStorage is defined properly
//   const yy=secureLocalStorage.getItem("efdcx")
//   console.log(yy)
    return (
      <div className="w-full h-full bg-white">
        bgvfdcxzvcrsfdxc
        <button onClick={tryy} className='bg-amber-400 w-12 h-16'>
            removeitem
        </button>
        {/* You can display data or other UI components here */}
      </div>
    );
  };
  
  export default SecureL;
  