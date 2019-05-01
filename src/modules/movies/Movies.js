import React, { PropTypes, Component } from 'react';
import {
	RefreshControl,
	ScrollView,
	Text,
	TouchableOpacity,
	View,
	Platform
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import Swiper from 'react-native-swiper';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { Navigation } from 'react-native-navigation';
import * as moviesActions from './movies.actions';
import CardOne from './components/CardOne';
import CardTwo from './components/CardTwo';
import CardFour from './components/CardFour';
import ProgressBar from '../_global/ProgressBar';
import styles from './styles/Movies';
import { iconsMap } from '../../utils/AppIcons';
import axios from "axios"
import List from "./categories"
import InAppBilling from "react-native-billing";

import {
	AdMobBanner,
	AdMobInterstitial,
	PublisherBanner,
	AdMobRewarded,
} from 'react-native-admob'
class Movies extends Component {
	constructor(props) {
		super(props);

		this.state = {
			isLoading: true,
			isRefreshing: false,
			collections: []
		};

		this._viewMovie = this._viewMovie.bind(this);
		this._onRefresh = this._onRefresh.bind(this);
		this.openSearch = this.openSearch.bind(this)
		this._retrieveMovies = this._retrieveMovies.bind(this)
		// 	this.props.navigator.setOnNavigatorEvent((event)=> {
		// 		if (event.type === 'NavBarButtonPress') {
		// 		if(event.id === 'Search') {
		//  this.openSearch()
		// 		}
		// 	}
		// 	});


		//alert(JSON.stringify(props))
		//.setOnNavigatorEvent(this.onNavigatorEvent.bind(this))
		AdMobInterstitial.setAdUnitID('ca-app-pub-6370427711797263/7435578378');
		//	this.checkSubscription()
		//AdMobInterstitial.requestAd().then(() => AdMobInterstitial.showAd());
		//alert(List)
		//  this.props.navigator.setButtons({leftButtons:[{id:'sideMenu'}],rightButtons:[
		// 	 {
		// 			id: 'Search',
		// 			title: 'Search',
		// 			icon: iconsMap['ios-search']
		// 		}
		// 	 ]})


		Navigation.mergeOptions(this.props.componentId, {
			// sideMenu:{
			// 	  left: {
			//       visible: true
			//     }
			// },
			topBar: {
				leftButtons: [
					{ id: 'sideMenu', icon: iconsMap['ios-menu'], color: "#FFF" }
				],
				rightButtons: [{
					id: 'Search',
					title: 'Search',
					icon: iconsMap['ios-search'],
					color: "#FFF"
				}]
			}
		});



	}

	componentWillMount() {
		this._retrieveMovies();
		if (this.navigationEventListener) {
			this.navigationEventListener.remove();
		}
		setTimeout(() => {
			this.checkSubscription()
		}, 1000)
	}


	async checkSubscription() {
		try {
			await InAppBilling.open();
			// If subscriptions/products are updated server-side you
			// will have to update cache with loadOwnedPurchasesFromGoogle()
			await InAppBilling.loadOwnedPurchasesFromGoogle();
			const isSubscribed = await InAppBilling.isSubscribed("noads597")
			//   alert("Customer subscribed: " + isSubscribed);
			if (!isSubscribed) {
				AdMobInterstitial.requestAd().then(() => AdMobInterstitial.showAd());
			}

		} catch (err) {
			console.log(err);
		} finally {
			await InAppBilling.close();
		}
	}



	componentDidMount() {
		this.navigationEventListener = Navigation.events().bindComponent(this);



	}

	navigationButtonPressed({ buttonId }) {
		//alert("aee chemi kargi movtyan exla gedemeketa")

		if (buttonId == "sideMenu") {

			Navigation.mergeOptions(this.props.componentId, {
				sideMenu: {
					left: {
						visible: true
					}
				},
				topBar: {
					leftButtons: [
						{ enabled: true, id: 'sideMenu', icon: iconsMap['ios-menu'], color: "#FFF" }
					],
					rightButtons: [{
						enabled: true,
						id: 'Search',
						title: 'Search',
						icon: iconsMap['ios-search'],
						color: "#FFF"
					}]
				}
			});
		}



		if (buttonId == "Search") {
			this.openSearch()
		}
	}


	onNavigatorEvent(event) {
		console.log(event)
		// only shows the above-metioned events
	}
	openSearch() {
		Navigation.showModal({
			stack: {
				children: [{
					component: {
						name: 'movieapp.Search',
						passProps: {
							text: 'stack with one child'
						},
						options: {
							topBar: {
								height: 60,
								background: {
									color: "#0a0a0a",
								},
								title: {
									text: 'ძიება',
									color: "#FFF"
								},
								leftButtons: [
									{
										id: 'backButton',
										icon: iconsMap['ios-arrow-round-back'],
										color: "#FFF"
									}],
							}
						}
					}
				}]
			}
		});

	}


	_retrieveMovies(isRefreshed) {

		this.props.actions.retrieveNowPlayingMovies("test", (data) => {
			this.props.actions.retrievePopularMovies("test", (data) => {
				try {
					this.setState({ isLoading: false }, (e) => {
						//  alert(e)

					})
				} catch (e) {
					//	alert(e)
				}


			})

		});

		axios.get("http://adjaranet.com/req/jsondata/req.php?reqId=getCollections")
			.then(res => {
				res = res.data;
				var FinalData = [];


				Object.values(res).forEach((item, i) => {
					FinalData.push({
						name: item.name,
						id: Object.keys(res)[i]
					})
				})


				//alert(JSON.stringify(res.data))
				this.setState({ collections: FinalData, isLoading: false })
			})



		if (isRefreshed && this.setState({ isRefreshing: false }));
	}











	_viewMoviesList(type, title) {
		// let rightButtons = [];
		// if (Platform.OS === 'ios') {
		// 	rightButtons = [
		// 		{
		// 			id: 'close',
		// 			title: 'Close',
		// 			icon: iconsMap['ios-close']
		// 		}
		// 	];
		// this.props.navigator.showModal({
		// 	title,
		// 	screen: 'movieapp.',
		// 	passProps: {
		// 		type
		// 	},
		// 	navigatorButtons: {
		// 		rightButtons
		// 	}
		// });

		Navigation.showModal({
			stack: {
				children: [{
					component: {
						name: 'movieapp.MoviesList',
						passProps: {
							type
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

	_viewColCat() {

		this.props.navigator.showModal({
			title: "test",
			screen: 'movieapp.CatCol',
			passProps: {
				title: "test",
				id: 266
			},
			backButtonHidden: false,
		});

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
		this._retrieveMovies('isRefreshed');
	}

	_onNavigatorEvent(event) {
		if (event.type === 'NavBarButtonPress') {
			if (event.id === 'search') {
				let rightButtons = [];
				if (Platform.OS === 'ios') {
					rightButtons = [
						{
							id: 'close',
							title: 'Close',
							icon: iconsMap['ios-close']
						}
					];
				}
				this.props.navigator.showModal({
					screen: 'movieapp.Search',
					title: 'Search',
					navigatorButtons: {
						rightButtons
					}
				});
			}
		}
	}



	render() {
		const { nowPlayingMovies, popularMovies } = this.props;
		const iconPlay = <Icon name="md-play" size={21} color="#9F9F9F" style={{ paddingLeft: 3, width: 22 }} />;
		const iconTop = <Icon name="md-trending-up" size={21} color="#9F9F9F" style={{ width: 22 }} />;
		const iconUp = <Icon name="md-recording" size={21} color="#9F9F9F" style={{ width: 22 }} />;

		return (
			this.state.isLoading ? <View style={styles.progressBar}><ProgressBar /></View> :
				<ScrollView
					style={[styles.container]}
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
					}>
					<Swiper
						style={{ marginTop: 60 }}
						autoplay
						autoplayTimeout={4}
						showsPagination={false}
						height={248}>
						{nowPlayingMovies.map(info => (
							<CardOne key={info.id} info={info} viewMovie={() => this._viewMovie(info.id, info)} />
						))}
					</Swiper>
					<View>

						<View style={styles.listHeading}>
							<Text style={styles.listHeadingLeft}>კატეგორიები</Text>

						</View>
						<ScrollView horizontal showsHorizontalScrollIndicator={false}>
							{
								List.map((item, i) => {
									return (
										<CardFour key={i} collections={false} info={item} viewCat={(id, title) => this._viewCat(id, title, false)} />
									)
								})
							}
						</ScrollView>

						<View style={styles.listHeading}>
							<Text style={styles.listHeadingLeft}>კოლექციები</Text>
						</View>
						<ScrollView horizontal showsHorizontalScrollIndicator={false}>
							{
								this.state.collections.map((item, i) => {
									return (
										<CardFour key={i} collections={true} info={item} viewCat={(id, title) => this._viewCat(id, title, true)} />
									)
								})
							}
						</ScrollView>


						<View style={styles.listHeading}>
							<Text style={styles.listHeadingLeft}>ფილმები ქართულად</Text>
							<TouchableOpacity>
								<Text
									style={styles.listHeadingRight}
									onPress={this._viewMoviesList.bind(this, 'ფილმები ქართულად', 'ფილმები ქართულად')}>
									ყველა
							</Text>
							</TouchableOpacity>
						</View>
						<ScrollView horizontal showsHorizontalScrollIndicator={false}>
							{nowPlayingMovies.map(info => (
								<CardTwo key={info.id} info={info} viewMovie={() => this._viewMovie(info.id, info)} />
							))}
						</ScrollView>




						<View style={styles.listHeading}>
							<Text style={styles.listHeadingLeft}>პრემიერა</Text>
							{/* <TouchableOpacity>
								<Text
									style={styles.listHeadingRight}
									onPress={this._viewMoviesList.bind(this, 'ფილმები ქართულად', 'პრემიერა')}>
									ყველა
										</Text>
							</TouchableOpacity> */}
						</View>
						<ScrollView horizontal showsHorizontalScrollIndicator={false}>
							{
								popularMovies.map(info => (
									<CardTwo key={info.id} info={info} viewMovie={this._viewMovie} />
								))

							}
						</ScrollView>


						<View style={styles.browseList}>
						</View>
					</View>
				</ScrollView>
		);
	}
}


function mapStateToProps(state, ownProps) {
	return {
		popularMovies: state.movies.popularMovies,
		nowPlayingMovies: state.movies.nowPlayingMovies
	};
}

function mapDispatchToProps(dispatch) {
	return {
		actions: bindActionCreators(moviesActions, dispatch)
	};
}

export default connect(mapStateToProps, mapDispatchToProps)(Movies);
