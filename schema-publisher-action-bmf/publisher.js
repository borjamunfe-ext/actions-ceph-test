const fs = require("fs");
const path = require("path");
const glob = require("glob")

module.exports.publish = async (pathExpression, s3config, s3client, owner, force) => {
  const paths = glob.sync(pathExpression);

  for (const count in paths) {
    const schemaPath = paths[count];
    const fileKey = path.basename(schemaPath);
    const tenant = path.basename(path.dirname(schemaPath));
    const s3key = path.join(s3config.basePath, tenant, fileKey);

    console.log(`Publishing ${schemaPath} into s3://${s3config.bucket}/${s3config.basePath}/${s3key}...`);

    var ownerTag = null;
    try {
      const tags = await s3client.getObjectTagging({Bucket: s3config.bucket, Key: s3key}).promise();
      ownerTag = tags.TagSet.filter(tag => tag.Key === "owner");
    } catch(keyError) { 
      //throws an error if the key is not found
    }

    // stop other repositories from overwriting the same definitions by mistake
    if (!force && ownerTag && ownerTag[0].Value != owner) {
      throw new Error(`The subject owner for ${fileKey} is not the expected. 
        Owner found is "${ownerTag[0].Value}" and the expected is "${owner}". Take a look at the ${ownerTag[0].Value} repository...`);
    }

    await s3client.putObject({
      Bucket: s3config.bucket,
      Key: s3key,
      Tagging: `owner=${owner}`,
      Body: fs.readFileSync(schemaPath),
      ACL: "private",
    }).promise();

    console.log(`${schemaPath} published successfully.`);
  }
}