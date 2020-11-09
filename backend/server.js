const http = require('http');
const fs = require('fs');
const path = require('path');
const port = 3000;

const microservice = (data) => { 

    http.createServer(function (request, response) {  
        let filePath = '../frontend' + request.url;
        
        if (filePath == '../frontend/') {
            filePath = '../frontend/index.html';
        }

        const extname = String(path.extname(filePath)).toLowerCase();
        let contentType = 'text/html';
        const mimeTypes = {
            '.html': 'text/html',
            '.js': 'text/javascript',
            '.css': 'text/css',
            '.json': 'application/json',
            '.png': 'image/png',
            '.jpg': 'image/jpg',
            '.gif': 'image/gif',
            '.wav': 'audio/wav',
            '.mp4': 'video/mp4',
            '.woff': 'application/font-woff',
            '.ttf': 'application/font-ttf',
            '.eot': 'application/vnd.ms-fontobject',
            '.otf': 'application/font-otf',
            '.svg': 'application/image/svg+xml'
        };

        contentType = mimeTypes[extname] || 'application/octet-stream';

        if (request.method === 'POST' && request.url === '/data' ){
            
            let body = '';
            let maxProducts = 10;
            request.on('data', chunk =>{ body += chunk});
            request.on('end', () => {
                try {
                    let json = JSON.parse(body);
                    maxProducts = json.maxProducts
                    
                    // do something with JSON
                } catch (error) {
                    console.error(error.message);
                };
            })

            response.setHeader("Content-Type", "application/json");
            response.writeHead(200);

            const result = JSON.stringify({ maxProducts, data })
            response.end(result);
        } else
        fs.readFile(filePath, function(error, content) {
            if (error) {
                response.writeHead(500);
                response.end('Check this error code: '+error.code+' ..\n');
            }
            else {
                response.writeHead(200, { 'Content-Type': contentType });
                response.end(content);
            }
        });

    }).listen(port);


    console.log(`Server running at http://127.0.0.1:${port}/`);
}

module.exports = microservice;