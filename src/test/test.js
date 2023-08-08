const query = `query{
    notifications{
      id
      title
      body
      posted_at
    }
  }`
  const test = [schema, query, rootValue, context]
  //const result = await graphql(schema, query, rootValue, context)
  const result1 = await graphql({
    schema,
    source: 'qurey',
    rootValue: {a: 123},
    contextValue: {b: 1234},
    variableValues: {asd: 2222},
    operationName: 'abc',
    fieldResolver: () => {}
  })
  const result3 = await graphql({
    schema: schema3,
    source: query3,
    rootValue: rootValue3,
    contextValue: context3
  })
  const result2 = await graphql({
    schema,
    source: query,
    rootValue: rootValue,
    contextValue: context
  })
  console.log('1222')