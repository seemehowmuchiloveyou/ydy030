/**
 * 欢迎页 
 * 引用组件地址：
 * https://github.com/leecade/react-native-swiper
 * xph@sectong.com
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
  Dimensions,
  AsyncStorage
} from 'react-native';
import Swiper from 'react-native-swiper';
import Login from './Login';
let {height, width} = Dimensions.get('window');
export default class Welcome extends React.Component {
  constructor(props) {
    super(props);
  }

  back() {
    AsyncStorage.getItem('logintimes', (err, times) => {
      if (times === "1") {
        const {navigator} = this.props;
        navigator.pop();
      }
      else {
        AsyncStorage.setItem('logintimes', "1", (err) => {
          if (err) {
            //TODO:存储出错
            Alert.alert('出错信息', err, [{ text: '确定', onPress: () => console.log('OK Pressed!') },])
          }
          else {
            const {navigator} = this.props;
            navigator.resetTo({
              component: Login,
              name: 'Login'
            });
          }
        });
      }
    });

  }
  render() {
    return (
      <View>
        <Swiper
          loop={true}
          height={height}
          autoplay={true}
          showsPagination={true}
          autoplayTimeout={2.5}
          showsButtons={false}
          dotColor={'white'}
          animated={true}>
          <View style={[styles.background, { backgroundColor: '#d74b28' }]}>
            <View style={styles.circle}>
              <Text style={styles.swipertitle}>移动易</Text>
            </View>
            <View >
              <Text style={styles.swipertext}>0基础学习APP开发</Text>
              <Text style={styles.swipertext}>一切可以从零开始           </Text>
              <Text style={styles.swipertext}>              双平台得心应手</Text>
            </View>
          </View>
          <View style={[styles.background, { backgroundColor: '#02c1ed' }]}>
            <View style={styles.circle}>
              <Text style={styles.swipertitle}>移动易</Text>
            </View>
            <View >
              <Text style={styles.swipertext}>前端后端一起搞定</Text>
            </View>
          </View>
          <View style={[styles.background, { backgroundColor: '#67c962' }]}>
            <View style={styles.circle}>
              <Text style={styles.swipertitle}>移动易</Text>
            </View>
            <TouchableOpacity style={styles.button} onPress={() => { this.back() }}>
              <Text style={styles.buttontext}>立即体验</Text>
            </TouchableOpacity>
          </View>
        </Swiper>
      </View>
    );
  }
}
let styles = StyleSheet.create({
  background: {
    flex: 1,
    alignItems: "center",
    justifyContent: 'space-around'
  },
  swipertitle: {
    fontSize: 25,
    color: 'white'
  },
  swipertext: {
    fontSize: 20,
    color: 'white',
    marginBottom: 20
  },
  buttontext: {
    fontSize: 15,
    color: 'white',
  },
  circle: {
    height: 0.5 * width,
    width: 0.5 * width,
    borderRadius: 0.5 * width,
    borderWidth: 1,
    borderColor: 'white',
    justifyContent: 'center',
    alignItems: 'center'
  },
  button: {
    alignItems: 'center',
    borderColor: 'white',
    borderWidth: 1,
    borderRadius: 5,
    marginBottom: 20,
    padding: 10
  }
});

