const fs = require("fs");

let schema = fs.readFileSync("schema.graphql", "utf8");

// Remove "implements Node" from all types to avoid Relay Node interface requirements
schema = schema.replace(/ implements Node/g, "");

// Remove the Node interface definition entirely
schema = schema.replace(/interface Node \{[\s\S]*?\}\n\n/g, "");

// Remove the node query field from Query type
schema = schema.replace(/\s*"""Retrieve a record by its `ID`"""\s*node\(\s*"""The record's `ID`"""\s*nodeId: ID!\s*\): Node\n/g, "");

// Remove nodeId field from all types (we'll use the regular id field)
schema = schema.replace(/\s*"""Globally Unique Record Identifier"""\s*nodeId: ID!\n/g, "");

// Remove nodeId from filter inputs
schema = schema.replace(/\s*nodeId: IDFilter\n/g, "");

fs.writeFileSync("schema.graphql", schema);
console.log("Schema transformed successfully!");
