import React, { Component, PropTypes } from 'react';
import {
	Linking,
	RefreshControl,
	ScrollView,
	Text,
	ToastAndroid,
	View,
	TouchableOpacity,
	Dimensions
} from 'react-native';
import jwt from "react-native-pure-jwt";
import Touchable from "react-native-platform-touchable"
import AntDesign from 'react-native-vector-icons/AntDesign';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { Sae, Isao } from 'react-native-textinput-effects';
import { AsyncStorage } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import LinearGradient from 'react-native-linear-gradient';
//import ScrollableTabView from 'react-native-scrollable-tab-view';
import { ScrollableTabView, DefaultTabBar } from '@valdio/react-native-scrollable-tabview'
import Swiper from 'react-native-swiper';
import axios from 'axios';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import SwitchSelector from 'react-native-switch-selector';
import * as moviesActions from './movies.actions';
import Casts from './tabs/Casts';
//import DefaultTabBar from '../_global/scrollableTabView/DefaultTabBar';
import Info from './tabs/Info';
import ProgressBar from '../_global/ProgressBar';
import Trailers from './tabs/Trailers';
import styles from './styles/Movie';
import VideoPlayer from "react-native-native-video-player"
import { TMDB_IMG_URL, YOUTUBE_API_KEY, YOUTUBE_URL } from '../../constants/api';
import { iconsMap } from '../../utils/AppIcons';
import downloadManager from 'react-native-simple-download-manager';
import { Navigation } from "react-native-navigation"
import { AppInstalledChecker, CheckPackageInstallation } from 'react-native-check-app-install';
import AutoHeightWebView from 'react-native-autoheight-webview'
import Firebase from 'firebase';
import { db } from '../../config';
import RNShineButton from 'react-native-shine-button';
import { BackHandler as BackAndroid } from 'react-native'
import DoubleClick from "react-native-double-tap"
import { LoginButton, AccessToken, GraphRequest, GraphRequestManager } from 'react-native-fbsdk';
let Star = <Icon family={"FontAwesome"} name={"star"} color={"#808080"} />;
let Like = <Icon family={"FontAwesome"} name={"thumbs-up"} color={"#808080"} />;
let Love = <Icon family={"FontAwesome"} name={"heart"} color={"#808080"} />;
import AsyncImageAnimated from "react-native-async-image-animated"
import DropdownAlert from 'react-native-dropdownalert';
import ViewShot from "react-native-view-shot";
import Share from 'react-native-share';
import InAppBilling from "react-native-billing";
import { Image } from "react-native-elements"
import publicIP from 'react-native-public-ip';
import Orientation from 'react-native-orientation-locker';
import base64 from "react-native-base64";
//import QRCode from 'react-native-qrcode';
import QRCode from 'react-native-qrcode-svg';
import {
	AdMobBanner,
	AdMobInterstitial,
	PublisherBanner,
	AdMobRewarded,
} from 'react-native-admob'
const apiKey = '9d2bff12ed955c7f1f74b83187f188ae'
import Modal from "react-native-modal";
import SimpleCrypto from "simple-crypto-js";



class Reactions extends Component {
	constructor(props) {
		super(props);
		this.state = {
			count: [0, 0, 0, 0],
			liked: false,
			loved: false,
			stared: false
		}

		if (props.item.likes) {
			if (props.item.likes[props.userData.id]) {
				switch (props.item.likes[props.userData.id]) {
					case 1:
						this.state.loved = true;
						this.state.liked = false;
						this.state.stared = false;
						break;
					case 2:
						this.state.liked = true;
						this.state.loved = false;
						this.state.stared = false;
						break;
					case 3:
						this.state.liked = false;
						this.state.loved = false;
						this.state.stared = true;
						break;

				}
			} else {

				this.state.loved = false;
				this.state.stared = false;
				this.state.liked = false;
			}
			let reacts = Object.values(props.item.likes)
			counted = [0, 0, 0, 0]
			reacts.forEach(item => {
				counted[item]++;
			})
			this.state.count = counted;
		}

	}
	componentDidUpdate(prevProps) {
		if (this.props.item.likes) {
			if (this.props.item.likes !== prevProps.item.likes) {
				//alert("got it")

				let reacts = Object.values(this.props.item.likes)
				counted = [0, 0, 0, 0]
				reacts.forEach(item => {
					counted[item]++;
				})
				this.setState({ count: counted }, () => {
					if (this.props.item.likes[this.props.userData.id]) {
						switch (this.props.item.likes[this.props.userData.id]) {
							case 1:
								this.setState({ loved: true, liked: false, stared: false })
								break;
							case 2:
								this.setState({ loved: false, liked: true, stared: false })
								break;
							case 3:
								this.setState({ loved: false, liked: false, stared: true })
								break;
						}
					} else {

						this.setState({ loved: false, liked: false, stared: false })
					}
				})
			}
		} else {
			if (prevProps.item.likes) {
				this.setState({ count: [0, 0, 0, 0], loved: false, liked: false, stared: false })

			}
		}
	}
	render() {
		return (

			<View style={{ height: 50, flexDirection: "row", justifyContent: "space-between", paddingTop: 20, paddingHorizontal: 20 }}>
				<View style={{ flexDirection: "row" }}>
					<RNShineButton value={this.state.loved} onChange={(val) => { this.setState({ loved: val }); this.props.onChange(1, this.state.loved) }} shape={Love} color={"#808080"} fillColor={"#ff0000"} size={20} />
					{
						this.state.count[1] !== 0 ? (
							<Text style={{ color: "#FFF", marginLeft: 8 }}>{this.state.count[1]}</Text>
						) : (<View style={{ marginLeft: 8 }} />)
					}
				</View>

				<View style={{ flexDirection: "row" }}>
					<RNShineButton value={this.state.liked} onChange={(val) => { this.setState({ liked: val }); this.props.onChange(2, this.state.liked) }} shape={Like} color={"#808080"} fillColor={"#FF7565"} size={20} />
					{
						this.state.count[2] !== 0 ? (
							<Text style={{ color: "#FFF", marginLeft: 8 }}>{this.state.count[2]}</Text>
						) : (<View style={{ marginLeft: 8 }} />)
					}
				</View>
				<View style={{ flexDirection: "row" }}>
					<RNShineButton value={this.state.stared} onChange={(val) => { this.setState({ stared: val }); this.props.onChange(3, this.state.stared) }} shape={Star} color={"#808080"} fillColor={"#9E6D9A"} size={20} />
					{
						this.state.count[3] !== 0 ? (
							<Text style={{ color: "#FFF", marginLeft: 8 }}>{this.state.count[3]}</Text>
						) : (<View style={{ marginLeft: 8 }} />)
					}
				</View>
				<View style={{ justifyContent: 'center' }}>
					<Touchable onPress={() => {
						this.props.screenshot()
					}}>
						<Icon name="md-share" size={24} style={{ marginBottom: 10 }} color="#9E6D9A" />
					</Touchable>
				</View>
			</View>
		)
	}
}
class GetPhoto extends Component {
	constructor(props) {
		super(props);
		let data;
		this.state = {
			loaded: false,
			url: ""
		}

		axios.get(props.url).then(res => {
			//alert(res.data)
			this.setState({ loaded: true, url: res.data.data.url })
		}).catch(err => { })
	}
	render() {
		return (<View>
			{
				this.state.loaded ? (
					<Image
						source={{
							uri: this.state.url
						}}
						placeholderColor={'#cfd8dc'}
						style={{
							width: 50, height: 50, borderRadius: 25, marginTop: 0
						}}
					/>
				) : (<View />)
			}

		</View>)

	}
}
var _this;
class Movie extends Component {
	static navigatorStyle = {
		drawUnderNavBar: true,
		navBarTransparent: true,
		navBarTranslucent: true
	};

	constructor(props) {
		super(props);
		//db.ref('/items').remove()
		this.state = {
			castsTabHeight: null,
			heightAnim: null,
			infoTabHeight: null,
			isLoading: true,
			isRefreshing: false,
			showSimilarMovies: true,
			trailersTabHeight: null,
			tab: 0,
			youtubeVideos: [],
			genres: [],
			Directed: "",
			link: "",
			commentTxt: "",
			ShowModal: false,
			ShowQrModal: false,
			loggedIn: false,
			portrait: false,
			QOptions: [
				{ label: 'ქართული', value: '1' },
				{ label: 'ინგლისური', value: '1.5' },
				{ label: 'რუსული', value: '2' }
			],
			selectedLang: "",
			video_Options: [
				{ label: 'შიდა', value: 'shida' },
				{ label: 'მობილურის', value: 'mobiluris' },
			],
			selectedVideo: "shida",
			Quality_Options: [],
			selectedQual: "",
			addedToFavorites: false,
			AsyncStorageData: [],
			downloading: false,
			comments: [],
			des: props.item.description,
			RecommendedPlayerInstalled: true,
			accessToken: '',
			keys: [],
			UserData: {},
			Captions: false,
			SubTitles_Options: [
				{ label: 'On', value: 'on' },
				{ label: 'Off', value: 'off' },
			],
			selectedCaptions: "",
			CaptionsUrl: "off",
			Qrtoken: ''

		};
		_this = this;
		this.requestManager = new GraphRequestManager()
		this._getTabHeight = this._getTabHeight.bind(this);
		this._onChangeTab = this._onChangeTab.bind(this);
		this._onContentSizeChange = this._onContentSizeChange.bind(this);
		this._onRefresh = this._onRefresh.bind(this)
		this._onScroll = this._onScroll.bind(this);
		this._viewMovie = this._viewMovie.bind(this);
		this._openYoutube = this._openYoutube.bind(this);
		this.getCaptions()
		this.checkSubscription()
		//this.props.navigator.setOnNavigatorEvent(this._onNavigatorEvent.bind(this));
		//AdMobInterstitial.requestAd().then(() => AdMobInterstitial.showAd());
		AppInstalledChecker
			.checkPackageName('com.mxtech.videoplayer.ad')
			.then((isInstalled) => {
				this.setState({ RecommendedPlayerInstalled: isInstalled })
			});
		this.postNewComment = this.postNewComment.bind(this)
		//Firebase
	}
	getCaptions = () => {
		axios.get("http://staticnet.adjara.com/subtitles/" + this.props.item.id + "_English.vtt")
			.then(res => {
				this.setState({ Captions: true, CaptionsUrl: "http://staticnet.adjara.com/subtitles/" + this.props.item.id + "_English.vtt" })
			}).catch(error => {
				this.setState({ Captions: false, CaptionsUrl: "" })
			})
	}

	postNewComment(data) {
		if (data) {
			db.ref('/movies/' + this.props.item.id).push({
				user: this.state.UserData,
				msg: data,
				accessToken: this.state.accessToken
			});

		} else {
			this.dropdown.alertWithType('error', 'Error', "გთხოვთ დაწეროთ კომენტარი");
		}

		this.setState({ commentTxt: "" })
	}
	async checkSubscription() {
		try {
			await InAppBilling.open();
			// If subscriptions/products are updated server-side you
			// will have to update cache with loadOwnedPurchasesFromGoogle()
			await InAppBilling.loadOwnedPurchasesFromGoogle();
			const isSubscribed = await InAppBilling.isSubscribed("noads597")
			//		console.log(ip);
			if (!isSubscribed) {
				AdMobInterstitial.requestAd().then(() => AdMobInterstitial.showAd());
			}
		} catch (err) {
			console.log(err);
		} finally {
			await InAppBilling.close();
		}


	}


	_onOrientationDidChange = (orientation) => {
		//alert(orientation)
		if (orientation !== 'PORTRAIT') {

			this.setState({ portrait: false })
		} else {
			//do something with portrait layout
			this.setState({ portrait: true })
		}
	};

	componentWillMount() {
		var initial = Orientation.getInitialOrientation();
		if (initial === 'PORTRAIT') {
			this.setState({ portrait: true })
		} else {
			this.setState({ portrait: false })
		}
		this._retrieveDetails();
		let itemsRef = db.ref('/movies/' + this.props.item.id);
		itemsRef.on('value', snapshot => {
			//alert("get it")
			let data = snapshot.val();
			//	alert(JSON.stringify(data))
			if (data !== null) {
				let keys = Object.keys(data);
				let items = Object.values(data);
				this.setState({ comments: items.reverse(), keys: keys.reverse() });
			}
		});
	}
	getq(data) {
		if (data > 1000) {
			return "HD"
		} else {
			return "SD"
		}
	}
	_retrieveDetails(isRefreshed) {
		// this.props.actions.retrieveMovieDetails(this.props.movieId)
		// 	.then(() => {
		// 	//	this._retrieveYoutubeDetails();

		//	});


		(async () => {


			try {
				const value = await AsyncStorage.getItem('favorites');
				if (value !== null) {
					// We have data!!
					// alert(JSON.stringify(value));
					let parsedVal = JSON.parse(value)
					//	 alert(JSON.stringify(parsedVal))
					// alert(this.props.item.id)
					parsedVal.forEach(item => {
						if (item.id == this.props.item.id) {
							Navigation.mergeOptions(this.props.componentId, {

								topBar: {
									rightButtons: [
										{
											id: 'love',
											icon: iconsMap['ios-heart'],
											color: "#FFF"
										},
										{
											id: 'close',
											icon: iconsMap['ios-arrow-round-down'],
											color: "#fff"
										}
									]
								}
							});

							this.setState({ addedToFavorites: true, AsyncStorageData: parsedVal })
						}
					})
				}
			} catch (error) {
				// Error retrieving data
				alert(error)
			}
		})()



		fetch("http://net.adjara.com/req/jsondata/req.php?id=" + this.props.item.id + "&reqId=getInfo")
			.then(res => res.json())
			.then(res => {
				let genres = Object.keys(res.genres).map(i => res.genres[i])
				let director = Object.keys(res.director).map(i => res.director[i]);
				if (director.length > 0) {
					this.setState({ Directed: director[0] })

				}
				this.setState({ genres, des: res.desc[0] })
				fetch(
					"http://net.adjara.com/req/jsondata/req.php?id=" + this.props.item.id +
					"&reqId=getLangAndHd"
				)
					.then(res => res.json())
					.then(res => {
						let actors = [];
						var info = Object
							.keys(res)
							.map(i => res[i])

						var noption = info[0].lang.split(",")
						var noquality = info[0].quality.split(",")
						//	alert(JSON.stringify(noption))
						let nores = [];
						let noqures = [];
						noption.map((item) => {
							nores.push({ label: item, value: item })
						})
						noquality.map((item) => {
							noqures.push({ label: this.getq(item), value: item })
						})
						this.setState({ QOptions: nores, link: info[0].url, selectedLang: noption[0], Quality_Options: noqures, selectedQual: noquality[0] })
						Object
							.keys(res.cast)
							.map(async (item) => {
								actors.push({ id: item, name: res.cast[item] })
							})
						this.setState({ actors, link: info[0].url })

						this.setState({ isLoading: false });


						let added = [];
						let poster = "";
						if (this.props.searching) {
							poster = ("http://staticnet.adjara.com/moviecontent/" + this.props.item.id + "/covers/214x321-" + this.props.item.id + ".jpg")
						} else {
							poster = this.props.item.poster
						}
						added.push({
							id: this.props.item.id,
							release_date: this.props.item.release_date,
							director: this.props.item.director,
							description: this.props.item.description,
							casts: this.state.actors,
							poster,
							data_rating: this.props.item.data_rating,
							imdb: this.checkImdb(this.props.item),
							title_ge: this.props.item.title_ge,
							title_en: this.props.item.title_en
						});
						var _secretKey = "q2";
						var simpleCrypto = new SimpleCrypto(_secretKey);
						var chiperText = simpleCrypto.encrypt(JSON.stringify({
							id: this.props.item.id,
							title_ge: this.props.item.title_ge,
							title_en: this.props.item.title_en
						}));
						const rawdata = chiperText;

						//					alert(rawdata)

						this.setState({ Qrtoken: rawdata })
						// jwt
						// 	.sign(
						// 		{
						// 			iss: "iraklisamniashviliii@gmail.com",
						// 			exp: new Date().getTime() + 3600 * 1000, // 
						// 			additional: JSON.stringify(added)
						// 		}, // body
						// 		"chatlaxi-bu", // secret
						// 		{
						// 			alg: "HS256"
						// 		}
						// 	)
						// 	.then(data => {
						// 		this.setState({ Qrtoken: data })
						// 	}) // token as the only argument
						// 	.catch((err) => console.error(err)); // possible errors

					});

			});
		if (isRefreshed && this.setState({ isRefreshing: false }));
	}

	_retrieveSimilarMovies() {
		this.props.actions.retrieveSimilarMovies(this.props.movieId, 1);
	}

	_onRefresh() {
		this.setState({ isRefreshing: true });
		this._retrieveDetails('isRefreshed');
	}

	_onScroll(event) {
		const contentOffsetY = event.nativeEvent.contentOffset.y.toFixed();
		if (contentOffsetY > 150) {
			//	this._toggleNavbar('hidden');
		} else {
			//		this._toggleNavbar('shown');
		}
	}

	_toggleNavbar(status) {

		Navigation.mergeOptions(this.props.componentId, {

			topBar: {
				visible: false,
			}
		});
		// this.props.navigator.toggleNavBar({
		// 	to: status,
		// 	animated: true
		// });




	}

	_onChangeTab({ i, ref }) {
		this.setState({ tab: i });
	}

	// ScrollView onContentSizeChange prop
	_onContentSizeChange(width, height) {
		if (this.state.tab === 0 && this.state.infoTabHeight === this.state.castsTabHeight) {
			//alert(height)
			//this.setState({ infoTabHeight: height });
		}
	}

	_getTabHeight(tabName, height) {
		if (tabName === 'casts') this.setState({ castsTabHeight: height });
		if (tabName === 'INFO') this.setState({ infoTabHeight: height });
		if (tabName === 'trailers') this.setState({ trailersTabHeight: height });
	}

	_retrieveYoutubeDetails() {

	}

	_viewMovie(movieId) {
		this.props.navigator.push({
			screen: 'movieapp.Movie',
			passProps: {
				movieId
			}
		});
	}

	handleBackButton() {
		return true;
	}
	componentDidMount() {
		Orientation.addOrientationListener(this._onOrientationDidChange);
		this.navigationEventListener = Navigation.events().bindComponent(this);
		AccessToken.getCurrentAccessToken()
			.then((data) => {
				this.setState({
					loggedIn: true,
					accessToken: data.accessToken
				})
				this.fetchProfile().then((data) => {
					//alert(JSON.stringify(data))
					this.setState({ UserData: data })
				})

			})
			.catch(error => {
				console.log(error)
			})
	}
	async fetchProfile(callback) {
		return new Promise((resolve, reject) => {
			const request = new GraphRequest(
				'/me',
				null,
				(error, result) => {
					if (result) {
						const profile = result
						profile.avatar = `https://graph.facebook.com/${result.id}/picture?type=large&redirect=false`
						resolve(profile)
					} else {
						reject(error)
					}
				}
			)

			this.requestManager.addRequest(request).start()
		})
	}

	//  componentWillMount() {
	// 	if (this.navigationEventListener) {
	//   this.navigationEventListener.remove();
	// }
	// }

	async navigationButtonPressed({ buttonId }) {
		if (buttonId == "close") {
			Navigation.dismissModal(this.props.componentId);

		}

		if (buttonId == "love") {

			if (!this.state.addedToFavorites) {

				var value = await AsyncStorage.getItem('favorites');
				let added;

				if (value !== null) {
					added = JSON.parse(value)
				} else {
					added = []
				}
				//alert(this.props.item.poster)
				let poster = "";
				if (this.props.searching) {
					poster = ("http://staticnet.adjara.com/moviecontent/" + this.props.item.id + "/covers/214x321-" + this.props.item.id + ".jpg")
				} else {
					poster = this.props.item.poster
				}
				added.push({
					id: this.props.item.id,
					release_date: this.props.item.release_date,
					director: this.props.item.director,
					description: this.props.item.description,
					casts: this.state.actors,
					poster,
					data_rating: this.props.item.data_rating,
					imdb: this.checkImdb(this.props.item),
					title_ge: this.props.item.title_ge,
					title_en: this.props.item.title_en
				})

				added = JSON.stringify(added)

				this._storeData("favorites", added)
				Navigation.mergeOptions(this.props.componentId, {

					topBar: {
						rightButtons: [
							{
								id: 'love',
								icon: iconsMap['ios-heart'],
								color: "#FFF"
							},
							{
								id: 'close',
								icon: iconsMap['ios-arrow-round-down'],
								color: "#fff"
							}
						]
					}
				});


			} else {
				this.setState({ addedToFavorites: false })



				Navigation.mergeOptions(this.props.componentId, {
					topBar: {
						rightButtons: [
							{
								id: 'love',
								icon: iconsMap['ios-heart-empty'],
								color: "#fff"
							},
							{
								id: 'close',
								icon: iconsMap['ios-arrow-round-down'],
								color: "#FFF"

							}
						]
					}
				});


				let favs = this.state.AsyncStorageData;
				favs.forEach((item, id) => {
					if (item.id == this.props.item.id) {
						favs.splice(id, 1);
						this._storeData("favorites", JSON.stringify(favs))
					}
				})
			}
		}
	}


	playMovie(item) {
		if (this.state.downloading) {
			const url = this.state.link + item.id + "_" + this.state.selectedLang + "_" + this.state.selectedQual + ".mp4";
			const headers = { 'Authorization': 'movie is downloading' };
			const config = {
				downloadTitle: this.checkTitle(this.props.item),
				downloadDescription: 'მიმდინარეობს გადმოწერა',
				saveAsName: (this.props.item.id + ".mp4"),
				allowedInRoaming: true,
				allowedInMetered: true,
				showInDownloads: true,
				external: false, //when false basically means use the default Download path (version ^1.3)
				path: "Downloads/" //if "external" is true then use this path (version ^1.3)
			};


			downloadManager.download(url, headers, config).then(() => {
				console.log('Download success!');
			}).catch(err => {
				console.log(err);
				if (err.reason == "ERROR_INSUFFICIENT_SPACE") {
					alert("თქვენ არ გაქვთ საკმარისი მეხსიერება")
				}
			})
		} else {


			if (this.state.selectedVideo == "shida") {
				Navigation.showModal({
					stack: {
						children: [{
							component: {
								name: 'movieapp.Player',
								passProps: {
									url: this.state.link + item.id + "_" + this.state.selectedLang + "_" + this.state.selectedQual + ".mp4",
									Captions: this.state.selectedCaptions == "on" ? (this.state.CaptionsUrl) : (null)
								},
								options: {
									topBar: {
										visible: false,
										height: 0
									}
								}

							}
						}]
					}
				});
			} else {
				VideoPlayer.showVideoPlayer(this.state.link + item.id + "_" + this.state.selectedLang + "_" + this.state.selectedQual + ".mp4")
			}





		}
		this.setState({ ShowModal: false })
	}

	_openYoutube(youtubeUrl) {
		Linking.canOpenURL(youtubeUrl).then(supported => {
			if (supported) {
				Linking.openURL(youtubeUrl);
			} else {
				ToastAndroid.show(`RN Don't know how to handle this url ${youtubeUrl}`, ToastAndroid.SHORT);
			}
		});
	}


	_storeData = async (data1, data2) => {
		try {
			await AsyncStorage.setItem(data1, data2);
		} catch (error) {
			// Error saving data
		}
	};


	async _onNavigatorEvent(event) {
		if (event.type === 'NavBarButtonPress') {
			if (event.id === 'close') {
				this.props.navigator.dismissModal();
			}

			if (event.id === 'love') {

			}
		}
	}




	checkTitle(data) {
		if (data.title_ge !== "") {
			return (data.title_ge);
		} else {
			return (data.title_en);
		}
	}

	checkImdb(data) {
		if ((parseFloat(data.data_rating).toFixed(1)) !== parseFloat(0.0).toFixed(1)) {
			return (data.data_rating);
		} else {
			return (null);
		}
	}



	ReactLove(key, liked, type) {
		if (liked) {

			//let obj = {};
			//obj[this.state.UserData.id] = 1;
			db.ref('/movies/' + this.props.item.id + '/' + key + '/likes/' + this.state.UserData.id).remove()
		} else {
			let obj = {};
			//obj[this.state.UserData.id] = type;
			//alert(this.state.UserData.id)
			db.ref('/movies/' + this.props.item.id + '/' + key + '/likes/' + this.state.UserData.id).set(type)
		}


	}


	render() {
		const iconStar = <Icon name="md-star" size={16} color="#F5B642" />;
		const { details } = this.props;
		const { item, searching, movieId } = this.props;
		const info = details;
		const options = this.state.QOptions;
		let height;
		if (this.state.tab === 0) height = this.state.infoTabHeight;
		if (this.state.tab === 1) height = this.state.castsTabHeight;
		if (this.state.tab === 2) height = this.state.trailersTabHeight;
		if (searching) {

		}
		return (
			this.state.isLoading ? <View style={styles.progressBar}><ProgressBar /></View> :
				<View style={{ flex: 1, backgroundColor: '#0a0a0a' }}>
					<DropdownAlert ref={ref => this.dropdown = ref} />
					<ScrollView
						nestedScrollEnabled={true}
						style={styles.container}
						onScroll={this._onScroll.bind(this)}
						scrollEventThrottle={100}
						onContentSizeChange={this._onContentSizeChange}
					>
						<Modal animationIn="bounceInLeft"
							animationOut="bounceOutRight"
							animationInTiming={1000}
							animationOutTiming={1000}
							backdropTransitionInTiming={1000}
							backdropTransitionOutTiming={1000}
							isVisible={this.state.ShowQrModal}>
							<View style={{
								flex: 1,
								flexDirection: 'column',
								justifyContent: 'center',
								alignItems: 'center'
							}}>
								<View style={{
									backgroundColor: "#2B2C3D",
									width: 400,
									height: 415,
									alignItems: 'center',
									padding: 15
								}}>
									<View style={{ overflow: 'hidden' }}>
										{
											this.state.Qrtoken ? (
												<View style={{ backgroundColor: "#FFF", padding: 10 }}>
													<QRCode
														color="black"
														backgroundColor='#FFF'
														value={this.state.Qrtoken}
														size={320} />
												</View>
											) : (<View />)

										}


									</View>

									<TouchableOpacity onPress={() => this.setState({ ShowQrModal: false })} style={{ marginTop: 15, height: 30, width: 110, backgroundColor: "#2B2C3D", borderRadius: 25, justifyContent: 'center', alignItems: 'center' }}>
										<Text style={{ color: "#FFF" }}>დახურვა</Text>
									</TouchableOpacity>
								</View>

							</View>

						</Modal>
						<Modal animationIn="bounceInLeft"
							animationOut="bounceOutRight"
							animationInTiming={1000}
							animationOutTiming={1000}
							backdropTransitionInTiming={1000}
							backdropTransitionOutTiming={1000}
							isVisible={this.state.ShowModal} >
							<View style={{
								flex: 1,
								flexDirection: 'column',
								justifyContent: 'center',
								alignItems: 'center'
							}}>
								<View style={{
									backgroundColor: "#2B2C3D",
									width: this.state.portrait ? 350 : 600,
									height: this.state.portrait ? 'auto' : 300,
									alignItems: 'center',
									borderRadius: 10,
									padding: 15
								}}>

									<Text style={{ color: "#FFF", paddingTop: 20, paddingBottom: 20 }}>აირჩიე ენა</Text>
									<SwitchSelector options={options} initial={0} onPress={value => this.setState({ selectedLang: value })} />

									<View style={{ flexDirection: this.state.portrait ? 'column' : 'column' }}>
										<View style={{ width: this.state.portrait ? 'auto' : 300, flexDirection: this.state.portrait ? 'column' : 'row' }}>
											<View>
												<Text style={{ color: "#FFF", paddingTop: 20, paddingBottom: 20 }}>აირჩიე ხარისხი</Text>
												<SwitchSelector options={this.state.Quality_Options} initial={0} onPress={value => this.setState({ selectedQual: value })} />
											</View>
											<View style={{ width: this.state.portrait ? 'auto' : 220, paddingLeft: this.state.portrait ? 0 : 20 }}>
												<Text style={{ color: "#FFF", paddingTop: 20, paddingBottom: 20 }}>აირჩიე player</Text>
												<SwitchSelector options={this.state.video_Options} initial={0} onPress={value => this.setState({ selectedVideo: value })} />
											</View>
										</View>


										{
											this.state.portrait ? (
												<View>
													{
														!this.state.RecommendedPlayerInstalled ? (

															<TouchableOpacity onPress={() => {
																Linking.openURL("https://play.google.com/store/apps/details?id=com.mxtech.videoplayer.ad").catch((err) => console.error('An error occurred', err));
															}}>
																<Text style={{ textDecorationLine: 'underline', color: "red", marginTop: 8 }}>გადმოწერე რეკომენდირებული VideoPlayer</Text>
															</TouchableOpacity>
														) : (
																<View />
															)

													}

													{
														this.state.Captions ? (
															<View>
																<Text style={{ color: "#FFF", paddingTop: 20, paddingBottom: 20 }}>ტიტრები</Text>
																<SwitchSelector options={this.state.SubTitles_Options} initial={1} onPress={value => this.setState({ selectedCaptions: value })} />
															</View>
														) : (
																<View />
															)
													}
												</View>
											) : (<View />)
										}
										<View>
											<View style={{ marginTop: this.state.portrait ? 50 : 20, flexDirection: 'row' }}>
												<TouchableOpacity onPress={() => this.setState({ ShowModal: false })} style={{ height: 30, width: 110, backgroundColor: "#2B2C3D", borderRadius: 25, justifyContent: 'center', alignItems: 'center' }}>
													<Text style={{ color: "#FFF" }}>დახურვა</Text>
												</TouchableOpacity>
												<View style={{ width: 10 }} />
												<TouchableOpacity onPress={() => this.playMovie(item)} style={{
													height: 38,
													width: 110,
													backgroundColor: "#FFF", borderRadius: 5, justifyContent: 'center', alignItems: 'center'
												}}>
													<Text style={{ color: "#2B2C3D" }}>კარგი</Text>
												</TouchableOpacity>
											</View>

										</View>
									</View>



								</View>
							</View>
						</Modal>
						<View style={{ height }}>
							<View>
								<Image blurRadius={2} source={{ uri: searching ? ("http://staticnet.adjara.com/moviecontent/" + movieId + "/covers/214x321-" + movieId + ".jpg") : ('http:' + item.poster) }} style={styles.imageBackdrop} />

								<LinearGradient colors={['rgba(0, 0, 0, 0.2)', 'rgba(0,0,0, 0.2)', 'rgba(0,0,0, 0.7)']} style={styles.linearGradient} />

								<View style={{ position: 'absolute', top: 100, alignSelf: 'center', flexDirection: 'row' }}>
									<TouchableOpacity style={{ width: 50, height: 50 }} onPress={() => {
										this.setState({ downloading: false, ShowModal: true })
									}} >
										<Icon size={50} color="#FFF" name="ios-play" />
									</TouchableOpacity>

									<TouchableOpacity style={{ width: 50, height: 50 }} onPress={() => {
										this.setState({ downloading: true, ShowModal: true })
									}} >
										<Icon size={50} color="#FFF" name="md-download" />
									</TouchableOpacity>

									<TouchableOpacity style={{ width: 50, height: 50 }} onPress={() => {
										this.setState({ ShowQrModal: true })
									}} >
										<MaterialCommunityIcons size={50} color="#FFF" name="qrcode" />
									</TouchableOpacity>
								</View>


							</View>

							<View style={styles.cardContainer}>
								<Image source={{ uri: searching ? ("http://staticnet.adjara.com/moviecontent/" + movieId + "/covers/214x321-" + movieId + ".jpg") : ('http:' + item.poster) }} style={styles.cardImage} />
								<View style={styles.cardDetails}>
									<Text style={styles.cardTitle}>{this.checkTitle(item)}</Text>
									<Text style={styles.cardTagline}></Text>
									<View style={styles.cardGenre}>
										{
											this.state.genres.map(item => (
												<Text key={item.id} style={styles.cardGenreItem}>{item}</Text>
											))
										}
									</View>
									<View style={styles.cardNumbers}>
										{
											searching ? (
												<View />
											) : (
													<View style={styles.cardStar}>
														{iconStar}
														<Text style={styles.cardStarRatings}>{this.checkImdb(item)}</Text>
													</View>
												)
										}
										<Text style={styles.cardRunningHours} />
									</View>
								</View>
							</View>
							<View style={styles.contentContainer}>
								<ScrollableTabView
									onChangeTab={this._onChangeTab}
									renderTabBar={() => (
										<DefaultTabBar
											textStyle={styles.textStyle}
											underlineStyle={styles.underlineStyle}
											style={styles.tabBar}
										/>
									)}>

									<Info tabLabel="INFO" item={item} description={this.state.des} director={this.state.Directed} />
									<Casts tabLabel="CASTS" actors={this.state.actors} getTabHeight={this._getTabHeight} />
									<Trailers tabLabel="TRAILERS" item={this.props.item} youtubeVideos={this.state.youtubeVideos} openYoutube={this._openYoutube} getTabHeight={this._getTabHeight} />
									<View tabLabel="COMMENTS">
										<View style={{ height: 100, padding: 15 }}>
											{
												this.state.loggedIn ? (
													<View style={{ flexDirection: "row" }}>
														<View style={{ flex: 1 }}>
															<Isao
																value={this.state.commentTxt}
																onChangeText={(d) => { this.setState({ commentTxt: d }) }}
																label={'დაწერეთ თქვენი კომენტარი...'}
																activeColor={'#da7071'}
																borderHeight={8}
																inputPadding={16}
																labelHeight={24}
																// this is applied as passive border and label color
																passiveColor={'#dadada'}
															/></View>
														<TouchableOpacity style={{ width: 50, height: 50, backgroundColor: "black" }} onPress={() => {
															this.postNewComment(this.state.commentTxt);
														}}>
															<View style={{ width: 50, height: 50, justifyContent: "center", alignItems: "center" }}>
																<AntDesign name="arrowright" size={30} color="#FFF" />
															</View>
														</TouchableOpacity>
													</View>
												) : (
														<View style={{ flex: 1, justifyContent: 'center', alignItems: "center" }}>
															<LoginButton

																readPermissions={["public_profile"]}
																onLoginFinished={
																	(error, result) => {

																		if (error) {
																			alert("login has error: " + result.error);
																		} else if (result.isCancelled) {
																			alert("login is cancelled.");
																		} else {
																			AccessToken.getCurrentAccessToken()
																				.then((data) => {
																					this.setState({
																						loggedIn: true,
																						accessToken: data.accessToken
																					})
																					this.fetchProfile().then((data) => {
																						//alert(JSON.stringify(data))
																						this.setState({ UserData: data })
																					})

																				})
																				.catch(error => {
																					console.log(error)
																				})
																		}
																	}
																}
																onLogoutFinished={() => { }} />

														</View>
													)
											}

										</View>








										{
											this.state.comments.map((item, index) => {
												return (
													<ViewShot ref={"viko" + index} options={{ format: "jpg", quality: 0.9 }}>
														<View>
															<View style={{ flexDirection: 'row', marginTop: 50 }}>
																<View style={{ width: 60, paddingLeft: 8 }}>
																	<GetPhoto url={item.user.avatar} />
																</View>
																<View style={{ flex: 1, paddingLeft: 8 }}>
																	<Text style={{ color: "#FFF", fontWeight: 'bold' }}>{item.user.name}</Text>
																	<Text style={{ color: "#FFF", lineHeight: 20 }}>{item.msg}</Text>
																</View>

															</View>
															{
																this.state.loggedIn ? (
																	<Reactions screenshot={() => {
																		this.refs["viko" + index].capture().then(uri => {
																			const shareOptions = {
																				title: 'Share via',
																				url: uri,
																			};
																			Share.open(shareOptions);
																		});

																	}} userData={this.state.UserData} onChange={(type, lk) => { this.ReactLove(this.state.keys[index], lk, type) }} item={item} />
																) : (
																		<View />
																	)
															}

														</View>
														<View style={{ height: 0.5, marginTop: 28, backgroundColor: "#FFF" }}></View>
													</ViewShot>
												)
											})
										}





									</View>
								</ScrollableTabView>

							</View>
						</View>
					</ScrollView>
				</View >
		);
	}
}

Movie.navigatorStyle = {
	navBarTransparent: true,
	drawUnderNavBar: true,
	navBarTranslucent: true,
	statusBarHidden: true,
	navBarTextColor: 'white',
	navBarButtonColor: 'white'
};


function mapStateToProps(state, ownProps) {
	return {
		details: state.movies.details,
		similarMovies: state.movies.similarMovies
	};
}

function mapDispatchToProps(dispatch) {
	return {
		actions: bindActionCreators(moviesActions, dispatch)
	};
}

export default connect(mapStateToProps, mapDispatchToProps)(Movie);
