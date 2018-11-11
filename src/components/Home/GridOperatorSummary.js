import * as React from 'react'
import _ from 'lodash'
import { Table } from 'semantic-ui-react'
import { inject, observer } from 'mobx-react'
// import { TinyBarChart } from '../Charts/TinyBar'

const GridOperatorSummary = ({ store }) => {
  const { summaryStats } = store
  const additionalUnmetLoadCount = _.get(summaryStats, 'additionalUnmetLoadCount', '-')
  const additionalUnmetLoadCountPercent = _.get(
    summaryStats,
    'additionalUnmetLoadCountPercent',
    '-'
  )
  const additionalUnmetLoadSum = _.get(summaryStats, 'additionalUnmetLoadSum', '-')
  // const additionalUnmetLoadHist = _.get(summaryStats, 'additionalUnmetLoadHist', [])

  const newTotalUnmetLoadCount = _.get(summaryStats, 'newTotalUnmetLoadCount', '-')
  const newTotalUnmetLoadCountPercent = _.get(summaryStats, 'newTotalUnmetLoadCountPercent', '-')
  const newTotalUnmetLoadSum = _.get(summaryStats, 'newTotalUnmetLoadSum', '-')
  // const newTotalUnmetLoadHist = _.get(summaryStats, 'newTotalUnmetLoadHist', [])

  return (
    <Table basic="very" celled collapsing>
      <Table.Body>
        <Table.Row>
          <Table.Cell>New Unmet Load Count</Table.Cell>
          <Table.Cell>
            {additionalUnmetLoadCount} hr/year <em> ({additionalUnmetLoadCountPercent} %)</em>
          </Table.Cell>
        </Table.Row>
        <Table.Row>
          <Table.Cell>New Unmet Load Sum</Table.Cell>
          <Table.Cell>{additionalUnmetLoadSum} kWh</Table.Cell>
        </Table.Row>
        {/* <Table.Row>
          <Table.Cell>New Unmet Load By Hour</Table.Cell>
          <Table.Cell>
            <TinyBarChart
              data={additionalUnmetLoadHist}
              x="hour_of_day"
              y="additionalUnmetLoad"
              domain={[0, 23]}
            />
          </Table.Cell>
        </Table.Row> */}

        <Table.Row>
          <Table.Cell>Total Unmet Load Count</Table.Cell>
          <Table.Cell>
            {newTotalUnmetLoadCount} hr/year <em> ({newTotalUnmetLoadCountPercent} %)</em>
          </Table.Cell>
        </Table.Row>
        <Table.Row>
          <Table.Cell>Total Unmet Load Sum</Table.Cell>
          <Table.Cell>{newTotalUnmetLoadSum} kWh</Table.Cell>
        </Table.Row>
        {/* <Table.Row>
          <Table.Cell>New Total Unmet Load By Hour</Table.Cell>
          <Table.Cell>
            <TinyBarChart
              data={newTotalUnmetLoadHist}
              x="hour_of_day"
              y="newTotalUnmetLoad"
              domain={[0, 23]}
            />
          </Table.Cell>
        </Table.Row> */}
      </Table.Body>
    </Table>
  )
}

export default inject('store')(observer(GridOperatorSummary))
