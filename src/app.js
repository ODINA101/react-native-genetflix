

import { Navigation } from "react-native-navigation";
import App from '../App';
import React, { Component } from 'react'
import { View, Text } from 'react-native'
import Drawer from "../drawer"
import Ionicons from 'react-native-vector-icons/Ionicons';
import { Provider } from 'react-redux';
import { iconsMap } from './utils/AppIcons';
import { registerScreens } from './screens';
import configureStore from './store/configureStore';
import codePush from 'react-native-code-push'

const store = configureStore()

codePush.notifyAppReady()




export default class App2 extends Component {
    render() {
        return (
            <View style={{ flex: 1, backgroundColor: '#000', padding: 10, justifyContent: 'center', alignItems: 'center' }}>
                <Text style={{ color: '#FFF', fontSize: 18, lineHeight: 25, marginTop: 40 }}>
                    აპლიკაცია ხელმისაწვდომია მხოლოდ საქართველოში!
</Text>

                <Text style={{ color: '#FFF', fontSize: 40 }}>:(</Text>
            </View>
        )
    }
}
Navigation.events().registerAppLaunchedListener(() => {

    fetch('http://ip-api.com/json')
        .then(res => res.json())
        .then(res => {

            if (res.country == "Georgia" || res.country == "Greece") {

                registerScreens(store, Provider);
                const navigatorStyle = {
                    statusBarColor: 'black',
                    statusBarTextColorScheme: 'light',
                    navigationBarColor: 'black',
                    navBarBackgroundColor: '#0a0a0a',
                    navBarTextColor: 'white',
                    navBarButtonColor: 'white',
                    tabBarButtonColor: 'red',
                    tabBarSelectedButtonColor: 'red',
                    tabBarBackgroundColor: 'white',
                    topBarElevationShadowEnabled: false,
                    navBarHideOnScroll: true,
                    tabBarHidden: true,
                    drawUnderTabBar: true
                };



                Navigation.setRoot({
                    navigatorStyle,
                    root: {
                        sideMenu: {
                            left: {
                                id: "AppSideMenu",
                                component: {
                                    id: "HomeScreenDrawer",
                                    name: "movieapp.Drawer",

                                },
                            },
                            center: {
                                stack: {
                                    id: "AppHomeStack",
                                    children: [
                                        {
                                            component: {
                                                id: "AppHomeScreen",
                                                name: "movieapp.Movies",
                                                options: {
                                                    animations: {
                                                        push: {
                                                            enable: false
                                                        },
                                                    },
                                                    topBar: {
                                                        visible: true,
                                                        drawBehind: true,
                                                        height: 60,
                                                        hideOnScroll: true,
                                                        tabBarHidden: true,
                                                        drawUnderTabBar: true,
                                                        elevation: 3,
                                                        color: "black",
                                                        buttonColor: "#FFF",
                                                        navBarButtonColor: "#FFF",
                                                        background: {
                                                            color: "#0a0a0a",
                                                        },
                                                        leftButtons: [
                                                            {
                                                                id: 'sideMenu'
                                                            }],


                                                    },
                                                    statusBar: {
                                                        style: "black",
                                                    },
                                                },
                                            },
                                        },
                                    ],
                                },
                            },
                        },
                    },
                });

            } else {

                Navigation.registerComponent('navigation.playground.TextScreen', () => App2);
                Navigation.setRoot({
                    root: {
                        stack: {
                            children: [{
                                component: {
                                    name: 'navigation.playground.TextScreen',
                                    passProps: {
                                        text: 'This is tab 1',
                                        myFunction: () => 'Hello from a function!',
                                    }
                                }
                            },
                            ],
                            options: {
                                topBar: {
                                    color: 'black',
                                    visible: false,
                                    drawBehind: true,
                                    background: {
                                        color: "#000",
                                    },
                                }
                            },
                        }
                    }
                });





            }

        })

});

