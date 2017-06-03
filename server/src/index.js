/**
 * This file is important as server/index requires in this file. Be careful here!
 */
import app from './app'
import http from 'http'
import open from 'opn'
import {listen} from './socketEvents';

const port = normalizePort(process.env.PORT || '8080');
app.set('port', port);
const server = http.createServer(app)

// Listen for sockets io events.
listen(server);

server.listen(port, () => {
  if (process.env.NODE_ENV === 'production') {
    open(`http://localhost:${port}`);
  } else {
    console.log(`Brackette Server is in development mode, listening in: http://localhost:${port}`)
  }
})
/**
 * Normalize a port into a number, string, or false.
 */
function normalizePort(val) {
  const port = parseInt(val, 10);

  if (isNaN(port)) {
    // named pipe
    return val;
  }

  if (port >= 0) {
    // port number
    return port;
  }

  return false;
}
