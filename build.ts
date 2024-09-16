import { build } from "esbuild";
import type { BuildOptions } from "esbuild";
import { dependencies } from "./package.json";

const entryFile = "src/index.ts";

const shared: BuildOptions = {
  bundle: true,
  entryPoints: [entryFile],
  external: Object.keys(dependencies),
  target: ["es2016"],
  platform: "node",
};

const errorHandle = (e: Error) => {
  console.log(e);
  process.exit(1);
};

build({
  ...shared,
  format: "esm",
  outfile: "./dist/module/index.mjs",
}).catch(errorHandle);

build({
  ...shared,
  format: "cjs",
  outfile: "./dist/script/index.cjs",
}).catch(errorHandle);
