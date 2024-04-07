const Headers = require("./headers");

function errorHandler(res, status, msg) {
  res.writeHead(status, Headers);
  res.write(
    JSON.stringify({
      status: `${status} error`,
      msg,
    })
  );
  res.end();
}

module.exports = errorHandler;
