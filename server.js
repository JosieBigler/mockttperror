(async () => {
    const mockttp = require('mockttp');
    var formidable = require('formidable');
    const proxy = mockttp.getLocal();
    const path = require('path');

    proxy.forAnyRequest()
        .thenForwardTo('http://localhost:8001', {
            beforeRequest: (request) => {
                request.url = 'http://localhost:8001';
                request.headers.host = 'localhost';
                return request;
            }
        });





    const proxyPort = 8000;
    const serverPort = 8001;
    await proxy.start(proxyPort);
    const uploadFolder = __dirname;
    console.log(`proxy listening on port: ${proxyPort}`);


    const http = require('http');
    const fs = require('fs');
    
    const server = http.createServer(async (req, res) => {
      if (req.method === 'POST') {
        const contentType = req.headers['content-type'];
    
        if (contentType) {
          let body = await doSomethingWithNodeRequest(req);
          console.log(body);
          req.on('data', (chunk) => {
            // console.log(chunk);
            // body = Buffer.concat([body, chunk]);
          });
    
          req.on('end', () => {
            
    
            res.statusCode = 200;
            res.end();
          });

          res.statusCode = 200;
            res.end();
        }
      }
    
      res.statusCode = 404;
      res.end();
    });
    
    server.listen(serverPort, () => {
      console.log(`Server is listening on port ${serverPort}`);
    });

    function doSomethingWithNodeRequest(req) {
        return new Promise((resolve, reject) => {
          /** @see https://github.com/node-formidable/formidable/ */
          const form = formidable({ multiples: true, uploadDir: uploadFolder })
          form.parse(req, (error, fields, files) => {
            if (error) {
              reject(error);
              return;
            }
            resolve({ ...fields, ...files });
          });
        });
      }

})();