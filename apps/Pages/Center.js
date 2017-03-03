/**
 * 设置页面
 * 引用组件地址：
 * https://github.com/oblador/react-native-vector-icons
 * https://github.com/marcshilling/react-native-image-picker 版本为0.24
 * 
 * @author xph
 */
'use strict';
import React from 'react';
import {
  Alert,
  StyleSheet,
  InteractionManager,
  View,
  Image,
  Text,
  TouchableOpacity,
  TextInput,
  PixelRatio,
  Platform,
  Dimensions,
  AsyncStorage
} from 'react-native';

import Icon from 'react-native-vector-icons/FontAwesome';
import ImagePicker from 'react-native-image-picker';
import Welcome from './Welcome';
import Login from './Login';
import { timeout } from './Tools';
let {height, width} = Dimensions.get('window');
let Global = require('./Global');
class Center extends React.Component {
  constructor(props) {
    super(props);
    this.state = { avatarSource: require('./imgs/touxiang.jpg'), }
  }

  componentWillMount() {
    if (Global.userinfo != '') {
      if (JSON.parse(Global.userinfo).content.image != Global.serverip + "/null") {
        this.setState({ avatarSource: { uri: JSON.parse(Global.userinfo).content.image } });
      }
    }

  }
  back() {//退出登录跳转到登录界面
    this.logout();
    const {navigator} = this.props;
    navigator.replace({
      component: Login,
      name: 'Login'
    });
  }
  welcome() {//跳转至欢迎页
    InteractionManager.runAfterInteractions(() => {
      const {navigator} = this.props;
      navigator.push({
        component: Welcome,
        name: 'Welcome'
      });
    })
  }
  upload() {//更新个人头像事件
    var picturename = this.state.url;
    let formData = new FormData();
    formData.append("file", { uri: this.state.url, type: 'multipart/form-data', name: picturename });
    AsyncStorage.getItem('cookie', (err, result) => {
      timeout(5000, fetch(Global.serverip + '/api/v1/i/uploadImage ',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'multipart/form-data',
            'Cookie': result
          },
          body: formData,
        }).then((response) => {
          if (response.ok) {
            return response.json();
          }
          else {
            Alert.alert('出错信息', "请求出错,请重新登陆后再次更换头像", [{ text: '确定' }])
          }
        }).then((json) => {
        }).catch((error) => {
          console.error(error);
          if (error != null && error != "") {
            Alert.alert('错误', "网络请求失败", [{ text: '确定'}])

          }
        })).catch((error) => {
          Alert.alert('出错信息', "网络请求失败", [{ text: '确定'}])
        })
    });
  }
  logout() {//退出登录事件
    AsyncStorage.getItem('cookie', (err, result) => {
      timeout(5000, fetch(Global.serverip + '/logout',
        {
          method: 'POST',
          headers: {
            'Cookie': result,
          },
        }).then((response) => {

        }).then((json) => {
        }).catch((error) => {
          console.error(error);
          if (error != null && error != "") {
            Alert.alert('错误', "网络请求失败", [{ text: '确定'}])

          }
        })).catch((error) => {
          Alert.alert('出错信息', "网络请求失败", [{ text: '确定'}])
        })
      AsyncStorage.setItem('cookie', "", (err) => { });
    });
  }
  selectPhotoTapped() {//此事件为组件自带的事件，详见组件github说明
    const options = {//设置图片的分辨率，
      quality: 1,
      maxWidth: 200,
      maxHeight: 200,
      storageOptions: {
        skipBackup: true
      }
    };
    ImagePicker.showImagePicker(options, (response) => {
      console.log('Response = ', response);
      if (response.didCancel) {
        console.log('User cancelled photo picker');
      }
      else if (response.error) {
        console.log('ImagePicker Error: ', response.error);
      }
      else if (response.customButton) {
        console.log('User tapped custom button: ', response.customButton);
      }
      else {//取得图片路径
        var source;
        if (Platform.OS === 'android') {
          source = { uri: response.uri, isStatic: true };
        } else {
          source = { uri: response.uri.replace('file://', ''), isStatic: true };
        }
        this.setState({ avatarSource: source, url: response.uri });
        this.upload();
      }
    });
  }
  render() {
    return (
      <View style={{ flex: 1, backgroundColor: '#f5f5f5' }}>
        <View style={styles.titlebar}>
          <Text style={{ fontSize: 17, color: 'black' }}>设置</Text>
        </View>
        <Image style={styles.img} source={require('./imgs/timg7.jpg')} >
          <TouchableOpacity onPress={() => { this.selectPhotoTapped() }}>
            <View style={[styles.avatar, styles.avatarContainer]}>
              <Image style={styles.avatar} source={this.state.avatarSource} />
            </View>
          </TouchableOpacity>
          <Text style={{ color: '#af7817', }}>{JSON.parse(Global.userinfo).content.username}</Text>
          <Text style={{ color: '#af7817', marginLeft: 10 }}>男</Text>
        </Image>
        <View style={{ backgroundColor: 'white', marginTop: 15 }}>
          <TouchableOpacity style={styles.setbar} onPress={() => { Alert.alert('温馨提示', "该功能暂未开放", [{ text: '确定'}]) }}>
            <Text style={styles.bartext}>新消息通知</Text>
            <Icon name="angle-right" size={20} color="#ccc" />
          </TouchableOpacity>
          <View style={styles.linebar} />
          <TouchableOpacity style={styles.setbar} onPress={() => { Alert.alert('温馨提示', "该功能暂未开放", [{ text: '确定'}]) }}>
            <Text style={styles.bartext}>隐私</Text>
            <Icon name="angle-right" size={20} color="#ccc" />
          </TouchableOpacity>
          <View style={styles.linebar} />
         <TouchableOpacity style={styles.setbar} onPress={() => { Alert.alert('温馨提示', "该功能暂未开放", [{ text: '确定'}]) }}>
            <Text style={styles.bartext}>通用</Text>
            <Icon name="angle-right" size={20} color="#ccc" />
          </TouchableOpacity>
          <View style={styles.linebar} />
          <TouchableOpacity style={styles.setbar} onPress={() => { this.welcome() }}>
            <Text style={styles.bartext}>欢迎页</Text>
            <Icon name="angle-right" size={20} color="#ccc" />
          </TouchableOpacity>
        </View>
        <TouchableOpacity style={[styles.setbar, { backgroundColor: 'white', marginTop: 20 }]} onPress={() => { this.props.back(); }}>
          <Text style={styles.bartext}>关于移动易</Text>
          <Icon name="angle-right" size={20} color="#ccc" />
        </TouchableOpacity>
        <TouchableOpacity style={[styles.setbar, { backgroundColor: 'white', marginTop: 20, justifyContent: 'center' }]} onPress={() => { this.back() }}>
          <Text style={[styles.bartext, { color: "red" }]}>退出登录</Text>
        </TouchableOpacity>
      </View>
    );
  }
}
let styles = StyleSheet.create({
  img: {
    height: 150,
    width: width,
    backgroundColor: 'white',
    flexDirection: 'row',
    alignItems: 'center'
  },
  titlebar: {
    height: 50,
    backgroundColor: '#f0f0f0',
    justifyContent: 'center',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderColor: '#ccc'
  },
  setbar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 15,
    paddingVertical: 10
  },
  bartext: {
    color: 'black',
    fontSize: 17
  },
  linebar: {
    height: 0.5,
    backgroundColor: '#ccc',
    width: width - 15,
    alignSelf: 'center'
  },
  avatarContainer: {
    borderColor: '#9B9B9B',
    borderWidth: 1 / PixelRatio.get(),
    justifyContent: 'center',
    alignItems: 'center'
  },
  avatar: {
    borderRadius: 70,
    width: 70,
    height: 70,
    margin: 15
  }
});

export default Center;

