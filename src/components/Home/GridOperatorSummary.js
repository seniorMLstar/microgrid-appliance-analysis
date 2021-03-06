import * as React from 'react'
import { get } from 'lodash'
import { Table } from 'semantic-ui-react'
import { inject, observer } from 'mobx-react'
import { UnmetLoadHelperPopup } from '../Elements/HelperPopup/UnmetLoadHelperPopup'

const GridOperatorSummary = ({ store }) => {
  const { summaryStats: stats } = store

  // Financials
  const newApplianceYearlyKwh = get(stats, 'newApplianceYearlyKwh', '-')
  const newApplianceElectricityRevenue = get(stats, 'newApplianceElectricityRevenue')
  const newApplianceElectricityCost = get(stats, 'newApplianceElectricityCost')
  const newApplianceUnmetLoadCost = get(stats, 'newApplianceUnmetLoadCost', '-')
  const newApplianceNetRevenue = get(stats, 'newApplianceNetRevenue', '-')

  // Original unmet loads
  const originalUnmetLoadCount = get(stats, 'originalUnmetLoadCount', '-')
  const originalUnmetLoadCountPercent = get(stats, 'originalUnmetLoadCountPercent', '-')
  const originalUnmetLoadSum = get(stats, 'originalUnmetLoadSum', '-')

  // Additional unmet loads
  const additionalUnmetLoadCount = get(stats, 'additionalUnmetLoadCount', '-')
  const additionalUnmetLoadCountPercent = get(stats, 'additionalUnmetLoadCountPercent', '-')
  const additionalUnmetLoadSum = get(stats, 'additionalUnmetLoadSum', '-')

  // Total unmet loads
  const newTotalUnmetLoadCount = get(stats, 'newTotalUnmetLoadCount', '-')
  const newTotalUnmetLoadCountPercent = get(stats, 'newTotalUnmetLoadCountPercent', '-')
  const newTotalUnmetLoadSum = get(stats, 'newTotalUnmetLoadSum', '-')

  return (
    <div>
      {/* Yearly summary stats */}
      <Table basic="very" celled collapsing compact>
        <Table.Body>
          <Table.Row>
            <Table.Cell>Yearly new appliance kWh</Table.Cell>
            <Table.Cell>{newApplianceYearlyKwh} kWh</Table.Cell>
          </Table.Row>
          <Table.Row>
            <Table.Cell>Yearly new appliance revenue</Table.Cell>
            <Table.Cell>${newApplianceElectricityRevenue}</Table.Cell>
          </Table.Row>
          <Table.Row>
            <Table.Cell>Yearly new appliance electricity cost</Table.Cell>
            <Table.Cell>${newApplianceElectricityCost}</Table.Cell>
          </Table.Row>
          <Table.Row>
            <Table.Cell>New appliance unmet load cost</Table.Cell>
            <Table.Cell>${newApplianceUnmetLoadCost}</Table.Cell>
          </Table.Row>
          <Table.Row>
            <Table.Cell>New appliance net revenue</Table.Cell>
            <Table.Cell>${newApplianceNetRevenue}</Table.Cell>
          </Table.Row>
        </Table.Body>
      </Table>

      {/* Unmet Load Table */}
      <Table definition basic compact>
        <Table.Header>
          <Table.Row>
            <Table.HeaderCell />
            <Table.HeaderCell>
              Count <em>hrs/year</em> <UnmetLoadHelperPopup />
            </Table.HeaderCell>
            <Table.HeaderCell>
              Sum <em>kWh</em>
            </Table.HeaderCell>
            <Table.HeaderCell>Percent of Year</Table.HeaderCell>
          </Table.Row>
        </Table.Header>
        <Table.Body>
          <Table.Row>
            <Table.Cell>Original unmet load</Table.Cell>
            <Table.Cell>{originalUnmetLoadCount}</Table.Cell>
            <Table.Cell>{originalUnmetLoadSum}</Table.Cell>
            <Table.Cell>{originalUnmetLoadCountPercent}%</Table.Cell>
          </Table.Row>
          <Table.Row>
            <Table.Cell>Additional unmet load</Table.Cell>
            <Table.Cell>{additionalUnmetLoadCount}</Table.Cell>
            <Table.Cell>{additionalUnmetLoadSum}</Table.Cell>
            <Table.Cell>{additionalUnmetLoadCountPercent}%</Table.Cell>
          </Table.Row>
          <Table.Row>
            <Table.Cell>Total unmet load</Table.Cell>
            <Table.Cell>{newTotalUnmetLoadCount}</Table.Cell>
            <Table.Cell>{newTotalUnmetLoadSum}</Table.Cell>
            <Table.Cell>{newTotalUnmetLoadCountPercent}%</Table.Cell>
          </Table.Row>
        </Table.Body>
      </Table>
    </div>
  )
}

export default inject('store')(observer(GridOperatorSummary))
