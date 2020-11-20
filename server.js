var fs = require('fs'),
    path = require('path'),
    http = require('http');

http.createServer(function (req, res) {
  console.log(req.url)
  fs.readFile(path.join(__dirname, "build", req.url), function (err,data) {
    if (err) {
      res.writeHead(404);
      res.end(JSON.stringify(err));
      return;
    }
    res.writeHead(200);
    res.end(data);
  });
}).listen(8080, () => console.log("Listening at port 8080"));