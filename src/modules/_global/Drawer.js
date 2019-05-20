import React, { Component, PropTypes } from 'react';
import {
	Text,
	View,
	TouchableOpacity,
	ToastAndroid,
	Platform,
	ActivityIndicator
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import LinearGradient from 'react-native-linear-gradient';
import { Navigation } from "react-native-navigation"
import styles from './styles/Drawer';
import { iconsMap } from '../../utils/AppIcons';
import InAppBilling from "react-native-billing";

const itemSkus = Platform.select({
	ios: [
		'noads597'
	],
	android: [
		'noads597'
	]
});
class Drawer extends Component {
	constructor(props) {
		super(props);

		this._goToMovies = this._goToMovies.bind(this);
		this._goToFavorites = this._goToFavorites.bind(this);
		this._openSearch = this._openSearch.bind(this);
		this._goToSeries = this._goToSeries.bind(this);
		this.state = {
			subscribed: null,
			subed: false
		}
		this.checkSubscription()
	}
	async checkSubscription() {
		try {
			await InAppBilling.open();
			await InAppBilling.loadOwnedPurchasesFromGoogle();
			const isSubscribed = await InAppBilling.isSubscribed("noads597")
			//   const isSubscribed2 = await InAppBilling.getProductDetails("noads597")
			// alert(isSubscribed2)
			console.log("Customer subscribed: ", isSubscribed);
			this.setState({ subscribed: true, subed: isSubscribed })
			//alert(isSubscribed)
		} catch (err) {
			//  alert(err);
			//alert(err)
		} finally {
			await InAppBilling.close();
		}
	}



	_openSearch() {
		//this._toggleDrawer();
		// this.props.navigator.showModal({
		// 	screen: 'movieapp.Search',
		// 	title: 'ძიება'
		// });
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
									}
								],
							},
						},
					}
				}]
			}
		})

	}

	_goToMovies() {
		//	this._toggleDrawer();
		Navigation.mergeOptions(this.props.componentId, {
			sideMenu: {
				left: {
					visible: false
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

		Navigation.popTo('movieapp.Movies')
	}


	_goToSeries() {
		// this._toggleDrawer();
		// this.props.navigator.showModal({
		// 	screen: 'movieapp.MoviesList',
		// 	title: 'სერიალები',
		// 	passProps: {
		// 		type: "სერიალები ქართულად"
		// 	}
		// });

		Navigation.mergeOptions(this.props.componentId, {
			sideMenu: {
				left: {
					visible: false
				}
			}
		});
		Navigation.showModal({
			stack: {
				children: [{
					component: {
						name: 'movieapp.MoviesList',
						passProps: {
							type: 'სერიალები ქართულად'
						},
						options: {
							topBar: {
								height: 60,
								background: {
									color: "#0a0a0a",
								},
								title: {
									text: 'სერიალები',
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


	_goToFavorites() {
		// //		this._toggleDrawer();
		// this.props.navigator.showModal({
		// 	screen: 'movieapp.Favorites',
		// 	title: 'Favorites'
		// });
		Navigation.mergeOptions(this.props.componentId, {
			sideMenu: {
				left: {
					visible: false
				}
			}
		});
		Navigation.showModal({
			stack: {
				children: [{
					component: {
						name: 'movieapp.Favorites',
						options: {
							topBar: {
								height: 60,
								background: {
									color: "#0a0a0a",
								},
								title: {
									text: 'ფავორიტი',
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


	render() {
		const iconSearch = (<Icon name="md-search" size={26} color="#9F9F9F" style={[styles.drawerListIcon, { paddingLeft: 2 }]} />);
		const iconMovies = (<Icon name="md-film" size={26} color="#9F9F9F" style={[styles.drawerListIcon, { paddingLeft: 3 }]} />);
		const iconFav = (<Icon name="md-heart" size={26} color="#9F9F9F" style={[styles.drawerListIcon, { paddingLeft: 3 }]} />);
		const iconTV = (<Icon name="ios-desktop" size={26} color="#9F9F9F" style={styles.drawerListIcon} />);
		return (
			<LinearGradient colors={['rgba(0, 0, 0, 0.7)', 'rgba(0,0,0, 0.9)', 'rgba(0,0,0, 1)']} style={styles.linearGradient}>
				<View style={styles.container}>
					<View style={styles.drawerList}>
						<TouchableOpacity onPress={this._openSearch}>
							<View style={styles.drawerListItem}>
								{iconSearch}
								<Text style={styles.drawerListItemText}>
									ძიება
								</Text>
							</View>
						</TouchableOpacity>
						<TouchableOpacity onPress={this._goToMovies}>
							<View style={styles.drawerListItem}>
								{iconMovies}
								<Text style={styles.drawerListItemText}>
									ფილმები
								</Text>
							</View>
						</TouchableOpacity>


						<TouchableOpacity onPress={this._goToSeries}>
							<View style={styles.drawerListItem}>
								{iconTV}
								<Text style={styles.drawerListItemText}>
									სერიალები
					</Text>
							</View>
						</TouchableOpacity>

						<TouchableOpacity onPress={this._goToFavorites}>
							<View style={styles.drawerListItem}>
								{iconFav}
								<Text style={styles.drawerListItemText}>
									ფავორიტი
								</Text>
							</View>
						</TouchableOpacity>

					</View>

					{
						this.state.subscribed ? (
							<View>
								{
									!this.state.subed ? (

										<View>
											<TouchableOpacity onPress={async () => {

												InAppBilling.open()
													.then(() => InAppBilling.subscribe("noads597").then(res => {
														if (res.purchaseState == "PurchasedSuccessfully") {
															this.setState({ subed: true })
														}
													}))
													.then(details => {
														InAppBilling.close();
													}).catch(err => console.log(err))


											}} style={{ height: 50, marginTop: 50, width: 200, borderRadius: 5, justifyContent: 'center', alignItems: 'center', elevation: 3, backgroundColor: "#FB7C00" }}>
												<Text style={{ color: "#FFF", fontSize: 13 }}>გამოწერა 2 ლარი/თვეში</Text>
											</TouchableOpacity>
											<Text style={{ color: "#FFF", fontSize: 13, marginTop: 10, width: 200, lineHeight: 20, textAlign: 'center' }}>გამოიწერე და უყურე ფილმებს ყოველგვარი რეკლამის გარეშე</Text>

										</View>
									) : (
											<View>
											</View>
										)
								}
							</View>
						) : (
								<View style={{ height: 100, justifyContent: 'center', alignItems: 'center' }}>
									<ActivityIndicator size="large" color="#00ff00" />
								</View>
							)
					}


				</View>
			</LinearGradient>
		);
	}
}

export default Drawer;
