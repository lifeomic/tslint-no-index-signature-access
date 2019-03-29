class TypeWithIndexParent {
  prop1: string;
  [otherProps: string]: string;
}

class ChildClass extends TypeWithIndexParent {}

const child: ChildClass = { prop1: 'value' };
child.prop2;
// Allow references to defined properties on the parent class
child.prop1;
