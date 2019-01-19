import React, { Component } from 'react';
import { StyleSheet, Text, View, Platform, AppRegistry, Button } from 'react-native';
import { Constants, Location, Permissions } from 'expo';
import { MapView } from 'expo';


export default class App extends React.Component {

  constructor(props){
    super(props);
    this.state = {currentColor: "#841584"};
  }

  setRandomColor = () => {
    var letters = '0123456789ABCDEF';
    var color = '#';
    for (var i = 0; i < 6; i++) {
      color += letters[Math.floor(Math.random() * 16)];
    }

    this.setState( () => {
      return { currentColor: color };
    });

    console.log('button clicked!')
    console.log(color);
    console.log(this.state);
  };
  
  render() {
    return (
      <View style={styles.container}>
        <Button
          onPress={this.setRandomColor}
          title="Change color"
          color={this.state.currentColor}
        />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});