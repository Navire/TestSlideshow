const microservice =  require('./server');
const http = require('http');
const retreiveUrl = 'http://wishlist.neemu.com/onsite/impulse-core/ranking/'

const getPricereduction = (mostpopular) => 
    http.get(`${retreiveUrl}pricereduction.json`, (res) => {
        let body = "";
        res.on("data", (chunk) => {
            body += chunk;
        });

        res.on("end", () => {
            microservice({
                mostpopular,
                pricereduction: JSON.parse(body)
            });                       
        });

    }).on("error", (error) => {
        console.error(error.message);
    });


http.get(`${retreiveUrl}mostpopular.json`,(res) => {
    let body = "";
    res.on("data", (chunk) => {
        body += chunk;
    });

    res.on("end", () => {
        getPricereduction(JSON.parse(body));            
    });
}).on("error", (error) => {
    console.error(error.message);
});
