import React, { Component } from 'react';
import { View, Text, Picker, TouchableOpacity, Image, StyleSheet, ImageBackground, Platform } from 'react-native';
import { playerLanguage, playerVideo } from '../images';
import { connect } from "react-redux"
import Touchable from 'react-native-platform-touchable';
//import IOSpicker from "./iosPicker"
import Ionicons from 'react-native-vector-icons/Ionicons';
class Settings extends Component {
  constructor(props) {
    super(props)
    this.state = {
      language: "Georgian",
      quality: "Hd",

    }

    console.log(props)

  }

  parseLanguage(data) {
    switch (data) {
      case "Georgian":
        return "ქართული"
      case "English":
        return "ინგლისური"
      case "Russian":
        return "რუსული"

    }
  }
  parseQuality(data) {

    var quals = this.props.qualities.map(item => parseInt(item))



    if (parseInt(data) == Math.max(...quals)) {
      return "HD"
    } else {
      return "SD"
    }



  }

  render() {
    return (
      <View style={{ flex: 1, backgroundColor: "rgba(0,0,0,.8)" }}>

        <TouchableOpacity style={{ padding: 20 }} onPress={() => this.props.toggleModal()}>
          <Ionicons name="ios-arrow-back" size={40} color="#FFF" />
        </TouchableOpacity>


        <View style={{ flex: 1, backgroundColor: "rgba(0,0,0,.8)", alignItems: 'center', justifyContent: 'center', opacity: 0.8 }}>
          <View style={{ flex: 1, flexDirection: "row", height: 100 }}>

            <View style={{ flex: 1, flexDirection: "row", alignItems: "center" }}>
              <Image style={{ width: 40, height: 25 }} source={playerVideo} />

              {

                Platform.OS == "android" ? (
                  <Picker
                    style={{ width: 150, color: "#FFF" }}
                    selectedValue={this.props.settings.qual}
                    onValueChange={(qual) => {


                      this.setState({ quality: qual })
                      this.props.changeQuality(qual)
                      this.props.onSetQuality(qual)

                    }}>

                    {

                      this.props.qualities.map(item => {

                        return (

                          <Picker.Item label={this.parseQuality(item)} value={item} />
                        )

                      })

                    }

                  </Picker>

                ) : (
                    <IOSpicker
                      style={{ width: 150 }}
                      languagePicker={false}
                      onValueChange={(qual) => {


                        this.setState({ quality: qual })
                        this.props.changeQuality(qual)
                        this.props.onSetQuality(qual)

                      }}

                      {...this.props} />
                  )


              }




            </View>

            <View style={{ flex: 1, flexDirection: "row", alignItems: "center" }}>


              <Image style={{ width: 40, height: 40 }} source={playerLanguage} />
              {
                Platform.OS == "android" ? (
                  <Picker

                    ref={(picker) => { this.langPicker = picker; }}
                    style={{ width: 150, color: "#FFF", paddingRight: 20 }}
                    selectedValue={this.props.settings.lang}
                    onValueChange={(lang) => {
                      console.log(lang)
                      this.props.changeLanguage(lang)
                      this.setState({ language: lang });
                      this.props.onLangSet(lang)
                    }}>
                    {

                      this.props.langs.map(item => {

                        return (

                          <Picker.Item label={this.parseLanguage(item)} value={item} />
                        )

                      })

                    }

                  </Picker>
                ) : (
                    <IOSpicker
                      style={{ width: 150 }}
                      languagePicker={true}
                      onValueChange={(lang) => {


                        this.setState({ quality: lang })
                        this.props.changeQuality(lang)
                        this.props.onSetQuality(lang)

                      }}

                      {...this.props} />
                  )


              }

            </View>
          </View>
        </View>
      </View>
    );
  }
}


function mapStateToProps(state) {
  return { settings: state.Settings }
}
function mapDispatchToProps(dispatch) {
  return {
    changeLanguage: (data) => { dispatch({ type: "changeLanguage", payload: data }) },
    changeQuality: (data) => { dispatch({ type: "changeQuality", payload: data }) }
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Settings)
