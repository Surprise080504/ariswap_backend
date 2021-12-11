Promise = require("bluebird");
const { port } = require("./config/vars");
const mongoose = require("./config/mongoose");
const app = require("./config/express");
const http = require("http");
mongoose.connect();
http.createServer(app).listen(port);
module.exports = app;
