

import { Navigation } from "react-native-navigation";
import App from '../App';
import Drawer from "../drawer"
import Ionicons from 'react-native-vector-icons/Ionicons';
import { Provider } from 'react-redux';
import { iconsMap } from './utils/AppIcons';
import { registerScreens } from './screens';
import configureStore from './store/configureStore';
const store = configureStore()






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

Navigation.events().registerAppLaunchedListener(() => {
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
});


