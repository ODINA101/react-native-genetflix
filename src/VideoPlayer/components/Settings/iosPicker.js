import React, { Component } from "react"
import { View } from "react-native"
import { Container, Header, Content, Picker, Form } from "native-base"

export default class IOSpicker extends Component {
  constructor(props) {
    super(props)
    this.state = {
      selected: "key1"
    };



  }
  onValueChange(value: string) {
    this.setState({
      selected: value
    });
  }

  parseQuality(data) {

    var quals = this.props.qualities.map(item => parseInt(item))



    if (parseInt(data) == Math.max(...quals)) {
      return "HD"
    } else {
      return "SD"
    }

  }


  QualityExtract(data) {

    var quals = this.props.qualities.map(item => parseInt(item))

    if (data == "SD") {
      return Math.min(...quals)
    } else {
      return Math.max(...quals)
    }

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
  render() {
    if (!this.props.languagePicker) {

      return (
        <Picker
          note
          mode="dropdown"
          style={{ width: 120 }}
          selectedValue={parseInt(this.QualityExtract(this.props.settings.qual))}
          onValueChange={(data) => { this.props.onValueChange(data) }}
        >
          {

            this.props.qualities.map(item => {

              return (

                <Picker.Item label={this.parseQuality(item)} value={parseInt(item)} />
              )

            })

          }
        </Picker>

      );


    } else {
      return (
        <Picker
          note
          mode="dropdown"
          style={{ width: 120 }}
          selectedValue={this.props.settings.lang}
          onValueChange={(data) => { this.props.onValueChange(data) }}
        >
          {

            this.props.langs.map(item => {

              return (

                <Picker.Item label={this.parseLanguage(item)} value={(item).toString()} />
              )

            })

          }
        </Picker>

      );
    }

  }


}
