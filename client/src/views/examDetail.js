import * as React from 'react'
import ReactTable from 'react-table'
import { connect } from 'react-redux'
import { Toast } from 'antd-mobile'
import PropTypes from 'prop-types'
import { getExamInfo } from '@/utils/api'
import 'react-table/react-table.css'

class ExamDetail extends React.Component {
  static propTypes = {
    token: PropTypes.string.isRequired,
    match: PropTypes.shape({
      params: PropTypes.shape({
        examid: PropTypes.string.isRequired
      }).isRequired
    }).isRequired
  }

  state = {
    tableData: []
  }

  async componentDidMount () {
    const { token, match } = this.props
    const scores = await getExamInfo({ticket: token, examGuid: match.params.examid})
    if (scores.code === 0) {
      this.setState({tableData: scores.data})
    } else {
      Toast.fail(scores.msg)
    }
  }

  render () {
    const levelMap = ['😞', '😐', '🙂']
    return (
      <div>
        <ReactTable
          data={this.state.tableData}
          columns={[{
            Header: '科目',
            accessor: 'subject',
            sortable: false,
            width: '25%',
            style: {'textAlign': 'center'}
          }, {
            Header: '得分',
            accessor: 'score',
            width: '25%',
            resizable: false,
            style: {'textAlign': 'center'}
          }, {
            Header: '总分',
            accessor: 'total',
            width: '25%',
            resizable: false,
            style: {'textAlign': 'center'}
          }, {
            Header: '状态',
            accessor: 'level',
            width: '25%',
            resizable: false,
            style: {'textAlign': 'center'},
            Cell: row => (
              <span>{levelMap[row.value]}</span>
            )
          }]}
          defaultPageSize={10}
          className="-striped -highlight"
        />
      </div>
    )
  }
}

const mapStateToProps = state => {
  return {
    token: state.login.token
  }
}

export default connect(mapStateToProps)(ExamDetail)
