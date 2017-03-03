/**
 * 根据页面，配置navigator路由,自动登录验证，back键监听
 * xph@sectong.com
 * @author xph
 */
'use strict';

import React from 'react';
import {
  StyleSheet,
  Navigator,
  StatusBar,
  BackAndroid,
  View,
  AsyncStorage,
  Alert,
  Platform
} from 'react-native';

import Login from './Login';
import Main from './Main';
import Welcome from './Welcome';
import { timeout } from './Tools';
const STATUS_BAR_HEIGHT = (Platform.OS === 'ios' ? 20 : 25);
let Global = require('./Global');
var _navigator;
export default class App extends React.Component {
  constructor(props) {
    super(props);
    this.renderScene = this.renderScene.bind(this);
    this.goBack = this.goBack.bind(this);
    BackAndroid.addEventListener('hardwareBackPress', this.goBack);
    this.state = {
      loginstate: false,
      user: false,
      welstae: false
    }
  }

  componentWillMount() {
    AsyncStorage.getItem('logintimes', (err, times) => {
      if (times === "1") {
        AsyncStorage.getItem('loginstate', (err, state) => {
          if (state === "1") {
            AsyncStorage.getItem('cookie', (err, result) => {
              timeout(5000,
                fetch(Global.serverip + '/api/v1/i/userLogin',//fetch使用方法自行查阅资料
                  {
                    method: 'POST',
                    headers: {
                      "Cookie": result,
                    },
                  }).then((response) => {
                    if (response != undefined && response.ok === true) {
                      Global.userinfo = response._bodyInit;
                      return response.json();
                    }
                    else {
                      this.setState({ loginstate: true });
                    }
                  }).then((json) => {
                    if (json != undefined && json.code === 1) {
                      this.setState({ loginstate: true, user: true });
                    }
                    else {
                      this.setState({ loginstate: true });
                    }
                  }).catch((error) => {
                    console.error(error);
                    if (error != null && error != "") {
                      Alert.alert('错误', "网络请求失败", [{ text: '确定'}])
                    }
                  })).catch((error) => {
                    Alert.alert('错误', "网络请求失败", [{ text: '确定'}])
                  })
            });
          }
          else {
            this.setState({ loginstate: true });
          }
        });
      }
      else {
        this.setState({ welstae: true });
      }
    });
  }
  goBack() {//手机back键，触发返回事件
    if (_navigator && _navigator.getCurrentRoutes().length > 1) {
      _navigator.pop();
      return true;
    }
    return false;
  }
  renderScene(route, navigator) {//定义navigator路由
    let Component = route.component;
    _navigator = navigator;
    return (
      <Component {...route.params} navigator={navigator} route={route} />
    );
  }

  configureScene(route, routeStack) {//配置场景动画和手势
    return Navigator.SceneConfigs.PushFromRight;
  }

  render() {//Navigator跳转，见rn官方文档
    if (this.state.loginstate) {
      return (
        <View style={{ flex: 1 }}>
          <StatusBar
            backgroundColor='black'
            style={{ height: 25 }}
          />
          <Navigator
            ref='navigator'
            style={styles.navigator}
            configureScene={this.configureScene}
            renderScene={this.renderScene}
            initialRoute={(!this.state.user) ? { component: Login, name: 'Login' } : { component: Main, name: 'Main' }}
          />
        </View>
      );
    }
    else if (this.state.welstae) {
      return (
        <View style={{ flex: 1 }}>
          <StatusBar
            backgroundColor='black'
            style={{ height: STATUS_BAR_HEIGHT }}
          />
          <Navigator
            ref='navigator'
            style={styles.navigator}
            configureScene={this.configureScene}
            renderScene={this.renderScene}
            initialRoute={{ component: Welcome, name: 'Welcome' }}
          />
        </View>
      );
    }
    else {
      return (
        <View style={{ flex: 1 }}>
          <StatusBar
            backgroundColor='black'
            style={{ height: 25 }}
          />

        </View>
      );
    }
  }
}
let styles = StyleSheet.create({
  navigator: {
    flex: 1
  }
});



