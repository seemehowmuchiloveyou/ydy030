/**
 * tabbar类型页面，根据组件默认的tabbar修改而来
 * 添加了图标显示
 * xph@sectong.com
 * @author xph
 */
const React = require('react');
const ReactNative = require('react-native');
const {
  StyleSheet,
  Text,
  View,
  Animated,
} = ReactNative;
const Button = require('../node_modules/react-native-scrollable-tab-view/Button');
import Icon from 'react-native-vector-icons/FontAwesome';
var names=["home","home"];//图标及文字初始值
const YidongyiTabBar = React.createClass({
  propTypes: {
    goToPage: React.PropTypes.func,
    activeTab: React.PropTypes.number,
    tabs: React.PropTypes.array,
    backgroundColor: React.PropTypes.string,
    activeTextColor: React.PropTypes.string,
    inactiveTextColor: React.PropTypes.string,
    textStyle: Text.propTypes.style,
    tabStyle: View.propTypes.style,
    renderTab: React.PropTypes.func,
    underlineStyle: View.propTypes.style,
  },

  getDefaultProps() {
    return {
      activeTextColor: 'red',
      inactiveTextColor: 'black',
      backgroundColor: null,
    };
  },
  renderTab(name, page, isTabActive, onPressHandler) {//将传进来的字符串分割，分别为icon的name，和标题名
    const { activeTextColor, inactiveTextColor, textStyle, } = this.props;
    const textColor = isTabActive ? activeTextColor : inactiveTextColor;
    const fontWeight = isTabActive ? 'bold' : 'normal';
    var names = name.split(',');
    return <Button
      style={{ flex: 1, }}
      key={names[0]}
      accessible={true}
      accessibilityLabel={names[0]}
      accessibilityTraits='button'
      onPress={() => onPressHandler(page)}
    >
      <View style={[styles.tab, this.props.tabStyle,]}>
        <Icon name={names[0]} size={20} color={textColor} />
        <Text style={[{ color: textColor, fontWeight, }, textStyle,]}>
          {names[1]}
        </Text>
      </View>
    </Button>;
  },

  render() {
    const containerWidth = this.props.containerWidth;
    const numberOfTabs = this.props.tabs.length;
    const tabUnderlineStyle = {
      position: 'absolute',
      width: containerWidth / numberOfTabs,
      height: 4,
      backgroundColor: 'navy',
      bottom: 0,
    };

    const left = this.props.scrollValue.interpolate({
      inputRange: [0, 1,], outputRange: [0, containerWidth / numberOfTabs,],
    });
    return (
      <View style={[styles.tabs, { backgroundColor: this.props.backgroundColor, }, this.props.style,]}>
        {this.props.tabs.map((name, page) => {
          const isTabActive = this.props.activeTab === page;
          const renderTab = this.props.renderTab || this.renderTab;
          return renderTab(name, page, isTabActive, this.props.goToPage);
        })}
      </View>
    );
  },
});

const styles = StyleSheet.create({
  tab: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  tabs: {
    height: 50,
    flexDirection: 'row',
    justifyContent: 'space-around',
    borderWidth: 1,
    borderTopWidth: 0,
    borderLeftWidth: 0,
    borderRightWidth: 0,
    borderColor: '#ccc',
  },
});

module.exports = YidongyiTabBar;
