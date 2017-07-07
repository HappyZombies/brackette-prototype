// Tools contains tools for building the project. In theory any files in this dir should be script files that npm would call.
const args = ["start"];
const opts = { stdio: "inherit", cwd: "client", shell: true };
require("child_process").spawn("npm", args, opts);
