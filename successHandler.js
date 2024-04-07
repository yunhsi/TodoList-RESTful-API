const Headers = require("./headers");

function successHandler(res, todos) {
  res.writeHead(200, Headers);
  res.write(
    JSON.stringify({
      status: "success",
      data: todos,
    })
  );
  res.end();
}

module.exports = successHandler;
