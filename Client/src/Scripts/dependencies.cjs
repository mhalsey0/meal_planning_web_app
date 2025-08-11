const { existsSync } = require("fs");
const { execSync } = require("child_process");

function run(cmd) {
  execSync(cmd, { stdio: "inherit" });
}

if (!existsSync("node_modules")) {
  console.log("node_modules not found. Installing dependencies with npm ci…");
  try {
    run("npm ci --no-audit --no-fund");
  } catch {
    console.log("npm ci failed, falling back to npm install…");
    run("npm install --no-audit --no-fund");
  }
} else {
  try {
    // Check for empty node_modules
    run(`node -e "const fs=require('fs');console.log(fs.readdirSync('node_modules').length)" > /dev/null`);
  } catch {
    console.log("node_modules looks empty. Installing dependencies…");
    try {
      run("npm ci --no-audit --no-fund");
    } catch {
      run("npm install --no-audit --no-fund");
    }
  }
}
