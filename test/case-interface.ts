interface TypeWithIndexInterface {
  prop1: string;
  [otherProps: string]: string;
}

const interfaceInstance: TypeWithIndexInterface = { prop1: 'value' };
interfaceInstance.prop2;
