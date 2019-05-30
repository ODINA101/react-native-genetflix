import * as React from 'react';
import { View, Image, StyleSheet, TouchableOpacity } from 'react-native';
import * as PropTypes from 'prop-types';
import PlayerIcon from './PlayerIcon';
import { playerPlay, playerPause, playerRestart, playerSettings } from "./images/index";
import Touchable from "react-native-platform-touchable"
import Ionicons from "react-native-vector-icons/Ionicons"
import { Navigation } from "react-native-navigation"
export default class TopControlsBar extends React.Component {
    constructor(props) {
        super(props);
        this.restartVideo = () => this.props.setPosition(0);
    }
    render() {
        return (
            <View style={{ flex: 1, flexDirection: "row", justifyContent: "space-between", paddingTop: 20 }}>
                <Touchable
                    onPress={() => {
                        Navigation.dismissModal(this.props.componentId);
                    }}
                    style={{
                        width: 50,
                        height: 50,
                        borderRadius: 25
                    }}>
                    <Ionicons style={{ padding: 10 }} name="ios-arrow-back" size={30} color="#FFF" />
                </Touchable>
                {
                    //<PlayerIcon  iconSource={playerSettings} onPress={() => this.props.toggleSettings()}/>
                }

            </View>

        )

    }
}

const styles = StyleSheet.create({
    barWrapper: {

        height: 70,
        backgroundColor: 'rgba(0, 0, 0, 0.25)',
        borderRadius: 5
    },
    barItem: {
        margin: 5
    },
    iconWrapper: {
        padding: 5
    },
    icon: {
        margin: 15,
        width: 30,
        height: 30,
        tintColor: '#fafafa'
    }
});
