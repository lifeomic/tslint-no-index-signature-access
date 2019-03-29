# tslint-no-index-signature-access

[![npm](https://img.shields.io/npm/v/tslint-no-index-signature-access.svg)](https://www.npmjs.com/package/tslint-no-index-signature-access)
[![Build Status](https://travis-ci.org/lifeomic/tslint-no-index-signature-access.svg?branch=master)](https://travis-ci.org/lifeomic/tslint-no-index-signature-access)
[![Greenkeeper badge](https://badges.greenkeeper.io/lifeomic/tslint-no-index-signature-access.svg)](https://greenkeeper.io/)

A TSLint rule to forbid access index signature references

## Why?

Some types and classes are defined to have catch-all index signatures for
backwards compatibility. Because the type signature allows access to properies
of any name it is very easy for TypeScript to think that a property reference is
valid when it's really pointing at a signature that's only there for backwards
compatibility. For example, in Koa Context objects, the following definition is
at the end:

```typescript
interface BaseContext {
  // Lots of lines have been removed ...

  /**
   * Custom properties.
   */
  [key: string]: any;
}
```

The custom property index signature makes it very easy to write Koa middleware
that accidentally references a property that does not exist on the context.

## Installation

Add the dependency to your project as usual:

```
yarn add --dev tslint-no-index-signature-access
```

Configure tslint to use the new rule. In this example, it will catch Koa
Context reference for 'custom properites' and forbid access:

```json
{
  "rules": {
    "no-index-signature-access": [
      true,
      {
        "typePattern": "BaseContext",
        "message": "References to custom properties on Koa contexts are not allowed"
      }
    ]
  },
  "rulesDirectory": "node_modules/tslint-no-index-signature-access/rules"
}
```
