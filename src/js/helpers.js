///////////////////////FUNCTIONS THOSE ARE USED REPEATAIVELY ARE STORED IN**************( helper.js)////////////////////////////

import {TIMEOUT_SEC} from './config.js'; 
const timeout = function(s) { 
  return new Promise(function(_,reject) { 
    setTimeout(function() { 
      reject(new Error(`Request took too long! Timeout after ${s} seconds.`)); 
    },s*1000); 
  })
}

// export const getJSON = async function(url) { 
//   try {
//     const fetchPro = fetch(url); 
//     const res = await Promise.race([fetchPro,timeout(TIMEOUT_SEC)]); //here res is the resolved value from the promise .
//     if (!res.ok) return; 
//     const data = await res.json(); //data is the resolved value from res.json(); 
//     return data; //this data will be the resolved value of the promise . 
//   } catch(err) { 
//     throw err; // this means that the promise is rejected .
//     // getJSON function will then return a promise with rejected state. 
//   }
// }

// export const sendJSON = async function(url,uploadData) { 
//   try {
//     const fetchPro = fetch(url,{
//       method: 'POST',
//       headers: {
//         'Content-Type': 'application/json',
//       },
//       body: JSON.stringify(uploadData),
//     }); 
//     const res = await Promise.race([fetchPro,timeout(TIMEOUT_SEC)]); //here res is the resolved value from the promise .
//     // console.log(res); 
//     if (!res.ok) return; 
//     const data = await res.json(); //data is the resolved value from res.json(); 
//     return data; //this data will be the resolved value of the promise . 
//   } catch(err) { 
//     throw err; // this means that the promise is rejected .
//     // getJSON function will then return a promise with rejected state. 
//   }
// }
export const AJAX = async function(url,uploadData = undefined) { 
  try {
    const fetchPro = uploadData
      ? fetch(url, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(uploadData),
        })
      : fetch(url);
    const res = await Promise.race([fetchPro, timeout(TIMEOUT_SEC)]); //here res is the resolved value from the promise .
    // console.log(res);
    if (!res.ok) return;
    const data = await res.json(); //data is the resolved value from res.json();
    return data; //this data will be the resolved value of the promise .
  } catch (err) {
    throw err; // this means that the promise is rejected .
    // getJSON function will then return a promise with rejected state.
  }
}