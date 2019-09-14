/* @flow */

import React, { Component } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Dimensions
} from 'react-native';
import ImageBackground from "./ImageBackground"
import img from "../kuka.jpeg"
//const scWidth = Dimensions.get("window").width;
export default class CardFour extends Component {
  constructor(props) {
    super(props)
  }
  render() {

    let name;
    if (this.props.collections) {
      name = this.props.info.name;
    } else {
      name = this.props.info.label;
    }


    return (
      <TouchableOpacity activeOpacity={0.6} onPress={() => this.props.viewCat(this.props.info.id, name, this.props.collections)} style={{
        height: this.props.fd ? (130) : (80),
        width: this.props.fd ? (160) : (130),
        backgroundColor: "black",
        margin: 10,
        justifyContent: 'center',
        alignItems: 'center',
        textAlign: 'center',
        borderRadius: 20,
        overflow: 'hidden'
      }}>
        {
          this.props.collections ? (
            <ImageBackground
              resizeMode="cover"
              opacity={0.5}
              borderRadius={20}
              source={{ uri: "http://staticnet.adjara.com/collections/thumb/" + this.props.info.id + "_big.jpg" }} style={{ flex: 1 }}>
            </ImageBackground>
          ) : (
              <ImageBackground
                borderRadius={20}
                resizeMode="cover"
                opacity={0.5}
                source={{ uri: 'http:' + this.props.info.url ? (this.props.info.url) : ("https://upload.wikimedia.org/wikipedia/commons/thumb/6/6c/No_image_3x4.svg/1280px-No_image_3x4.svg.png") }} style={{ flex: 1 }}>
              </ImageBackground>
            )
        }


        {
          this.props.collections ? (
            <Text style={{ color: "#FFF", fontWeight: 'bold', width: 80 }}>{this.props.info.name}</Text>
          ) : (

              <Text style={{ color: "#FFF", fontWeight: 'bold' }}>{this.props.info.label}</Text>
            )

        }

      </TouchableOpacity>
    );
  }
}

const styles = StyleSheet.create({
  container: {


  },
});
