const publisher = require("../publisher");
const sinon = require("sinon");
const path = require("path");
const chai = require("chai");
const {describe, it} = require("mocha");
chai.use(require('chai-as-promised'));

const s3config = {
  accessKey: "access",
  secretKey: "secret",
  baseUrl: "test-base-url",
  bucket: "test-bucket",
  basePath: "test-basepath"
}

const s3Keys = [
  path.join(s3config.basePath, "bk", "json_schema.json"),
  path.join(s3config.basePath, "za", "json_schema.json"),
  path.join(s3config.basePath, "za", "another_json_schema.json"),
];

const subjectsPath = "./test/test-data/complex-valid-subjects/**/*.json";
const owner = "test-artifact";

describe("publishing schemas with no owner", () => {
  const s3Fake = {
    getObjectTagging: sinon.stub().throws(),
    putObject: sinon.stub().returns({
      promise: () => Promise.resolve()
    })
  };

  it("it must upload all files", async () => {
    await publisher.publish(subjectsPath, s3config, s3Fake, owner, false);
    
    for (const key in s3Keys) {
      const expectation = {
        Bucket: s3config.bucket,
        Key: s3Keys[key],
        Tagging: `owner=${owner}`,
        ACL: "private"
      }

      sinon.assert.calledWith(s3Fake.putObject, sinon.match(expectation));
    }

    sinon.assert.callCount(s3Fake.putObject, s3Keys.length);
    sinon.assert.callCount(s3Fake.getObjectTagging, s3Keys.length);
  });

  sinon.restore();
});


describe("publishing schemas with a different owner this", () => {
  const tags = {
    TagSet:[
      {Key: "RandomTag", Value: "randomValue"},
      {Key: "owner", Value: "other-artifact"},
    ]
  };

  const s3Fake = {
    getObjectTagging: sinon.stub().returns({
      promise: () => Promise.resolve(tags)
    }),
    putObject: sinon.stub().returns({
      promise: () => Promise.resolve()
    })
  };

  it("it must fail on the first subject", async () => {
    await chai.expect(publisher.publish(subjectsPath, s3config, s3Fake, owner, false)).to.be.rejected;

    sinon.assert.notCalled(s3Fake.putObject);
    sinon.assert.calledOnce(s3Fake.getObjectTagging);
  });

  sinon.restore();
});

describe("publishing schemas with a different owner and force=true", () => {
  const s3Fake = {
    getObjectTagging: sinon.stub().returns({
      TagSet:[
        {Key: "RandomTag", Value: "randomValue"},
        {Key: "owner", Value: "other-artifact"},
      ]
    }),
    putObject: sinon.stub().returns({
      promise: () => Promise.resolve()
    })
  };

  it("it must publish all files anyway", async () => {
    await publisher.publish(subjectsPath, s3config, s3Fake, owner, true);

    for (const key in s3Keys) {
      const expectation = {
        Bucket: s3config.bucket,
        Key: s3Keys[key],
        Tagging: `owner=${owner}`,
        ACL: "private"
      }

      sinon.assert.calledWith(s3Fake.putObject, sinon.match(expectation));
    }

    sinon.assert.callCount(s3Fake.putObject, s3Keys.length);
    sinon.assert.callCount(s3Fake.getObjectTagging, s3Keys.length);
  });

  sinon.restore();
});