import axios from 'axios';
import https from 'https';



const config = {
    "Content-Type": "application/x-www-form-urlencoded"
  };

export default axios.create({
    baseURL: 'http://35.238.162.67/',
    headers: config,
    //withCredentials: true,

    // header: {
    // 	Authorization: 'bearer accessKey'
    // }
});

// export default axios.creayte({
//   baseURL: 'http://rokserver.bearbear.co.kr/',
//   headers: config,
//   withCredentials: true,
//   httpsAgent: new https.Agent({  
//     rejectUnauthorized: false
//   })
// });
