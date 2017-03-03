/**
 * 登录页面,登录验证
 * 引用组件地址：
 * https://github.com/oblador/react-native-vector-icons
 * https://github.com/mathiasbynens/base64
 * xph@sectong.com
 * @author xph
 */
'use strict';
import React from 'react';
import {
  Alert,
  StyleSheet,
  InteractionManager,
  View,
  Text,
  TouchableOpacity,
  TextInput,
  ScrollView,
  Dimensions,
  Switch,
  AsyncStorage
} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import base64 from 'base-64';
import Register from './Register';
import { timeout } from './Tools';
import Retrievepassword from './Retrievepassword';
import Main from './Main';
let Global = require('./Global');
let {height, width} = Dimensions.get('window');//获取屏幕高度宽度
let loginInfo = { "username": "", "password": "" };
export default class Login extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      falseSwitchIsOn: true
    }
  }
  componentWillMount() {//根据自动登录状态改变switch的状态
    AsyncStorage.getItem('loginstate', (err, state) => {
      if (state != null && state === "1") {
        this.setState({ falseSwitchIsOn: true });
      }
      else if (state === null) {
        this.setState({ falseSwitchIsOn: true });
        AsyncStorage.setItem('loginstate', "1", (err) => {
          if (err) {
            //TODO:存储出错
            Alert.alert('出错信息', err, [{ text: '确定'}])
          };
        });
      }
      else {
        this.setState({ falseSwitchIsOn: false });
      }
    });
  }
  changestate(value) {//改变自动登录状态
    this.setState({ falseSwitchIsOn: value });
    if (value === false) {
      AsyncStorage.setItem('loginstate', "0", (err) => {
        if (err) {
          //TODO:存储出错
          Alert.alert('出错信息', err, [{ text: '确定'}])
        };
      });
    }
    else {
      AsyncStorage.setItem('loginstate', "1", (err) => {//自动登录
        if (err) {
          //TODO:存储出错
          Alert.alert('出错信息', err, [{ text: '确定' }])
        };
      });
    }
  }
  login() {//登录事件
    var reg = "^1[345789][0-9]{9}$";//正则表达式判定手机号
    var re = new RegExp(reg);
    if (re.test(loginInfo.username)) {
      if (loginInfo.password!=''&&loginInfo.password.length >= 6) {//http basic登录
        timeout(5000, fetch(Global.serverip + '/api/v1/i/userLogin',//fetch使用方法自行查阅资料
          {
            method: 'POST',
            headers: {
              "Authorization": "Basic " + base64.encode(loginInfo.username + ":" + loginInfo.password),
              'Content-Type': 'application/x-www-form-urlencoded'
            },
            body: "",
          }).then((response) => {//登录成功后将cookie持久化存储
            if (response.ok === true) {
              if (response.headers.map["set-cookie"] != undefined) {
                AsyncStorage.setItem('cookie', response.headers.map["set-cookie"][0], (err) => {
                  if (err) {
                    //TODO:存储出错
                    Alert.alert('出错信息', err, [{ text: '确定'}])
                  };
                });
              }
              Global.userinfo = response._bodyInit;
              loginInfo.password = null;
              return response.json();
            }
            else {
              Alert.alert('出错信息', "登录失败", [{ text: '确定'}])
            }
          }).then((json) => {
            if (json != undefined && json.code === 1) {
              const {navigator} = this.props;
              navigator.resetTo({
                component: Main,
                name: 'Main'
              });
            }
          }).catch((error) => {
            console.error(error);
            if (error != null && error != "") {
              Alert.alert('错误', "网络请求失败", [{ text: '确定' }])
            }
          })).catch((error) => {
            Alert.alert('出错信息', "网络请求失败", [{ text: '确定' }])
          })
      }
      else {
        Alert.alert('出错信息', "密码最短需要 6 个字符", [{ text: '确定'}])
      }
    }
    else {
      Alert.alert('出错信息', "请确认手机号码是否正确", [{ text: '确定' }])
    }
  }
  register() {//跳转至注册页面
    InteractionManager.runAfterInteractions(() => {
      const {navigator} = this.props;
      navigator.push({
        component: Register,
        name: 'Register'
      });
    })
  }
  Retrievepassword() {//跳转至忘记密码页面
    InteractionManager.runAfterInteractions(() => {
      const {navigator} = this.props;
      navigator.push({
        component: Retrievepassword,
        name: 'Retrievepassword'
      });
    })
  }
  render() {//页面渲染ß
    return (
      <ScrollView style={{ flex: 1 }} >
        <View style={styles.titlebar}>
          <Text style={styles.titletext}>登录</Text>
        </View>
        <View style={styles.body}>
          <View style={styles.textinputcontainer}>
            <Text>手机</Text>
            <TextInput
              style={styles.textinput}
              placeholderTextColor="#ccc"
              placeholder="请输入手机"
              underlineColorAndroid="transparent"
              onChangeText={(text) => { loginInfo.username = text; }}
            />
          </View>
          <View style={styles.horizontalbar} />
          <View style={styles.textinputcontainer}>
            <Text>密码</Text>
            <TextInput
              style={styles.textinput}
              placeholderTextColor="#ccc"
              placeholder="请输入密码"
              underlineColorAndroid="transparent"
              secureTextEntry={true}
              onChangeText={(text) => { loginInfo.password = text; }}
            />
          </View>
          <View style={styles.switch}>
            <Text>自动登录</Text>
            <Switch
              onValueChange={(value) => { this.changestate(value) }}
              value={this.state.falseSwitchIsOn} />
          </View>
          <TouchableOpacity onPress={() => { this.login() }}>
            <View style={styles.button}>
              <Text style={styles.buttontext}>登录</Text>
            </View>
          </TouchableOpacity>
          <View style={styles.resbar}>
            <TouchableOpacity onPress={() => { this.register() }}>
              <Text style={styles.text}>注册账号</Text>
            </TouchableOpacity>
            <View style={styles.verticalbar} />
            <TouchableOpacity onPress={() => {
              Alert.alert(
                '信息',
                "该功能暂未开放",
                [
                  { text: '确定', onPress: () => console.log('OK Pressed!') },
                ]
              )
            }}>
              <Text style={styles.text}>忘记密码</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    );
  }
}
let styles = StyleSheet.create({
  horizontalbar: {
    height: 1,
    backgroundColor: '#ccc',
    width: 0.9 * width,
    alignSelf: 'center'
  },
  textinput: {
    height: 45,
    textAlignVertical: 'center',
    paddingLeft: 20,
    width: 0.6 * width
  },
  textinputcontainer: {
    backgroundColor: '#ffffff',
    flexDirection: 'row',
    width: width,
    justifyContent: 'center',
    alignItems: 'center'
  },
  body: {
    backgroundColor: '#f5f5f5',
    flex: 1,
    flexDirection: 'column',
    marginTop: 20
  },
  titlebar: {
    height: 50,
    backgroundColor: '#f0f0f0',
    justifyContent: 'center',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderColor: '#ccc'
  },
  titletext: {
    fontSize: 17,
    color: 'black'
  },
  switch: {
    backgroundColor: '#ffffff',
    flexDirection: 'row',
    width: width,
    justifyContent: 'flex-end',
    alignItems: 'center',
    marginTop: 10,
    paddingHorizontal: 20
  },
  button: {
    backgroundColor: '#007aff',
    height: 45,
    width: width - 20,
    marginHorizontal: 10,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 20,
    borderRadius: 5
  },
  buttontext: {
    color: '#ffffff',
    fontSize: 17
  },
  verticalbar: {
    width: 1,
    backgroundColor: '#ccc',
    marginHorizontal: 10
  },
  text: {
    color: '#007aff'
  },
  resbar: {
    justifyContent: 'center',
    marginTop: 20,
    flexDirection: 'row'
  }
});



