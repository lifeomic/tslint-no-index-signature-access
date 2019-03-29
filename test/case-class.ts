type TypeWithIndex1 = {
  prop1: string;
  [otherProps: string]: string;
};

const temp: TypeWithIndex1 = { prop1: 'value' };
const v1 = temp.prop2;
