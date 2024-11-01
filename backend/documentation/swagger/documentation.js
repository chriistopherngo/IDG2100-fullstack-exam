// Sources:
// https://swagger.io/docs/specification/basic-structure/
// https://www.npmjs.com/package/yaml
// https://swagger.io/docs/specification/describing-parameters/
// https://swagger.io/docs/specification/data-models/data-types/
// https://swagger.io/docs/specification/describing-request-body/
// https://swagger.io/docs/specification/describing-responses/

// Import dependencies
const fs = require("fs")
const YAML = require("yaml")

// Assign contents of yaml documentation file to a variable
const yamlFile = fs.readFileSync("./documentation/swagger/swagger.yaml", "utf8")
// Parse the yaml to make it usable by Swagger
const swaggerDocumentation = YAML.parse(yamlFile)


// Export the parsed documentation
module.exports = swaggerDocumentation