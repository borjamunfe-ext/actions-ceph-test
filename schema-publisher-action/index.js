const core = require("@actions/core");
const AWS = require("aws-sdk");
const publisher = require("./publisher");

const environments = {
  "local": {
    baseUrl: "https://cephitx.s3.us-east-2.amazonaws.com",
    bucketName: "cephitx",
    basePath: "/"
  },
  "des": {
    baseUrl: "http://localhost:4572",
    bucketName: "demo-bucket",
    basePath: "/des"
  },
  "pre": {
    baseUrl: "http://localhost:4572",
    bucketName: "demo-bucket",
    basePath: "/pre"
  },
  "preint": {
    baseUrl: "http://localhost:4572",
    bucketName: "demo-bucket",
    basePath: "/preint"
  }
}

async function run() {
  try {
    const env = core.getInput("environment")
    const tenant = core.getInput("tenant");
    const s3env = environments[env];

    const path = core.getInput("subjects-path")
    const pathExpr = `${process.cwd()}/${path}/${tenant}/**/*.json`

    if (!(env  in environments)) {
      core.setFailed(`Specified env ${env} is not a valid value. Please refer to the documentation for the valid environment values`);
      return;
    }

    console.log(`Publishing subjects in ${env} for tenant ${tenant} using ${pathExpr} expression....`);

    const s3config = {
      accessKey: core.getInput(`${env}-access-key`),
      secretKey: core.getInput(`${env}-secret-key`),
      baseUrl: s3env.baseUrl,
      bucket: s3env.bucketName,
      basePath: s3env.basePath
    }

    const s3client = new AWS.S3({
      accessKeyId: s3config.accessKey,
      secretAccessKey: s3config.secretKey,
      endpoint: s3config.baseUrl,
      s3ForcePathStyle: true
    });

    await publisher.publish(pathExpr, s3config, s3client, core.getInput("owner"), core.getInput("force") == "true");
  } catch (error) {
    console.log(`An error occurred publishing the schemas: ${error.message}`);
    core.setFailed(error.message);
  }
}

run();