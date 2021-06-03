const fs = require("fs")
const glob = require("glob")
const Ajv = require("ajv")

const ajv = new Ajv.default({allErrors: true})

module.exports.validate = (pathExpression) => {
  const parsedSchemas = [];
  const successfulSchemas = [];
  const failedSchemas = [];
  
  glob.sync(pathExpression)
    .forEach(schemaPath => {
      console.log(`Validating schema definition: ${schemaPath}`);
      parsedSchemas.push(schemaPath);

      try {
        ajv.addSchema(JSON.parse(fs.readFileSync(schemaPath, "utf8")))
        successfulSchemas.push(schemaPath);
      } catch(error) {
        console.error(error.message);
        failedSchemas.push(schemaPath);
      }
    });

    return {
      parsedSchemas: parsedSchemas, 
      successfulSchemas: successfulSchemas, 
      failedSchemas: failedSchemas
    }
}