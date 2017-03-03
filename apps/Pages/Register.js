/**
 * 注册页面
 * xph@sectong.com
 * 引用组件地址：
 * https://github.com/oblador/react-native-vector-icons
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
  AsyncStorage
} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
let {height, width} = Dimensions.get('window');
import base64 from 'base-64';
let Global = require('./Global');
import Main from './Main';
import { timeout } from './Tools';
let registerinfo = { "username": "", "password": "" };
export default class Register extends React.Component {
  constructor(props) {
    super(props);
  }
  back() {//返回事件
    const {navigator} = this.props;
    navigator.pop();
  }
  login() {//再次登录
    timeout(5000, fetch(Global.serverip + '/api/v1/i/userLogin',//fetch使用方法自行查阅资料
      {
        method: 'POST',
        headers: {
          "Authorization": "Basic " + base64.encode(registerinfo.username + ":" + registerinfo.password),
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
          registerinfo.password = "";
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
          Alert.alert('错误', "网络请求失败", [{ text: '确定'}])
        }
      })).catch((error) => {
        Alert.alert('出错信息', "网络请求失败", [{ text: '确定' }])
      })
  }
  register() {//注册事件
    var reg = "^1[345789][0-9]{9}$";//正则表达式判定手机号
    var re = new RegExp(reg);
    if (re.test(registerinfo.username)) {
      if (registerinfo.password.length >= 6) {
        timeout(5000, fetch(Global.serverip + '/api/v1/create',//fetch使用方法自行查阅资料
          {
            method: 'POST',
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              'username': registerinfo.username,
              'password': registerinfo.password
            }),
          }).then((response) => {
            if (response.ok) {
              return response.json();
            }
            else {
              Alert.alert('出错信息', "请求出错", [{ text: '确定'}]
              )
            }
          }).then((json) => {
            if (json.code != 0) {
              this.login();
              Global.username = registerinfo.username;
            }
            else {
              Alert.alert('出错信息', json.message, [{ text: '确定' }]
              )
            }
          }).catch((error) => {
            console.error(error);
            if (error != null && error != "") {
              Alert.alert('错误', "网络请求失败", [{ text: '确定'}])
            }
          })).catch((error) => {
            Alert.alert('出错信息', "网络请求失败", [{ text: '确定'}])
          })
      }
      else {
        Alert.alert('出错信息', "密码最短需要 6 个字符", [{ text: '确定'}]
        )
      }
    }
    else {
      Alert.alert('出错信息', "请确认手机号码是否正确", [{ text: '确定'}]
      )
    }
  }
  render() {
    return (
      <ScrollView style={{ flex: 1 }}>
        <View style={styles.titlebar}>
          <TouchableOpacity onPress={() => { this.back() }} style={styles.backbutton}>
            <Icon name="angle-left" size={30} color="#ccc" />
          </TouchableOpacity>
          <Text style={{ fontSize: 17, color: 'black' }}>注册</Text>
          <Icon name="angle-left" size={30} color="#f0f0f0" />
        </View>
        <View style={styles.body}>
          <View style={styles.textinputcontainer}>
            <Text>手机</Text>
            <TextInput
              style={styles.textinput}
              placeholderTextColor="#ccc"
              placeholder="请输入手机"
              underlineColorAndroid="transparent"
              onChangeText={(text) => { registerinfo.username = text; }}
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
              onChangeText={(text) => { registerinfo.password = text; }}
            />
          </View>
          <TouchableOpacity onPress={() => { this.register() }}>
            <View style={styles.button}>
              <Text style={styles.buttontext}>注册</Text>
            </View>
          </TouchableOpacity>
          <Text style={{ marginTop: 20, marginLeft: 10 }}>输入手机号和密码（至少六位）,注册即可</Text>
        </View>
      </ScrollView>
    );
  }
}
let styles = StyleSheet.create({
  backbutton: {
    width: 40,
    height: 40,
    justifyContent: 'center'
  },
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
    justifyContent: 'space-between',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderColor: '#ccc',
    flexDirection: 'row',
    paddingHorizontal: 20
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
  }
});

