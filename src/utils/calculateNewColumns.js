import _ from 'lodash'

/**
 * Pass in the merged table that includes Homer and Usage factors
 * Also pass in adjustable fields from store and constants that are required
 * to do the calculations
 */
export function calculateNewLoads({ homer, appliance, modelInputs, homerStats, constants }) {
  if (_.isEmpty(homer) || _.isEmpty(appliance)) {
    return null
  }
  const t0 = performance.now()

  const { effectiveMinBatteryEnergyContent, minbatterySOC } = homerStats

  // Reducer function. This is needed so that we can have access to values in
  // rows we previously calculated
  const columnReducer = (result, row, rowIndex, rows) => {
    // Get the previous HOMER row (from the original rows, not the new calculated rows)
    const prevRow = rowIndex === 0 ? {} : rows[rowIndex - 1]

    // Get the matching row for the appliance
    const applianceRow = appliance[rowIndex]

    // Get the previous row from the calculated results (the reason for the reduce function)
    const prevResult = rowIndex === 0 ? {} : result[rowIndex - 1]

    // Get existing values from the current row we are iterating over:
    // Excess electrical production:  Original energy production minus original load (not new
    // appliances) when the battery is charging as fast as possible
    const excessElecProd = row['Excess Electrical Production']
    const batteryEnergyContent = row['Battery Energy Content']
    const batterySOC = row['Battery State of Charge']

    const prevBatteryEnergyContent =
      rowIndex === 0 ? row['Battery Energy Content'] : prevRow['Battery Energy Content']

    const prevBatterySOC =
      rowIndex === 0 ? row['Battery State of Charge'] : prevRow['Battery State of Charge']

    // TODO: Eventually add other generation to this value
    const totalElectricalProduction = row['PV Power Output']

    // electricalProductionLoadDiff defines whether we are producing excess (positive)
    // or in deficit (negative).
    // If excess (positive), `Inverter Power Input` kicks in
    // If deficit (negative), `Rectifier Power Input` kicks in
    const electricalProductionLoadDiff =
      totalElectricalProduction - row['Total Electrical Load Served']

    // Some of these numbers from HOMER are -1x10-16
    const originalUnmetLoad = _.round(row['Unmet Electrical Load'], 6)

    // Calculate load profile from usage profile
    const newApplianceLoad =
      applianceRow['kw_factor'] * modelInputs['kwFactorToKw'] * modelInputs['dutyCycleDerateFactor']

    if (!_.isFinite(newApplianceLoad)) {
      throw new Error(
        `newApplianceLoad did not calculate properly. Check your file has all required columns and that all values are finite. Row: ${JSON.stringify(
          applianceRow
        )}. Also make sure modelInputs are numbers and not strings or undefined: ${JSON.stringify(
          modelInputs
        )}`
      )
    }

    /*
     * Now calculate new values based on the HOMER and usage profiles
     */
    // The energy content above what HOMER (or the user) decides is the minimum
    // Energy content the battery should have
    const energyContentAboveMin = batteryEnergyContent - effectiveMinBatteryEnergyContent

    // Find available capacity (kW) before the new appliance is added
    const availableCapacity =
      excessElecProd + (batterySOC <= minbatterySOC ? 0 : energyContentAboveMin)

    // Find available capacity after the new appliance is added
    const availableCapacityAfterNewLoad = availableCapacity - newApplianceLoad

    // Is there an unmet load after the new appliance is added?
    // If there is no available capacity (or goes negative) after the new appliance
    // is added, then the unmet load equals that (negative) "available" capacity
    const additionalUnmetLoad =
      availableCapacityAfterNewLoad > 0 ? 0 : -availableCapacityAfterNewLoad

    // Add up the original unmet load with no new appliance and now the additional
    // unmet load now that we have a new appliance on the grid
    const newTotalUnmetLoad = originalUnmetLoad + additionalUnmetLoad

    // Battery consumption (kW) now that we have a new appliance on the grid.
    // If the new appliance load is greater than the excess electrical production, we are
    // draining the battery by the difference between new load and the excess production.
    // If the excess electrical production is greater than the new appliance load, then we
    // aren't draining the battery.
    // excessElecProd is the excess after taking into acount the original load
    const newApplianceBatteryConsumption =
      newApplianceLoad > excessElecProd ? newApplianceLoad - excessElecProd : 0

    // Original Battery Energy Content Delta
    // This is how much the energy content in the battery has increased or decreased in
    // the last hour. First row is meaningless when referencing previous row, so set it to zero
    const originalBatteryEnergyContentDelta =
      rowIndex === 0 ? 0 : batteryEnergyContent - prevBatteryEnergyContent

    // New Appliance Battery Energy Content:
    // The battery energy content under the scenario of adding a new appliance.
    // This requires us to look at the energy content of the battery from the previous hour,
    // which means we need to look at the previous row than the one we are iterating over.
    // This is why these values are being calculated in a reducing function instead of a map
    const prevNewApplianceBatteryEnergyContent =
      rowIndex === 0 ? 0 : prevResult['newApplianceBatteryEnergyContent']

    const newApplianceBatteryEnergyContent =
      rowIndex === 0
        ? // For the first hour: We just look at the energy content of the battery
          // and how much a new appliance would use from the battery:
          batteryEnergyContent - newApplianceBatteryConsumption
        : // For hours after that, we need to take the perspective of the battery if a new
          // appliance was added. Take the battery energy content we just calculated from the
          // previous hour:
          prevNewApplianceBatteryEnergyContent +
          // Add how much energy content was added or removed from the original load:
          originalBatteryEnergyContentDelta -
          // Now subtract out any battery consumption the new appliance would use
          newApplianceBatteryConsumption

    result.push({
      hour: row['hour'],
      datetime: row['Time'],
      hour_of_day: applianceRow['hour_of_day'],
      day: applianceRow['day'],
      day_hour: applianceRow['day_hour'],
      // kw_factor: applianceRow['kw_factor'],
      totalElectricalProduction: _.round(totalElectricalProduction, 4),
      electricalProductionLoadDiff: _.round(electricalProductionLoadDiff, 4),
      prevBatterySOC: _.round(prevBatterySOC, 4),
      prevBatteryEnergyContent: _.round(prevBatteryEnergyContent, 4),
      newApplianceLoad: _.round(newApplianceLoad, 4),
      energyContentAboveMin: _.round(energyContentAboveMin, 4),
      availableCapacity: _.round(availableCapacity, 4),
      availableCapacityAfterNewLoad: _.round(availableCapacityAfterNewLoad, 4),
      // Unmet load counts are very sensitive to how many decimals you round to
      // Rounding to 3 decimals filters out loads less than 1 watthour
      // Rounding to 0 decimals filters out loads less than 1 kWh
      // Amanda decided to filter out anything less than 100 watthours (1 decimal)
      originalUnmetLoad: _.round(originalUnmetLoad, 1),
      additionalUnmetLoad: _.round(additionalUnmetLoad, 1),
      newTotalUnmetLoad: _.round(newTotalUnmetLoad, 1),
      newApplianceBatteryConsumption: _.round(newApplianceBatteryConsumption, 4),
      originalBatteryEnergyContentDelta: _.round(originalBatteryEnergyContentDelta, 4),
      newApplianceBatteryEnergyContent: _.round(newApplianceBatteryEnergyContent, 4),
    })
    return result
  }

  // Iterate over homer data, pushing each new row into an array
  const calculatedColumns = _.reduce(homer, columnReducer, [])
  const t1 = performance.now()
  console.log('calculateNewLoads took ' + _.round(t1 - t0) + ' milliseconds.')
  return calculatedColumns
}
