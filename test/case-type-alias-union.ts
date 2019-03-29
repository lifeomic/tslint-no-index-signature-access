type TypeWithIndex2 = {
  prop1: string;
  throw(): void;
  [otherProps: string]: any;
};

type UnionWithType2 = {
  prop2: string;
} & TypeWithIndex2;

const val2: UnionWithType2 = {
  prop1: 'value',
  prop2: 'value2',
  throw: () => void 0
};
const v2 = val2.prop3;
// Allow references to defined properties on the unioned type
val2.prop1;
// Allow references to functions on the unioned type
val2.throw();
