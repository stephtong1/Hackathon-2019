import React, { Component } from 'react';
import { AppRegistry, View, Dimensions } from 'react-native';
import { Camera, Permissions } from 'expo';

class JustifyContentBasics extends Component {
  render() {
    return (
      // Try setting `justifyContent` to `center`.
      // Try setting `flexDirection` to `row`.
      <View style={{
        flex: 1,
      }}>
        <View style={{
          flex: 1,
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'stretch',
        }}>
          <View style={{width: 50, height: 50, backgroundColor: 'powderblue'}} />
          <View style={{width: 50, height: 50, backgroundColor: 'skyblue'}} />
          <View style={{height: 50, backgroundColor: 'steelblue'}} />
        </View>
      </View>
    );
  }
};

export default class UseCamera extends React.Component{

  state = {
    hasCameraPermission: null,
    direction: Camera.Constants.Type.back,
    ratio: this.setAppropriateRatio(),
  };

  async componentWillMount() {
    const { status } = await Permissions.askAsync(Permissions.CAMERA);
    this.setState({ hasCameraPermission: status === 'granted'});
  }

  setAppropriateRatio(){
    let { height, width } = Dimensions.get('window');
    console.log("Height:"+height+"\tWidth:"+width);
    let a = this.reduce(height, width);
    console.log(`${a[0]}:${a[1]}`);
    return `${a[0]}:${a[1]}`;
  }

  reduce(numerator,denominator){
    var gcd = function gcd(a,b){
      return b ? gcd(b, a%b) : a;
    };
    gcd = gcd(numerator,denominator);
    return [numerator/gcd, denominator/gcd];
  }

  render(){
    const { hasCameraPermission } = this.state;
    if (hasCameraPermission === null) {
      return (
        <View style={{flex:1}}>
          <JustifyContentBasics/>
        </View>
      );
    } else if (hasCameraPermission === false) {
      return <Text>No access to camera</Text>;
    } else {
      return (
        <View style={{flex:1, flexDirection:'row', justifyContent:'center'}}>
          <Camera style={{flex:1}} type={this.state.type} ratio={this.state.ratio}>
          </Camera>
        </View>
      );
    }
  }
}

// skip this line if using Create React Native App
AppRegistry.registerComponent('AwesomeProject', () => JustifyContentBasics);