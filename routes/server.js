const express = require('express');
const {createProxyMiddleware} = require('http-proxy-middleware');

const app = express();

// const routes = {
//     '/lg' : 'http://127.0.0.1:5005',
//     '/dsb' : 'http://127.0.0.1:5003',
//     '/pr' : 'http://127.0.0.1:5002',
//     '/ds' : 'http://127.0.0.1:5004'
// }


const routes = {
  '/lg': 'http://auth-service:5005',     
  '/dsb': 'http://dashboard-service:5003', 
  '/pr': 'http://profile-service:5002',   
  '/ds': 'http://feedback-service:5004'  
}

for(const route in routes){
    const target = routes[route];
    app.use(route, createProxyMiddleware({target}));
}



const PORT = process.env.PORT || 5025;
app.listen(PORT, function () {
  console.log(`Server is started on http://127.0.0.1:${PORT}`);
});