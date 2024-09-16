import fs from "node:fs";
import { dirname, join } from "node:path";
import { rimrafSync } from "rimraf";
import { afterAll, beforeAll, describe, expect, it } from "vitest";
import { generateGlobalAssignments } from "../src/utils/generateGlobalAssignments";
import { build, getExporteds } from "../src/utils/getExporteds";

describe("utilities", () => {
  const fixturesDir = join(import.meta.dirname, "./fixtures/");
  const outfile = join(fixturesDir, "./dist/index.js");
  const expectedExporteds = JSON.parse(
    fs.readFileSync(join(fixturesDir, "./expected/exported.json"), "utf-8"),
  );

  beforeAll(async () => {
    await build({
      bundle: true,
      entryPoints: [join(fixturesDir, "./src/index.ts")],
      format: "esm",
      outfile,
    }).catch((e) => {
      console.error(e);
      process.exit(1);
    });
  });

  afterAll(() => {
    rimrafSync(dirname(outfile));
  });

  it("getExporteds", async () => {
    const output = fs.readFileSync(outfile, "utf-8");
    const exporteds = getExporteds(output);
    expect(exporteds).toEqual(expectedExporteds);
  });

  it("generateGlobalAssignments", () => {
    const globalAssignments = generateGlobalAssignments(expectedExporteds, "_");
    const path = join(fixturesDir, "./expected/globalAssignments.js");
    const expectedGlobalAssignments = fs.readFileSync(path, "utf-8");
    expect(globalAssignments).toBe(expectedGlobalAssignments.trim());
  });
});
