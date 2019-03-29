interface TypeWithIndexInterfaceExtended {
  prop1: string;
  [otherProps: string]: string;
}

interface ExtendedInterface extends TypeWithIndexInterfaceExtended {}

const extendedInstance: ExtendedInterface = { prop1: 'value' };
extendedInstance.prop2;
// Allow references to defined properties on the extended interface
extendedInstance.prop1;
