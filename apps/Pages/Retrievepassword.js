/**
 * 忘记密码页面
 * xph@sectong.com
 * 引用组件地址：
 * https://github.com/oblador/react-native-vector-icons
 * @author xph
 */
'use strict';
import React from 'react';
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  TextInput,
  Dimensions
} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
let {height, width} = Dimensions.get('window');
export default class Retrievepassword extends React.Component {
  constructor(props) {
    super(props);
  }
  back() {//返回事件
    const {navigator} = this.props;
    navigator.pop();
  }
  render() {
    return (
      <View style={{ flex: 1 }}>
        <View style={styles.titlebar}>
          <TouchableOpacity onPress={() => { this.back() }} style={styles.backbutton}>
            <Icon name="angle-left" size={30} color="black" />
          </TouchableOpacity>
          <Text style={styles.titletext}>找回密码</Text>
        </View>
        <View style={styles.body}>
          <View style={styles.textinputv}>
            <Text>手机</Text>
            <TextInput
              style={styles.textinput}
              placeholderTextColor="#ccc"
              placeholder="请输入手机"
              underlineColorAndroid="transparent"
              onChangeText={(text) => this.setState({ account: text })}
            />
          </View>
          <View style={styles.bar} />
          <TouchableOpacity onPress={() => { }}>
            <View style={styles.button}>
              <Text style={styles.buttontext}>提交</Text>
            </View>
          </TouchableOpacity>
        </View>
      </View>
    );
  }
}
let styles = StyleSheet.create({
  backbutton: {
    width: 40,
    height: 40,
    justifyContent: 'center'
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
  bar: {
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
  textinputv: {
    backgroundColor: '#ffffff',
    flexDirection: 'row',
    width: width,
    justifyContent: 'center',
    alignItems: 'center'
  },
  buttontext: {
    color: '#ffffff',
    fontSize: 17
  }
});


