import React, { Component } from 'react';
import { View } from '@tarojs/components';
import 'taro-ui/dist/style/index.scss'
import { Provider } from 'react-redux';
import rootStore from './redux/store';
import './app.less'

class App extends Component {

  componentDidMount() { }

  componentDidShow() { }

  componentDidHide() { }

  componentDidCatchError() { }

  // this.props.children 是将要会渲染的页面
  render() {
    return (
      <Provider store={rootStore.store}>{this.props.children}</Provider>
    )
  }
}

export default App
