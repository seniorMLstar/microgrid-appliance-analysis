## Battery charging problem
- [x] Create new page for battery characterization
- [ ] Create model of battery State of Charge based on electricalProductionLoadDiff and prevBatterySOC (tensorflow)
- [x] Do tensorflow.js examples:
    * https://github.com/tensorflow/tfjs-examples/tree/master/boston-housing
    * https://github.com/tensorflow/tfjs-examples/tree/master/polynomial-regression-core
    * https://github.com/tensorflow/tfjs-examples/tree/master/polynomial-regression
- [x] Create derived column productionLoadDiff = PV Power Output - Total Electrical Load Served. Instead of pulling from only PV Power Output, it needs to also take into account diesel or other generation. I should probably create an additional variable. So create 2:
    - totalElectricalProduction (right now it only includes PV Power Output)
    - totalElectricalLoadServed (Total Electrical Load Served)
    - electricalProductionLoadDiff
- [ ] Lay out battery page with
    - training progress
    - predicted vs actual values
    - Sorted Weights
    - Score

## TODO:
- [ ] Check that HOMER and Appliance file has required fields (including battery and pvSystem)
- [ ] Indicator that we are currently calculating
- [ ] Deploy Sentry to production
- [ ] Unmet load sums by hour, by day. Try 100% stacked.
- [ ] A new bar chart: (histogram by hour)
    - [ ] New appliance load
    - [ ] Excess production
- [ ] Render appliance summary stats
- [ ] Min State of chart is fragile. Find a more robust way of finding the floor
- [ ] Add hour offset input(?)
- [ ] Parse Table dates
    - [ ] Show chart by datetime instead of hour of year (toggle between hour and datetime)
    - [ ] Page through datetime chart by day, week, month
- [ ] Show column stats (max, min, avg, std) for HOMER and combined tables


## TODO: Long term
- [ ] Reference Lines: http://recharts.org/en-US/examples/LineChartWithReferenceLines
- [ ] Load other HOMER and appliance files in the background
- [ ] Snake case all header names. I can have a lookup to display them nicely (generic_1_k_wh_lead_acid_asm_energy_content)
- [ ] Measure battery capacity in the field and compare with HOMER models. Quantify


## Done
- [x] Speed up calcs by not merging tables - just keep calculated columns in their own data structure. Pass all of those data structures into React Virtualized to display them but not merge them. That will save ~1second per update
- [x] Replace combinedTable with calculatedColumns
- [x] Consolidate all util functions into a single file
- [x] Remove activeHomer.keyOrder and just pass the table. Search for
    * activeHomer.tableData and tableData
    * activeHomer.keyOrder and keyOrder
- [?] Pass in both and calculatedColumns and activeHomer into summaryStats()
- [x] Color headers in homer, appliance and combined
- [x] Render kw_factor from appliance (and color it) in CombinedTable
- [x] Check that combined table matches deployed production app
- [x] Color Combined Table columns to show calculated columns
- [x] Met and unmet demand didn't change in percent no matter what appliance. It was driven by system type.
    * This is working correctly

- [x] Round kw_factor, round homer values
- [x] Parse all dates to ISO 8606, reformat for display in tables
- [x] Create a better error for when a file isn't found (currently it's found in the csv parsing step and things the rows aren't correct)
- [x] Sentry should only trigger on production
- [x] Make sure all tables update when changing data:
    - [x] Appliance table: change  appliance
    - [x] HOMER table: change HOMER
    - [x] CombinedTable: modelInputs, HOMER file change, Appliance file change
    - [x] Unmet loads update with modelInput, HOMER and Appliance changes
- [x] Add Grid to top of every table, add is loader spinner
- [x] Write 'renders without crashing' tests for all components
- [x] Rename battery from 'Generic 1 kWh Lead Acid [ASM]' to Battery through


__________________________________________________________________

## Battery charge calculation notes

Goal: Calculate Battery SOC for every hour. Use the spreadsheet values without new loads applied to generate the SoC based on loads we know.

The SOC depends on:
* Charge/Discharge rate. These depend on
    * Excess
    * Demand
* Previous hour's SOC

The predictive model may just want to calculate Charge Rate and Discharge Rate (or Max Charge Rate and Max Discharge Rate)

- Removing
    * Available Capacity: Because it depends on Excess Electrical, SoC and Energy Content for the given row.