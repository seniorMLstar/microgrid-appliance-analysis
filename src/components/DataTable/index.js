import * as React from 'react'
import { observer, inject } from 'mobx-react'
import _ from 'lodash'
import { AutoSizer, MultiGrid } from 'react-virtualized'
import LoaderSpinner from '../Elements/Loader'
import { Loader, Grid } from 'semantic-ui-react'
import { setHeaderStyles } from '../../styles/tableStyles'
import { greyColors } from '../../utils/constants'
import { formatDateForTable } from '../../utils/helpers'
import ColumnSelector from '../Elements/ColumnSelector'
import {
  columnHeaderByTableType,
  combinedColumnHeaderUnits,
  combinedColumnHeaderOrder,
} from '../../utils/columnHeaders'

class DataTable extends React.Component {
  _cellRenderer = (filteredCombinedTableHeaders, { columnIndex, key, rowIndex, style }) => {
    const { combinedTable } = this.props.store
    if (_.isEmpty(combinedTable)) {
      return null
    }
    const headerRowCount = 2 // column header name and units
    const columnHeader = filteredCombinedTableHeaders[columnIndex]
    const tableType = columnHeaderByTableType[columnHeader]

    // Column header name
    if (rowIndex === 0) {
      return (
        <div key={key} style={setHeaderStyles(style, rowIndex, tableType)}>
          {columnHeader}
        </div>
      )
    }

    // Column header units
    if (rowIndex === 1) {
      return (
        <div key={key} style={setHeaderStyles(style, rowIndex, tableType)}>
          {combinedColumnHeaderUnits[columnHeader] || 'missing'}
        </div>
      )
    }

    // All other rows
    if (columnHeader === 'datetime') {
      return (
        <div key={key} style={setHeaderStyles(style, rowIndex, tableType)}>
          {formatDateForTable(combinedTable[rowIndex - headerRowCount][columnHeader])}
        </div>
      )
    }
    return (
      <div key={key} style={setHeaderStyles(style, rowIndex, tableType)}>
        {combinedTable[rowIndex - headerRowCount][columnHeader]}
      </div>
    )
  }

  _rowHeight = ({ index }) => {
    return index === 0 ? 76 : 26
  }

  // This table updates if the HOMER file, appliance or model inputs changes.
  // React Virtualized aggressively caches & prevents updates even for props changes
  componentDidUpdate(prevProps) {
    if (this.multigrid) {
      this.multigrid.forceUpdateGrids()
    }
  }

  render() {
    const {
      combinedTable,
      filteredCombinedTableHeaders,
      homerIsLoading,
      activeHomerFileInfo,
    } = this.props.store
    if (_.isEmpty(combinedTable)) {
      return <LoaderSpinner />
    }
    const rowCount = _.size(combinedTable)
    const columnCount = _.size(filteredCombinedTableHeaders)
    return (
      <Grid>
        <Grid.Row>
          <Grid.Column width={6}>
            <h3>
              {activeHomerFileInfo.label} <br />
              <small style={{ color: greyColors[1] }}>{activeHomerFileInfo.description}</small>{' '}
              {homerIsLoading ? <Loader active inline size="mini" /> : <span />}
            </h3>
          </Grid.Column>
          <Grid.Column width={10}>
            <ColumnSelector headers={combinedColumnHeaderOrder} />
          </Grid.Column>
        </Grid.Row>
        <Grid.Row>
          <AutoSizer>
            {({ height, width }) => (
              <MultiGrid
                ref={c => (this.multigrid = c)}
                cellRenderer={this._cellRenderer.bind(null, filteredCombinedTableHeaders)}
                columnCount={columnCount}
                columnWidth={100}
                fixedColumnCount={2}
                fixedRowCount={2}
                height={1200}
                rowCount={rowCount}
                rowHeight={this._rowHeight}
                estimatedRowSize={26}
                width={width}
              />
            )}
          </AutoSizer>
        </Grid.Row>
      </Grid>
    )
  }
}

export default inject('store')(observer(DataTable))
