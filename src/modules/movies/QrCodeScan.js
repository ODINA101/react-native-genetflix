import React, { Component } from 'react';
import { Platform, StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import { QRscanner } from 'react-native-qr-scanner';
import { Navigation } from "react-native-navigation"
import SimpleCrypto from "simple-crypto-js";
import { iconsMap } from '../../utils/AppIcons';
import Spinner from 'react-native-loading-spinner-overlay';
export default class Scanner extends Component {
    constructor(props) {
        super(props);
        this.state = {
            flashMode: false,
            zoom: 0.2,
            spinner: false
        };
    }
    _viewMovie(movieId, info) {

        fetch(`http://net.adjara.com/req/jsondata/req.php?id=${movieId}&reqId=getInfo`)
            .then(res => res.json())
            .then(res => {
                if (res['1']) {
                    console.log('serialia');
                    Navigation.showModal({
                        stack: {
                            children: [{
                                component: {
                                    name: 'movieapp.Serie',
                                    passProps: {
                                        movieId,
                                        item: info
                                    },
                                    options: {
                                        topBar: {
                                            height: 60,
                                            elevation: 0,
                                            drawBehind: true,
                                            background: {
                                                color: 'transparent'
                                            },

                                            rightButtons: [
                                                {
                                                    id: "love",
                                                    icon: iconsMap['ios-heart-empty'],
                                                    color: "#FFF"
                                                },
                                                {
                                                    id: 'close',
                                                    icon: iconsMap['ios-arrow-round-down'],
                                                    color: "#FFF"
                                                }
                                            ]
                                        }
                                    }
                                }
                            }]
                        }
                    });
                } else {
                    console.log('filmia');
                    Navigation.showModal({
                        stack: {
                            children: [{
                                component: {
                                    name: 'movieapp.Movie',
                                    passProps: {
                                        movieId,
                                        item: info
                                    },
                                    options: {
                                        topBar: {
                                            height: 60,
                                            elevation: 0,
                                            drawBehind: true,
                                            background: {
                                                color: 'transparent'
                                            },

                                            rightButtons: [
                                                {
                                                    id: "love",
                                                    icon: iconsMap['ios-heart-empty'],
                                                    color: "#FFF"
                                                },
                                                {
                                                    id: 'close',
                                                    icon: iconsMap['ios-arrow-round-down'],
                                                    color: "#FFF"
                                                }
                                            ]
                                        }
                                    }
                                }
                            }]
                        }
                    });
                }
            });
    }


    componentDidMount() {
        this.navigationEventListener = Navigation.events().bindComponent(this);
    }

    componentWillMount() {
        if (this.navigationEventListener) {
            this.navigationEventListener.remove();
        }
    }

    navigationButtonPressed({ buttonId }) {
        if (buttonId == "backButton") {
            Navigation.dismissModal(this.props.componentId);

        }
    }


    render() {
        return (
            <View style={styles.container}>
                <QRscanner onRead={this.onRead} hintText={''} renderBottomView={this.bottomView} flashMode={this.state.flashMode} zoom={this.state.zoom} finderY={0} />
            </View>
        );
    }
    bottomView = () => {
        return (
            <View style={{ flex: 1, flexDirection: 'row', backgroundColor: '#0000004D' }}>
                <TouchableOpacity style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }} onPress={() => this.setState({ flashMode: !this.state.flashMode })}>
                    <Text style={{ color: '#fff' }}>ფლეშის ჩართვა/გამორთვა</Text>
                </TouchableOpacity>
                <Spinner
                    visible={this.state.spinner}
                    textContent={'Loading...'}
                    textStyle={styles.spinnerTextStyle}
                />
            </View>
        );
    }
    onRead = (res) => {
        //       alert(res.data)

        var _secretKey = "q2";
        var simpleCrypto = new SimpleCrypto(_secretKey);
        var ded = simpleCrypto.decrypt(res.data);
        let data = JSON.parse(ded)
        let decipherText = data.id;
        //alert(decipherText)
        if (decipherText) {
            this.setState({ spinner: true })
            let info = {};
            info.title_ge = data.title_ge;
            info.title_en = data.title_en
            info.poster = "http://staticnet.adjara.com/moviecontent/" + decipherText + "/covers/214x321-" + decipherText + ".jpg";

            info.id = decipherText;
            fetch("http://net.adjara.com/req/jsondata/req.php?id=" + decipherText + "&reqId=getInfo")
                .then(res => res.json())
                .then(res => {
                    let genres = Object.keys(res.genres).map(i => res.genres[i])
                    let director = Object.keys(res.director).map(i => res.director[i]);
                    if (director.length > 0) {
                        //this.setState({ Directed: director[0] })
                        info.director = director[0];

                    }

                    info.genres = genres;
                    info.description = res.desc[0];



                    fetch(
                        "http://net.adjara.com/req/jsondata/req.php?id=" + decipherText +
                        "&reqId=getLangAndHd"
                    )
                        .then(res => res.json())
                        .then(res => {
                            let actors = [];
                            var info = Object
                                .keys(res)
                                .map(i => res[i])
                            Object
                                .keys(res.cast)
                                .map(async (item) => {
                                    actors.push({ id: item, name: res.cast[item] })
                                })
                            info.actors = actors;
                            info.poster = "http://staticnet.adjara.com/moviecontent/" + decipherText + "/covers/214x321-" + decipherText + ".jpg"

                        })
                })
            this.setState({ spinner: false })
            this._viewMovie(decipherText, info)
        }
    }
}
const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#000'
    }
});