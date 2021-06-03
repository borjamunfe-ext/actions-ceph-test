const core = require("@actions/core");
const validator = require("./validator")

async function run() {
  try {
    const path = core.getInput("subjects-path")
    const pathExpr = `${process.cwd()}/${path}/**/*.json`
    console.log(`Validating subjects using ${pathExpr} expression...`);

    const result = validator.validate(pathExpr)

    core.setOutput("parsed-schemas", result.parsedSchemas);

    if (result.successfulSchemas.length) {
      core.setOutput("successful-schemas", result.successfulSchemas);
    }

    if (result.failedSchemas.length) {
      core.setFailed("Some json schema validations have failed. See the logs for more information.");
      core.setOutput("failed-schemas", result.failedSchemas);
    }
  } catch (error) {
    core.setFailed(error.message);
  }
}

run();