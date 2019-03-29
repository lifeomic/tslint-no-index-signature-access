interface TypeWithIndexInterfaceExtended {
  prop1: string;
  throw(): void;
  [otherProps: string]: any;
}

interface ExtendedInterface extends TypeWithIndexInterfaceExtended {}

const extendedInstance: ExtendedInterface = {
  prop1: 'value',
  throw: () => void 0
};
// This refrence should be caught
extendedInstance.prop2;
// Allow references to defined properties on the extended interface
extendedInstance.prop1;
// Allow references to defined functions on the extended interface
extendedInstance.throw();
