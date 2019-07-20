

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
import * as moviesActions from './movies.actions';
import CardThree from './components/CardThree';
import ProgressBar from '../_global/ProgressBar';
import styles from './styles/MoviesList';
import { iconsMap } from '../../utils/AppIcons';
import { Navigation } from 'react-native-navigation'
class ActorMoviesList extends Component {
    constructor(props) {
        super(props);

        this.state = {
            isLoading: true,
            isRefreshing: false,
            currentPage: 1,
            list: []
        };

        this._viewMovie = this._viewMovie.bind(this);
        this._onRefresh = this._onRefresh.bind(this);
        //this.props.navigator.setOnNavigatorEvent(this._onNavigatorEvent.bind(this));
    }

    componentWillMount() {
        this._retrieveMoviesList();
    }

    _retrieveMoviesList(isRefreshed) {
        //http://adjaranet.com/req/jsondata/req.php?reqId=getActorMovies&id=
        axios.get("http://adjaranet.com/req/jsondata/req.php?reqId=getActorMovies&id=" + this.props.id)
            .then((res) => {
                const data = this.state.list;
                const newData = res.data;
                console.log(newData)
                newData.map((item, index) => data.push(item))
                const ds = new ListView.DataSource({ rowHasChanged: (row1, row2) => row1 !== row2 });
                const dataSource = ds.cloneWithRows(this.state.list);
                this.setState({
                    list: data,
                    dataSource,
                    isLoading: false
                });
            })

        if (isRefreshed && this.setState({ isRefreshing: false }));
    }


    componentDidMount() {
        this.navigationEventListener = Navigation.events().bindComponent(this);
    }


    navigationButtonPressed({ buttonId }) {
        if (buttonId == "backButton") {
            Navigation.dismissModal(this.props.componentId);

        }
    }
    _viewMovie(movieId, info) {

        fetch(`http://net.adjara.com/req/jsondata/req.php?id=${info.id}&reqId=getInfo`)
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

    render() {
        return (
            this.state.isLoading ? <View style={styles.progressBar}><ProgressBar /></View> :
                <ListView
                    style={styles.container}
                    enableEmptySections
                    onEndReachedThreshold={1200}
                    dataSource={this.state.dataSource}
                    renderRow={rowData => <CardThree info={rowData} viewMovie={() => { this._viewMovie(rowData.id, rowData) }} />}
                    renderSeparator={(sectionId, rowId) => <View key={rowId} style={styles.seperator} />}
                    renderFooter={() => <View style={{ height: 50 }}><ProgressBar /></View>}
                    refreshControl={
                        <RefreshControl
                            refreshing={this.state.isRefreshing}
                            onRefresh={this._onRefresh}
                            colors={['#EA0000']}
                            tintColor="white"
                            title="loading..."
                            titleColor="white"
                            progressBackgroundColor="white"
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

ActorMoviesList.navigatorStyle = {
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

export default connect(mapStateToProps, mapDispatchToProps)(ActorMoviesList);
