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

class NoIndexSignatureAccess extends Lint.ProgramAwareRuleWalker {
  private failIfBannedIndexReference(node: ts.Node, typeName: string) {
    for (const {
      typePattern,
      message
    } of this.getOptions() as OptionElement[]) {
      const patternRegexp = new RegExp(typePattern);
      if (patternRegexp.test(typeName)) {
        this.addFailureAt(node.getStart(), node.getWidth(), message);
        return;
      }
    }
  }

  protected visitPropertyAccessExpression(node: ts.PropertyAccessExpression) {
    const typeChecker = this.getTypeChecker();

    const type = typeChecker.getTypeAtLocation(node.expression);
    if (!type) {
      return;
    }

    const idText = ts.idText(node.name);

    const symbol = typeChecker.getSymbolAtLocation(node);
    if (symbol) {
      const valueDeclaration = symbol.valueDeclaration;
      if (ts.isPropertyDeclaration(valueDeclaration)) {
        // The referenced symbol is a named property declaration on a class
        return;
      }

      if (ts.isPropertySignature(valueDeclaration)) {
        // The referenced symbol is a named property on an interface or type
        return;
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
        this.failIfBannedIndexReference(node, typeName);
      }
    }
    if (!propertyType) {
      const typeName = typeChecker.typeToString(type);
      this.failIfBannedIndexReference(node, typeName);
    }
  }
}

export class Rule extends Lint.Rules.TypedRule {
  public static FAILURE_STRING = 'index signature property access not allowed';

  public applyWithProgram(
    sourceFile: ts.SourceFile,
    program: ts.Program
  ): Lint.RuleFailure[] {
    return this.applyWithWalker(
      new NoIndexSignatureAccess(sourceFile, this.getOptions(), program)
    );
  }
}
