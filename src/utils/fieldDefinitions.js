const jsonSchemaStandard = 'http://json-schema.org/draft-04/schema#'

// These are just example schemas to test the input component
// Every appliance will have it's own set as well as an app-wide set

// Will be converted to typescript types:
// https://spin.atomicobject.com/2018/03/26/typescript-data-validation/

export const fieldDefinitions = {
  kwFactorToKw: {
    $schema: jsonSchemaStandard,
    title: 'kW Factor to kW',
    type: 'float',
    minimum: 0,
    maximum: 2,
    step: 0.1,
    defaultValue: 0.5,
    units: '-',
  },

  dutyCycleDerateFactor: {
    $schema: jsonSchemaStandard,
    title: 'Duty Cycle Derate Factor',
    type: 'float',
    minimum: 0,
    maximum: 2,
    step: 0.05,
    defaultValue: 1,
    units: '-',
  },

  // Example with min and max, which is editable
  // grainThroughput: {
  //   $schema: jsonSchemaStandard,
  //   title: 'Grain Mill Throughput',
  //   type: 'integer', // Should this be 'number' for typescript?
  //   minimum: 200,
  //   maximum: 400,
  //   step: 10,
  //   defaultValue: 300,
  //   units: 'kg/hour',
  // },

  // Example with no min and max, so this is not editable
  // nominalAppliancePower: {
  //   $schema: jsonSchemaStandard,
  //   title: 'Nominal Appliance Power',
  //   subtitle: 'some subtitle',
  //   type: 'integer',
  //   defaultValue: 6000,
  //   unit: 'W',
  // },

  // Smaller steps
  // nominalMotorVoltage: {
  //   $schema: jsonSchemaStandard,
  //   title: 'Nominal Motor Voltage',
  //   type: 'integer',
  //   minimum: 200,
  //   maximum: 280,
  //   step: 1,
  //   defaultValue: 240,
  //   precision: 0, // If we have a precision of 0, does that defined an integer
  //   unit: 'Volts',
  // },

  // One possible key is isConstant = true, which will make the field non-editable
}
