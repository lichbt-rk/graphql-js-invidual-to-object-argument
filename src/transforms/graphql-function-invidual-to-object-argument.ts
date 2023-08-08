import { API, FileInfo } from "jscodeshift";

const argNames = [
  "schema",
  "source",
  "rootValue",
  "contextValue",
  "variableValues",
  "operationName",
  "fieldResolver",
  "typeResolver",
];

const transformer = (file: FileInfo, api: API) => {
  const j = api.jscodeshift;

  const convertArgToProperty = (arg, name) => {
    if (!name || arg.type === "SpreadElement") {
      // @todo: convert SpreadElement
      return null;
    }

    switch (arg.type) {
      case "Identifier": {
        if (arg.name === name) {
          return j.property.from({
            kind: "init",
            key: j.identifier(name),
            value: j.identifier(name),
            shorthand: true,
          });
        } else {
          return j.property("init", j.identifier(name), j.identifier(arg.name));
        }
      }

      case "Literal":
      case "ObjectExpression":
      default: {
        return j.property("init", j.identifier(name), arg);
      }
    }
  };

  const updateArgumentsCalls = (path) => {
    const afPath = path;
    const { value: fn } = afPath;
    const { arguments: originArgs } = fn;

    if (!originArgs.length) {
      return;
    }

    if (originArgs[0].type === "ObjectExpression") {
      console.log("originArgs", originArgs[0].properties);
      return;
    }

    const properties = [];
    for (let i = 0; i < originArgs.length; i++) {
      const property = convertArgToProperty(originArgs[i], argNames[i]);
      if (property) {
        properties.push(property);
      }
    }

    j(path).replaceWith(
      j.callExpression(j.identifier("graphql"), [
        j.objectExpression(properties),
      ])
    );
  };

  return j(file.source)
    .find(j.CallExpression, {
      callee: {
        name: "graphql",
      },
    })
    .forEach(updateArgumentsCalls)
    .toSource();
};

export default transformer;
