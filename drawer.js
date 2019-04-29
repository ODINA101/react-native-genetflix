import React, { Component } from 'react';
import {
    StyleSheet,
    View,
    Text,
} from 'react-native';


export default class Drawer extends Component {

    constructor(props) {
        super(props);
        this.state = {

        };
    }

    componentWillReceiveProps(nextProps) {

    }

    render() {
        return ( <View style = { styles.container } >
            
            
            </View>
        );
    }

}

const styles = StyleSheet.create({
    container: {
        flex:1,
        backgroundColor:"black"
    },
});