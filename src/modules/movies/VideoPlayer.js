import React, { Component } from 'react'
import { View, StatusBar } from 'react-native'
import VideoPlayer from 'react-native-true-sight'

import KeepAwake from 'react-native-keep-awake';
export default class HomeScreen extends Component {
    constructor(props) {
        super(props)
    }
    render() {
        return (

            <View style={{ flex: 1, backgroundColor: 'black' }}>
                <StatusBar hidden={true} />
                <VideoPlayer source={this.props.url} />
                <KeepAwake />
            </View>
        )
    }
}