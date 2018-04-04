import React from 'react'
import PropTypes from 'prop-types'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import * as DevicesActions from 'actions/devices'

class DevicesContainer extends React.Component {
  static propTypes = {
    fetchInstances: PropTypes.func.isRequired,
    fetchDevices: PropTypes.func.isRequired,
    fetchDevice: PropTypes.func.isRequired,
    device: PropTypes.shape({
      metrics: PropTypes.object
    }).isRequired
  }


  componentDidMount() {
    this.props.fetchInstances()
    this.props.fetchDevices()

    setInterval(() => {
      this.props.fetchDevice('ZWayVDev_zway_3-0-49-3')
    }, 2000);
  }

  componentWillReceiveProps(nextProps) {
    console.log(nextProps.device);
  }

  render() {
    const { metrics } = this.props.device
    return (
      <div>{metrics.probeTitle}: {metrics.level} {metrics.scaleTitle}</div>
    )
  }
}

const mapStateToProps = (state) => ({
  device: state.device
})

function mapDispatchToProps(dispatch) {
  return bindActionCreators(DevicesActions, dispatch)
}

export default connect(mapStateToProps, mapDispatchToProps)(DevicesContainer)
