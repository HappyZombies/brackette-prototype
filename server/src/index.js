/**
 * This file is important as server/index requires in this file. Be careful here!
 * Think of this as the www file.
 */
const app = require('./app');
const http = require('http');
const utils = require('../tools/utils');
const colors = require('colors');
// Network interfaces
let address, ifaces = require('os').networkInterfaces();
for (const dev in ifaces) {
  ifaces[dev].filter((details) => details.family === 'IPv4' && details.internal === false ? address = details.address : undefined);
}

const port = utils.normalizePort(process.env.PORT || '8080');
app.set('port', port);
const server = http.createServer(app);

// Listen for sockets io events.
require('./socketEvents').listen(server);

server.listen(port, () => {
  if (process.env.NODE_ENV === 'production') {
    console.log(colors.cyan(`Type this address to any device that is connected to this network -> `) + colors.green(`${address}:${port}`));
  } else {
    console.log(colors.cyan(`Brackette Server is in development mode, listening in: http://localhost:${port}`));
  }
});
