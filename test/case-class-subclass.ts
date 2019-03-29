class TypeWithIndexParent {
  prop1: string;
  throw() {
    return void 0;
  }
  [otherProps: string]: any;
}

class ChildClass extends TypeWithIndexParent {}

const child: ChildClass = new ChildClass();
child.prop2;
// Allow references to defined properties on the parent class
child.prop1;
// Allow references to functions on the parent class
child.throw();
