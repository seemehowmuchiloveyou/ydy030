/**
 * 新闻列表页面，实现下拉刷新，上拉加载
 * 主要用到了listview ，以及RefreshControl，rn官方文档可查
 * xph@sectong.com
 * @author xph
 */
'use strict';
import React from 'react';
import {
  StyleSheet,
  InteractionManager,
  View,
  Text,
  TouchableOpacity,
  TextInput,
  Dimensions,
  ScrollView,
  ListView,
  Image,
  RefreshControl,
  TouchableWithoutFeedback,
  Alert
} from 'react-native';
let Global = require('./Global');
import { timeout } from './Tools';
let {height, width} = Dimensions.get('window');
export default class News extends React.Component {
  constructor(props) {
    super(props);
    this.renderRow = this.renderRow.bind(this);
    this.state = {
      isRefreshing: false,
      foot: 0,// 0：隐藏   1：显示加载中  
      dataSource: new ListView.DataSource({ rowHasChanged: (r1, r2) => r1 !== r2 }).cloneWithRows([]),//listView数据源
    }
  }
  componentWillUnmount() {//清除时钟
    this.timer && clearTimeout(this.timer);
  }
  componentWillMount() {
    this.getinfo();
  }
  renderRow(data) {//转换时间戳之后渲染新闻信息
    var unixTimestamp = new Date(data.datetime);
    var commonTime = unixTimestamp.toLocaleTimeString();//获取小时及分钟
    var year = unixTimestamp.toISOString().split("T");
    return (
      <View style={styles.row}>
        <View style={styles.imagecontainer}>
          <Image source={require('./imgs/cbd.jpg')} style={styles.img} />
        </View>
        <View style={{ flexDirection: 'column', alignItems: 'flex-start' }}>
          <View style={{ flexDirection: 'column', }}>
            <Text style={styles.text}>
              标题:{data.title}
            </Text>
            <Text style={styles.text}>
              内容:{data.content}
            </Text>
          </View>
          <Text style={[styles.text, { justifyContent: "flex-end" }]}>
            时间:{year[0]}  {commonTime}
          </Text>
        </View>
      </View>
    );
  }
  render() {
    return (
      <ListView
        ref="listView"
        dataSource={this.state.dataSource}
        renderRow={this.renderRow}
        enableEmptySections={true}
        renderFooter={this._renderFooter}
        onEndReached={this._endReached}
        renderHeader={this._renderheader}
        refreshControl={
          <RefreshControl
            refreshing={this.state.isRefreshing}
            progressViewOffset={32}
            onRefresh={this._onRefresh}
            tintColor="#ff0000"
            title="Loading..."
            titleColor="#00ff00"
            colors={['#ff0000', '#00ff00', '#0000ff']}
            progressBackgroundColor="#ffff00"
          />
        }
      />
    );
  }
  _renderheader = () => {//listview头部
    return (
      <View style={styles.newsheader}>
        <Text style={styles.headertext}>新闻</Text>
      </View>);
  }
  _renderFooter = () => {//listview尾部

    if (this.state.foot === 1) {//加载中,此处可自定义设计效果
      return (
        <View style={styles.footcontainer}>
          <Image source={require('./imgs/loading.jpg')} style={styles.img} />
          <Text style={{ fontSize: 12 }}>
            加载中
          </Text>
        </View>);
    }
  }
  _endReached = () => {//模拟加载状态,默认至少十条数据之后才可有上拉加载功能
    if (this.state.foot === 0 && Global.refreshinfo.data.length > 10) {
      this.setState({ foot: 1 });
      this.timer = setTimeout(() => {
        this.setState({ foot: 0 });
      }, 3000);
    }
  }
  getinfo = () => {
    timeout(5000, fetch(Global.serverip + '/api/v1/news/getNewsList?startid=' + Global.refreshinfo.startid + '&size=10&sort=id,desc',
      {
        method: 'GET',
      }).then((response) => {
        if (response.ok === true) {
          return response.json();
        }
        else {
          Alert.alert('出错信息', "请求出错", [{ text: '确定'}])
        }
      }).then((json) => {
        if (json.code === 1) {
          this.setState({
            isRefreshing: false,
          });
          if (json.content.content.length != 0) {//处理数据
            Global.refreshinfo.startid = json.content.content[0].id;
            let info = [].concat(json.content.content);
            info = info.concat(Global.refreshinfo.data);
            Global.refreshinfo.data = Global.refreshinfo.data.splice(0, Global.refreshinfo.data.length);
            Global.refreshinfo.data = [].concat(info);
            this.setState({//下拉刷新事件，获取数据后重新渲染页面页面
              isRefreshing: false,
              dataSource: new ListView.DataSource({ rowHasChanged: (r1, r2) => r1 !== r2 }).cloneWithRows(Global.refreshinfo.data),
            });
          }
        }
      }).catch((error) => {
        if (error != null && error != "") {
          Alert.alert('错误', "网络请求失败", [{ text: '确定'}])

        }
        console.error(error);
      })).catch((error) => {
        Alert.alert('错误', "网络请求失败", [{ text: '确定'}])
      })
  }
  _onRefresh = () => {//下拉刷新事件，获取数据后重新渲染页面
    this.setState({ isRefreshing: true });
    this.getinfo();
  };
}


let styles = StyleSheet.create({
  img: {
    width: 40,
    height: 40
  },
  imagecontainer: {
    height: 0.1 * height,
    width: 0.1 * height,
    justifyContent: 'center',
    alignItems: 'center'
  },
  footcontainer: {
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row'
  },
  newsheader: {
    height: 50,
    backgroundColor: '#f0f0f0',
    justifyContent: 'center',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderColor: '#ccc'
  },
  headertext: {
    fontSize: 17,
    color: 'black'
  },
  row: {
    borderColor: '#ccc',
    borderBottomWidth: 1,
    flexDirection: 'row',
    alignItems: 'center',
    width: width
  },
  text: {
    alignSelf: 'flex-start',
    width: width - 0.1 * height
  },
  scrollview: {
    flex: 1,
  }
});