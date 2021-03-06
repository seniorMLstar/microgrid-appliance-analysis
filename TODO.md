# TODO

## Steps In progress

- Is taking the mean of an average ok? Should I try with Energy content (that doesn't solve the probably above with electricalProductionLoadDiff)

## Battery charging problem

- [ ] Fix problems with predictions: test different models:

  - [ ] Check that I have the correct shape. When using this function in the example repo: `[1, _.size(featureDescriptions)]`
    - > Error: Error when checking : expected dense_Dense1_input to have shape [null,12] but got array with shape [12,1].
  - [x] Make sure training and test data is lined up correctly (features line up with targets)
  - [x] Try LOTS of epochs (50)
  - [x] Plot Predicted vs. Actual in Tensorflow examples to compare with this one
  - [x] multiLayerPerceptronRegressionModel1Hidden and multiLayerPerceptronRegressionModel2Hidden
  - [x] Use and optimize linearRegressionModel layers using DSS
  - [x] Understand data normalization better and make sure I'm doing it correctly. XGBoost worked well, but also works well with unnormalized data, which means I may not be normalizing it correctly (gracefully handles un-normalized or missing data, while being accurate and fast to train)
  - [x] Use different splits of the data
  - [x] Check how validation is done in the current script
  - [ ] Split battery model into it's own store

- [ ] Fix productionLoadDiff: It should be Total Renewable Power Output - Total Electrical Load Served (won't affect calculations yet)
- [ ] Add button that retrains model
- [ ] Save trained model to localstorage: https://js.tensorflow.org/api/0.14.1/#tf.Model.save

## Table fixes

- [x] Only add column headers and units when rendering table (don't store those with the data)
- [x] Calculate new combinedColumnHeaderOrder as a computed function in store based on excluded columns
- [x] Add Column Selector to combined table
- [x] Filter columns in combined table
- [x] Store column filters in localstorage
- [x] **_Make sure table updates on homer or appliance change_**
- [ ] Consolidate tables
  - [ ] Comment out appliance and HOMER table
  - [ ] Put battery stats in Battery Energy Content tab
- [ ] Have hover tooltip in column indicator. Click turns it on or off
- [ ] Turn on or off blocks of columns in with the legend
- [ ] Clean up styling in column selector indicator
- [ ] Color code dropdown column selector menu (and decrease line height)
- [ ] Add Hover on table

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
- [ ] Dropdown of selects for keeping and removing table colums

# Done

- [x] Speed up calcs by not merging tables - just keep calculated columns in their own data structure. Pass all of those data structures into React Virtualized to display them but not merge them. That will save ~1second per update
- [x] Replace combinedTable with calculatedColumns
- [x] Consolidate all util functions into a single file
- [x] Remove activeHomer.keyOrder and just pass the table. Search for
  - activeHomer.tableData and tableData
  - activeHomer.keyOrder and keyOrder
- [?] Pass in both and calculatedColumns and activeHomer into summaryStats()
- [x] Color headers in homer, appliance and combined
- [x] Render kw_factor from appliance (and color it) in CombinedTable
- [x] Check that combined table matches deployed production app
- [x] Color Combined Table columns to show calculated columns
- [x] Met and unmet demand didn't change in percent no matter what appliance. It was driven by system type.

  - This is working correctly

- [x] Round kw_factor, round homer values
- [x] Parse all dates to ISO 8606, reformat for display in tables
- [x] Create a better error for when a file isn't found (currently it's found in the csv parsing step and things the rows aren't correct)
- [x] Sentry should only trigger on production
- [x] Make sure all tables update when changing data:
  - [x] Appliance table: change appliance
  - [x] HOMER table: change HOMER
  - [x] CombinedTable: modelInputs, HOMER file change, Appliance file change
  - [x] Unmet loads update with modelInput, HOMER and Appliance changes
- [x] Add Grid to top of every table, add is loader spinner
- [x] Write 'renders without crashing' tests for all components
- [x] Rename battery from 'Generic 1 kWh Lead Acid [ASM]' to Battery through

## Battery Charging Characterization

- [x] Pass in battery data and break into training and test data. Refer to https://towardsdatascience.com/train-test-split-and-cross-validation-in-python-80b61beca4b6
  - trainFeaturesArray,
  - trainTargetArray,
  - testFeaturesArray,
  - testTargetArray
- [x] Convert to normalized tensors
- [x] Create model of battery State of Charge based on electricalProductionLoadDiff and prevBatterySOC (tensorflow)
- [x] Lay out battery page with
  - training progress
  - predicted vs actual values
  - Sorted Weights
  - Score
- [x] Create derived column productionLoadDiff = PV Power Output - Total Electrical Load Served. Instead of pulling from only PV Power Output, it needs to also take into account diesel or other generation. I should probably create an additional variable. So create 2:
- [x] Create new page for battery characterization
- [x] Save trained model to store
- [x] Generate predicted vs actual values
  - https://stackoverflow.com/questions/50123067/tensorflow-js-model-predict-prints-tensor-nan
- [x] Chart predicted vs actual

---

## Battery charge calculation notes

Goal: Calculate Battery SOC for every hour. Use the spreadsheet values without new loads applied to generate the SoC based on loads we know.

The SOC depends on:

- Charge/Discharge rate. These depend on
  - Excess
  - Demand
- Previous hour's SOC

The predictive model may just want to calculate Charge Rate and Discharge Rate (or Max Charge Rate and Max Discharge Rate)

- Removing
  - Available Capacity: Because it depends on Excess Electrical, SoC and Energy Content for the given row.

---
