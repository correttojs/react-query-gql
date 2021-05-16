import typescript from "rollup-plugin-typescript2";
import pkg from "./package.json";
import { terser } from "rollup-plugin-terser";
import copy from "rollup-plugin-copy";

export default {
  input: "src/index.ts",
  output: [
    {
      file: pkg.main,
      exports: "named",
      sourcemap: true,
      strict: false,
      format: "cjs",
      compact: true,
    },
  ],
  plugins: [
    typescript(),
    terser(),
    copy({
      targets: [{ src: "dist", dest: "example" }],
    }),
  ],
  external: [
    "react",
    "react-dom",
    "graphql",
    "react-query",
    "graphql-request",
    "next",
  ],
};
