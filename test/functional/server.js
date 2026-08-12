import { createServer } from "http";
import { readFileSync, existsSync } from "fs";
import { join, extname } from "path";

const MIME = {
  ".html": "text/html",
  ".js": "application/javascript",
  ".css": "text/css",
};

createServer((req, res) => {
  const file = join(process.cwd(), req.url);
  if (existsSync(file)) {
    res.writeHead(200, { "Content-Type": MIME[extname(file)] || "text/plain" });
    res.end(readFileSync(file));
  } else {
    res.writeHead(404);
    res.end();
  }
}).listen(3000);
