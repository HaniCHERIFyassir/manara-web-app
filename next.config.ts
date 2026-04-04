import type { NextConfig } from "next";
import fs from "fs";
import path from "path";

/** Directory that contains this app's package.json (stable even if config is evaluated from an odd cwd). */
function packageRoot(startDir: string): string {
  let dir = path.resolve(startDir);
  for (;;) {
    if (fs.existsSync(path.join(dir, "package.json"))) {
      return dir;
    }
    const parent = path.dirname(dir);
    if (parent === dir) {
      break;
    }
    dir = parent;
  }
  return path.resolve(startDir);
}

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "upload.wikimedia.org",
        pathname: "/**",
      },
    ],
  },
  turbopack: {
    // Walk up from cwd so this stays correct even if the shell is in a subfolder.
    root: packageRoot(process.cwd()),
  },
};

export default nextConfig;
