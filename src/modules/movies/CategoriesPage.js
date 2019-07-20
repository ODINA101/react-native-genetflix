import React, { PropTypes, Component } from 'react';
import {
    Platform,
    View,
    ListView,
    RefreshControl
} from 'react-native';
import axios from 'axios';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import { TMDB_URL, TMDB_API_KEY } from '../../constants/api';
import { Navigation } from "react-native-navigation"
import * as moviesActions from './movies.actions';
import CardThree from './components/CardThree';
import ProgressBar from '../_global/ProgressBar';
import styles from './styles/MoviesList';
import { iconsMap } from '../../utils/AppIcons';
import { AsyncStorage } from 'react-native';

import CardFour from './components/CardFour';
import Categories from './categories'
class CategoriesPage extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isLoading: true,
            isRefreshing: false,
            currentPage: 1,
            list: []
        };
        //	this.props.navigator.setOnNavigatorEvent(this._onNavigatorEvent.bind(this));
    }

    componentWillMount() {
        this._retrieveMoviesList();
    }

    async _retrieveMoviesList(isRefreshed) {
        var data = Categories;
        const ds = new ListView.DataSource({ rowHasChanged: (row1, row2) => row1 !== row2 });
        const dataSource = ds.cloneWithRows(data);
        this.setState({
            list: data,
            dataSource,
            isLoading: false
        });



        if (isRefreshed && this.setState({ isRefreshing: false }));
    }


    _onRefresh() {
        this.setState({ isRefreshing: true });
        this._retrieveMoviesList('isRefreshed');
    }

    _onNavigatorEvent(event) {
        if (event.type === 'NavBarButtonPress') {
            if (event.id === 'close') {
                this.props.navigator.dismissModal();
            }
        }
    }


    componentDidMount() {
        this.navigationEventListener = Navigation.events().bindComponent(this);
    }


    navigationButtonPressed({ buttonId }) {
        if (buttonId == "backButton") {
            Navigation.dismissModal(this.props.componentId);

        }
    }


    _viewCat(id, title, isCollection) {

        if (isCollection) {
            Navigation.showModal({
                stack: {
                    children: [{
                        component: {
                            name: 'movieapp.ColMoviesList',
                            passProps: {
                                title,
                                id
                            },
                            options: {
                                topBar: {
                                    height: 60,
                                    background: {
                                        color: "#0a0a0a",
                                    },
                                    title: {
                                        text: title,
                                        color: "#FFF"
                                    },
                                    leftButtons: [
                                        {
                                            id: 'backButton',
                                            icon: iconsMap['ios-arrow-round-back'],
                                            color: "#FFF"
                                        }
                                    ],
                                },
                            },
                        }
                    }]
                }
            })
        } else {
            Navigation.showModal({
                stack: {
                    children: [{
                        component: {
                            name: 'movieapp.CatMoviesList',
                            passProps: {
                                title,
                                id
                            },
                            options: {
                                topBar: {
                                    height: 60,
                                    background: {
                                        color: "#0a0a0a",
                                    },
                                    title: {
                                        text: title,
                                        color: "#FFF"
                                    },
                                    leftButtons: [
                                        {
                                            id: 'backButton',
                                            icon: iconsMap['ios-arrow-round-back'],
                                            color: "#FFF"
                                        }
                                    ],
                                },
                            },
                        }
                    }]
                }
            })

        }
    }






    render() {
        return (
            this.state.isLoading ? <View style={styles.progressBar}></View> :
                <ListView
                    style={styles.list}
                    contentContainerStyle={{
                        flexDirection: 'row',
                        flexWrap: 'wrap',
                        justifyContent: 'center',
                        backgroundColor: 'black'
                    }}
                    enableEmptySections
                    onEndReachedThreshold={1200}
                    dataSource={this.state.dataSource}
                    renderRow={(item, i) => {
                        return (

                            <CardFour fd={true} key={i} collections={false} info={item} viewCat={(id, title) => this._viewCat(id, title, false)} />
                        )
                    }}


                    renderFooter={() => <View style={{ height: 50 }}></View>}
                    refreshControl={
                        <RefreshControl
                            refreshing={this.state.isRefreshing}
                            onRefresh={() => {}}
                            colors={['#EA0000']}
                            tintColor="white"
                            title="loading..."
                            titleColor="transparent"
                            progressBackgroundColor="transparent"
                        />
                    }
                />
        );
    }
}

let navigatorStyle = {};

if (Platform.OS === 'ios') {
    navigatorStyle = {
        navBarTranslucent: true,
        drawUnderNavBar: true
    };
} else {
    navigatorStyle = {
        navBarBackgroundColor: '#0a0a0a'
    };
}

CategoriesPage.navigatorStyle = {
    ...navigatorStyle,
    statusBarColor: 'black',
    statusBarTextColorScheme: 'light',
    navBarTextColor: 'white',
    navBarButtonColor: 'white'
};

function mapStateToProps(state, ownProps) {
    return {
        list: state.movies.nowPlayingMovies
    };
}

function mapDispatchToProps(dispatch) {
    return {
        actions: bindActionCreators(moviesActions, dispatch)
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(CategoriesPage);
