import * as Lint from 'tslint';
import * as ts from 'typescript';

type OptionElement = {
  typePattern: string;
  message: string;
};

function getTypeNameOwningIndexSignature(
  declaration: ts.IndexSignatureDeclaration
): string | undefined {
  const parent = declaration.parent;
  if (ts.isTypeAliasDeclaration(parent.parent)) {
    return ts.idText(parent.parent.name);
  }

  if (ts.isClassDeclaration(parent)) {
    if (parent.name) {
      return ts.idText(parent.name);
    }
  }

  if (ts.isInterfaceDeclaration(parent)) {
    if (parent.name) {
      return ts.idText(parent.name);
    }
  }
}

function failIfBannedIndexReference(
  ctx: Lint.WalkContext<OptionElement[]>,
  node: ts.Node,
  typeName: string
) {
  for (const { typePattern, message } of ctx.options) {
    const patternRegexp = new RegExp(typePattern);
    if (patternRegexp.test(typeName)) {
      ctx.addFailureAt(node.getStart(), node.getWidth(), message);
      return;
    }
  }
}

function noIndexSignatureAccessWalker(
  ctx: Lint.WalkContext<OptionElement[]>,
  typeChecker: ts.TypeChecker
) {
  // Recursively walk the AST starting with root node, `ctx.sourceFile`.
  // Call the function `cb` (defined below) for each child.
  ts.forEachChild(ctx.sourceFile, cb);
  return;

  function cb(node: ts.Node): void {
    if (ts.isPropertyAccessExpression(node)) {
      walkPropertyAccessExpression(ctx, typeChecker, node);
    }
    return ts.forEachChild(node, cb);
  }
}

function walkPropertyAccessExpression(
  ctx: Lint.WalkContext<OptionElement[]>,
  typeChecker: ts.TypeChecker,
  node: ts.PropertyAccessExpression
) {
  const type = typeChecker.getTypeAtLocation(node.expression);
  if (!type) {
    return;
  }

  const idText = ts.idText(node.name);

  const symbol = typeChecker.getSymbolAtLocation(node);
  if (symbol) {
    const valueDeclaration = symbol.valueDeclaration;
    if (valueDeclaration) {
      if (
        ts.isPropertyDeclaration(valueDeclaration) ||
        ts.isPropertySignature(valueDeclaration) ||
        ts.isMethodSignature(valueDeclaration) ||
        ts.isMethodDeclaration(valueDeclaration)
      ) {
        // The referenced symbol is a named property or function then allow
        return;
      }
    }
  }

  const propertyType = typeChecker.getPropertyOfType(type, idText);
  const stringIndexType = typeChecker.getIndexInfoOfType(
    type,
    ts.IndexKind.String
  );

  if (stringIndexType && stringIndexType.declaration) {
    const typeName = getTypeNameOwningIndexSignature(
      stringIndexType.declaration
    );
    if (typeName) {
      failIfBannedIndexReference(ctx, node, typeName);
    }
  }
  if (!propertyType) {
    const typeName = typeChecker.typeToString(type);
    failIfBannedIndexReference(ctx, node, typeName);
  }
}

export class Rule extends Lint.Rules.TypedRule {
  public static FAILURE_STRING = 'index signature property access not allowed';

  public applyWithProgram(
    sourceFile: ts.SourceFile,
    program: ts.Program
  ): Lint.RuleFailure[] {
    const options = this.getOptions().ruleArguments as OptionElement[];

    return this.applyWithFunction(
      sourceFile,
      noIndexSignatureAccessWalker,
      options,
      program.getTypeChecker()
    );
  }
}
