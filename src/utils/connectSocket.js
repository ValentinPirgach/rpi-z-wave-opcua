import io from 'socket.io-client'

export default class ConnectSocket {
  static instance

  constructor() {
    if (ConnectSocket.instance) {
      return ConnectSocket.instance
    }

    this.socket = io.connect('http://localhost:3000')

    ConnectSocket.instance = this

    return this
  }
}
