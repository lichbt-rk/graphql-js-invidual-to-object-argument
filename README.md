## CodeMod

Convert graphql function call from individual to object arguments

    // From
    const result = await graphql(schema, query, rootValue, context)
    // To
    const result3 = await graphql({
      schema:,
      source: query,
      rootValue,
      contextValue: context
    })


## Usage

    npx graphql-function-invidual-to-object-argument <PATH>

## Note

This codemod could not handle SpreadElement

    const result = await graphql(...args)
