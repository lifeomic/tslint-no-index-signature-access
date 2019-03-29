class TypeWithIndex3 {
  prop1: string;
  [otherProps: string]: string;
}

const instance3: TypeWithIndex3 = { prop1: 'value' };
const v3 = instance3.prop2;
