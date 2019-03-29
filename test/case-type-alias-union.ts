type TypeWithIndex2 = {
  prop1: string;
  [otherProps: string]: string;
};

type UnionWithType2 = {
  prop2: string;
} & TypeWithIndex2;

const val2: UnionWithType2 = { prop1: 'value', prop2: 'value2' };
const v2 = val2.prop3;
// Allow references to defined properties on the unioned type
val2.prop1;
