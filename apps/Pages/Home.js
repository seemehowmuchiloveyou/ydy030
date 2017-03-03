/**
 * 主页面首页
 * 介绍本产品
 * xph@sectong.com
 * @author xph
 */
'use strict';
import React from 'react';
import {
  StyleSheet,
  View,
  Text,
  WebView,
  Dimensions,
  Image,
  ScrollView
} from 'react-native';
let {height, width} = Dimensions.get('window');//获取屏幕高度宽度
export default class Home extends React.Component {
  constructor(props) {
    super(props);
  }
  render() {
    return (
      <ScrollView style={{ flex: 1 }}>
        <View style={{ height: 50, backgroundColor: '#f0f0f0', justifyContent: 'center', alignItems: 'center', borderBottomWidth: 1, borderColor: '#ccc' }}>
          <Text style={{ fontSize: 17, color: 'black' }}>首页</Text>
        </View>
        <View style={{ paddingHorizontal: 10, marginTop: 10 }}>
          <Text style={styles.textcontent}>移动易演示版，赛克通团队负责开发和运营。</Text>
          <Text style={styles.texttitle}>社区版</Text>
          <Text style={styles.textcontent}>mobileeasy.cc</Text>
          <Text style={styles.texttitle}>企业版</Text>
          <Text style={styles.textcontent}>联系方式：021-68863086</Text>
          <Text style={styles.texttitle}>QQ群</Text>
          <Text style={styles.textcontent}>103880410</Text>
          <Text style={styles.texttitle}>公司网站</Text>
          <Text style={styles.textcontent}>sectong.com</Text>
          <Text style={styles.texttitle}>微信服务号</Text>
          <Image style={styles.avatar} source={require("./imgs/wc.png")} />
        </View>
        {/*<WebView
          style={{ width: width, height: height - 20, backgroundColor: 'gray' }}
          source={{ uri: "https://www.mobileeasy.cc/", method: 'GET' }}
          javaScriptEnabled={true}
          domStorageEnabled={true}
          scalesPageToFit={false}
        />*/}
      </ScrollView>
    );
  }
}
let styles = StyleSheet.create({
  avatar:{height:150,width:150},
  textcontent: {
    marginTop: 3,
    fontSize: 15
  },
  texttitle: {
    marginTop: 20,
    fontSize: 16,
    color: 'black'
  }
});


