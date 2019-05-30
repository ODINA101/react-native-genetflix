/*
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */

import React, { Component } from 'react';
import { Platform, StyleSheet, Text, View, Modal, StatusBar } from 'react-native';
import { TouchableOpacity } from 'react-native';
import Settings from './components/Settings';

import VideoPlayer from './components/VideoPlayer';
export default class MoviePlayer extends Component {
  constructor(props) {
    super(props)






    this.state = {
      modalVisible: false,
      fullScreen: true,
      lang: "",
      qual: "",
      mainURL: ''
    }




  }
  setModalVisible = (visible) => {
    this.setState({ modalVisible: !this.state.modalVisible });
  }




  render() {



    return (

      <View style={{
        flex: 1,
        backgroundColor: 'black'
      }}>

        <StatusBar hidden={true} />
        <VideoPlayer
          componentId={this.props.componentId}
          changeScreen={() => {
            this.setState({
              fullScreen: !this.state.fullScreen
            });
          }}
          toggleSettings={() => this.setState({
            modalVisible: !this.state.modalVisible
          })}

          Captions={this.props.Captions}
          source={this.props.url} />


      </View>

    );

  }
}
