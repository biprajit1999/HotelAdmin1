const express = require('express');
const {createProxyMiddleware} = require('http-proxy-middleware');

const app = express();

const routes = {
    '/lg' : 'http://127.0.0.1:7005',
    '/dsb' : 'http://127.0.0.1:7003',
    '/pr' : 'http://127.0.0.1:7002',
    '/ds' : 'http://127.0.0.1:7004'
}


// const routes = {
//   '/lg': 'http://auth-service:7005',     
//   '/dsb': 'http://dashboard-service:7003', 
//   '/pr': 'http://profile-service:7002',   
//   '/ds': 'http://feedback-service:7004'  
// }

for(const route in routes){
    const target = routes[route];
    app.use(route, createProxyMiddleware({target}));
}



const PORT = process.env.PORT || 7027;
app.listen(PORT, function () {
  console.log(`Server is started on http://127.0.0.1:${PORT}`);
});