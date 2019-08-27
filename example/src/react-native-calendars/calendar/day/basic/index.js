import React, {Component} from 'react';
import {
  TouchableOpacity,
  Text,
  View
} from 'react-native';
import PropTypes from 'prop-types';
import {shouldUpdate} from '../../../component-updater';

import styleConstructor from './style';

class Day extends Component {
  static propTypes = {
    // TODO: disabled props should be removed
    state: PropTypes.oneOf(['disabled', 'today', '']),

    // Specify theme properties to override specific styles for calendar parts. Default = {}
    theme: PropTypes.object,
    marking: PropTypes.any,
    onPress: PropTypes.func,
    onLongPress: PropTypes.func,
    date: PropTypes.object
  };

  constructor(props) {
    super(props);
    this.style = styleConstructor(props.theme);
    this.onDayPress = this.onDayPress.bind(this);
    this.onDayLongPress = this.onDayLongPress.bind(this);
  }

  onDayPress() {
    this.props.onPress(this.props.date);
  }
  onDayLongPress() {
    this.props.onLongPress(this.props.date);
  }

  shouldComponentUpdate(nextProps) {
    return shouldUpdate(this.props, nextProps, ['state', 'children', 'marking', 'onPress', 'onLongPress']);
  }

  render() {
    const isHighlightWeekend = this.props.isHighlightWeekend;
    const containerStyle = [this.style.base];
    let textStyle = [this.style.text];
    let lunarTextStyle = [textStyle, this.style.lunarText, {marginTop: 0}];
    const dotStyle = [this.style.dot];

    let marking = this.props.marking || {};
    if (marking && marking.constructor === Array && marking.length) {
      marking = {
        marking: true
      };
    }
    const isDisabled = typeof marking.disabled !== 'undefined' ? marking.disabled : this.props.state === 'disabled';
    let dot;
    if (marking.marked) {
      dotStyle.push(this.style.visibleDot);
      if (marking.dotColor) {
        dotStyle.push({backgroundColor: marking.dotColor});
      }
      dot = (<View style={dotStyle}/>);
    }

    if (marking.selected) {
      containerStyle.push(this.style.selected);
      if (marking.selectedColor) {
        containerStyle.push({backgroundColor: marking.selectedColor});
      }
      dotStyle.push(this.style.selectedDot);
      textStyle.push(this.style.selectedText);
    } else if (isDisabled) {
      textStyle.push(this.style.disabledText);
    } else if (this.props.state === 'today') {
      containerStyle.push(this.style.today);
      textStyle.push(this.style.todayText);
    }
    let colorWeekend = textStyle.color;
    if (this.props.weekendHighlightColor) {
      colorWeekend = this.props.weekendHighlightColor;
    }
    let lunarDay = this.props.lunarDay;
    let lunarStr = '';
    if (lunarDay) {
      lunarStr = lunarDay.day==1?`${lunarDay.day}/${lunarDay.month+1}`:lunarDay.day;
      if (lunarDay.day == 1) {
        lunarTextStyle.push({color: colorWeekend});
        lunarTextStyle.push({opacity: 1});
      }
    }
    if (isHighlightWeekend) {
      if (isDisabled) {
        textStyle.push({color: colorWeekend});
        textStyle.push({opacity: 0.5});
        lunarTextStyle.push({color: colorWeekend});
        lunarTextStyle.push({opacity: 0.5});
      } else {
        textStyle.push({color: colorWeekend});
        lunarTextStyle.push({color: colorWeekend});
        textStyle.push({opacity: 1});
        lunarTextStyle.push({opacity: 1});
      }
    }

    return (
      <TouchableOpacity
        style={containerStyle}
        onPress={this.onDayPress}
        onLongPress={this.onDayLongPress}
        activeOpacity={marking.activeOpacity}
        disabled={marking.disableTouchEvent}
      >                
        <Text allowFontScaling={false} style={textStyle}>{String(this.props.children)}</Text>
        {lunarDay?<Text allowFontScaling={false} style={lunarTextStyle}>{lunarStr}</Text>:false}
        {dot}
        
      </TouchableOpacity>
    );
  }
}

export default Day;
