import React from 'react'
import PropTypes from 'prop-types'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import * as DevicesActions from 'actions/devices'
import ConnectSocket from 'utils/connectSocket'
import styled from 'styled-components'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts'
import moment from 'moment'

class DevicesContainer extends React.Component {
  static propTypes = {
    device: PropTypes.shape({
      devices: PropTypes.arrayOf(PropTypes.object),
      selected: PropTypes.shape({
        browseName: PropTypes.string,
        hasComponent: PropTypes.array,
      }),
    }).isRequired,
    fetchDevices: PropTypes.func.isRequired,
    selectDevice: PropTypes.func.isRequired,
    selectTag: PropTypes.func.isRequired,
  }

  constructor(props) {
    super(props)

    this.state = {
      chart: [{ name: moment().format('DD.MM.YY HH:mm:ss'), value: 0 }],
    }

    this.io = new ConnectSocket()

    this.io.socket.on('tagChange', data => {
      this.changedTag(data)
    })

    // this.socket.on('tagChange', (tag) => {
    //   console.log(tag);
    // })
  }

  componentDidMount() {
    this.props.fetchDevices()
  }

  changedTag(data) {
    const currentChart = [...this.state.chart]

    currentChart.push({
      name: moment().format('DD.MM.YY HH:mm:ss'),
      value: data.value,
    })

    console.log('>>>', currentChart)
    if (currentChart.length > 20) {
      currentChart.shift()
    }

    this.setState({
      ...this.state,
      chart: currentChart,
    })
  }

  render() {
    return (
      <Container>
        <Aside>
          <AsideTitle>Devices List</AsideTitle>
          {this.props.device.devices.filter(d => d.componentsCount > 0).map(device => (
            <AsideItem onClick={() => this.props.selectDevice(device)} key={device._id}>
              {device.browseName}
            </AsideItem>
          ))}
        </Aside>
        <Content>
          {!!this.props.device.selected.browseName && (
            <Tags>
              <SelectedTitle>{this.props.device.selected.browseName}</SelectedTitle>

              {!!(this.props.device.selected.hasComponent && this.props.device.selected.hasComponent.length) && (
                <TagsList>
                  {this.props.device.selected.hasComponent.map(component => (
                    <AsideItem key={component.nodeId} onClick={() => this.props.selectTag(component)}>
                      {component.browseName}
                    </AsideItem>
                  ))}
                </TagsList>
              )}
            </Tags>
          )}
          <View>
            <LineChart width={800} height={400} data={this.state.chart} margin={{ top: 5, bottom: 5 }}>
              <XAxis dataKey="name" />
              <YAxis />
              <CartesianGrid strokeDasharray="3 3" />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="value" stroke="#8884d8" />
            </LineChart>
          </View>
        </Content>
      </Container>
    )
  }
}

const mapStateToProps = state => ({
  device: state.device,
})

function mapDispatchToProps(dispatch) {
  return bindActionCreators(DevicesActions, dispatch)
}

export default connect(mapStateToProps, mapDispatchToProps)(DevicesContainer)

const Container = styled.div`
  min-height: 100vh;
  display: flex;
  flex-flow: row nowrap;
  justify-content: space-between;
  text-align: left;
`

const Aside = styled.div`
  min-width: 300px;
  width: 300px;
  border-right: 1px #524d4d solid;
`

const AsideItem = styled.div`
  position: relative;
  border-bottom: 1px #524d4d solid;
  text-transform: capitalize;
  cursor: pointer;
  padding: 15px 10px;
  z-index: 2;

  &::before {
    position: absolute;
    content: '';
    background: linear-gradient(to right, transparent, #4c4a4a);
    height: 100%;
    width: 100%;
    left: 0;
    top: 0;
    opacity: 0;
    transition: all 0.2s ease;
    z-index: 1;
  }

  &:hover {
    &::before {
      opacity: 1;
    }
  }
`

const AsideTitle = styled.h3`
  border-bottom: 1px #ccc solid;
  padding-bottom: 10px;
  margin-bottom: 10px;
`

const Content = styled.div`
  width: 100%;
  display: flex;
  flex-flow: row nowrap;
  justify-content: flex-start;
`

const Tags = styled.div`
  min-width: 300px;
  width: 300px;
  height: 100%;
  padding-left: 30px;
  border-right: 1px #524d4d solid;
`

const SelectedTitle = styled.h3`
  border-bottom: 1px #ccc solid;
  padding-bottom: 10px;
  margin-bottom: 10px;
`

const TagsList = styled.div``

const View = styled.div``
