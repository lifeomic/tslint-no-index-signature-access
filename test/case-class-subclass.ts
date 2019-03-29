class TypeWithIndexParent {
  prop1: string;
  [otherProps: string]: string;
}

class ChildClass extends TypeWithIndexParent {}

const child: ChildClass = { prop1: 'value' };
const childP2 = child.prop2;
