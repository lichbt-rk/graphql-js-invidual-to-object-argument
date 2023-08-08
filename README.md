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

    npx graphql-js-invidual-to-object-argument <PATH>
    // For typescript
    npx graphql-js-invidual-to-object-argument <PATH> -- --parser=ts

## Note

This codemod could not handle SpreadElement

    const result = await graphql(...args)
