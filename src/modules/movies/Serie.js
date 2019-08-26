import React, { Component, PropTypes } from 'react';
import {
	Linking,
	RefreshControl,
	ScrollView,
	Text,
	ToastAndroid,
	View,
	TouchableOpacity,
	Picker,
	AsyncStorage
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import AntDesign from 'react-native-vector-icons/AntDesign';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import LinearGradient from 'react-native-linear-gradient';
import { ScrollableTabView, DefaultTabBar } from '@valdio/react-native-scrollable-tabview'
import Swiper from 'react-native-swiper';
import axios from 'axios';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import SwitchSelector from 'react-native-switch-selector';
import * as moviesActions from './movies.actions';
import Series from './tabs/Series';
import Info from './tabs/Info';
import ProgressBar from '../_global/ProgressBar';
import Trailers from './tabs/Trailers';
import styles from './styles/Movie';
import VideoPlayer from "react-native-native-video-player"
import { Image } from 'react-native-elements'
import { TMDB_IMG_URL, YOUTUBE_API_KEY, YOUTUBE_URL } from '../../constants/api';
import InAppBilling from "react-native-billing";
import Touchable from "react-native-platform-touchable"
import { Dropdown } from 'react-native-material-dropdown';

import downloadManager from 'react-native-simple-download-manager';
import {
	AdMobBanner,
	AdMobInterstitial,
	PublisherBanner,
	AdMobRewarded,
} from 'react-native-admob'
import { Navigation } from "react-native-navigation"
const apiKey = '9d2bff12ed955c7f1f74b83187f188ae'
import Modal from "react-native-modal";
import { iconsMap } from '../../utils/AppIcons';
import RNShineButton from 'react-native-shine-button';
import DoubleClick from "react-native-double-tap"
import { LoginButton, AccessToken, GraphRequest, GraphRequestManager } from 'react-native-fbsdk';
let Star = <Icon family={"FontAwesome"} name={"star"} color={"#808080"} />;
let Like = <Icon family={"FontAwesome"} name={"thumbs-up"} color={"#808080"} />;
let Love = <Icon family={"FontAwesome"} name={"heart"} color={"#808080"} />;
import AsyncImageAnimated from "react-native-async-image-animated"
import { Sae, Isao } from 'react-native-textinput-effects';
import { db } from '../../config';
import DropdownAlert from 'react-native-dropdownalert';
import ViewShot from "react-native-view-shot";
import Share from 'react-native-share';
import SimpleCrypto from "simple-crypto-js";
import QRCode from 'react-native-qrcode-svg';
import { BackHandler as BackAndroid } from 'react-native'

var seasons = [];
var szn = [];
var qualitiesObjs = [];
var nnqu = [];

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
class Serie extends Component {
	constructor(props) {
		super(props);
		seasons = [];
		szn = [];
		qualitiesObjs = [];
		nnqu = [];
		this.state = {
			sznss: [],
			selectedSerieToDownload: 0,
			seriesToDown: null,
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
			navbar: true,
			series: [],
			ShowModal: false,
			QOptions: [
				{ label: 'ქართული', value: '1' },
				{ label: 'ინგლისური', value: '1.5' },
				{ label: 'რუსული', value: '2' }
			],
			selectedLang: "",
			Quality_Options: [],
			options: [],
			selectedQual: "",
			seasons: [],
			addedToFavorites: false,
			AsyncStorageData: [],
			des: this.props.item.description,
			accessToken: '',
			keys: [],
			comments: [],
			commentTxt: "",
			loggedIn: false,
			UserData: {},
			Qrtoken: '',
			ShowQrModal: false,
			ShowDownloadModal: false,

		};

		this.requestManager = new GraphRequestManager()
		this._getTabHeight = this._getTabHeight.bind(this);
		this._onChangeTab = this._onChangeTab.bind(this);
		this._onContentSizeChange = this._onContentSizeChange.bind(this);
		this._onRefresh = this._onRefresh.bind(this)
		this._onScroll = this._onScroll.bind(this);
		this._viewMovie = this._viewMovie.bind(this);
		this._openYoutube = this._openYoutube.bind(this);
		this.checkSubscription()
		//this.props.navigator.setOnNavigatorEvent(this._onNavigatorEvent.bind(this));a



	}



	async checkSubscription() {
		try {
			await InAppBilling.open();
			// If subscriptions/products are updated server-side you
			// will have to update cache with loadOwnedPurchasesFromGoogle()
			await InAppBilling.loadOwnedPurchasesFromGoogle();
			const isSubscribed = await InAppBilling.isSubscribed("noads597")
			//   console.log("Customer subscribed: ", isSubscribed);
			if (!isSubscribed) {
				AdMobInterstitial.requestAd().then(() => AdMobInterstitial.showAd());
			}
		} catch (err) {
			console.log(err);
		} finally {
			await InAppBilling.close();
		}
	}



	componentWillMount() {

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


		(async () => {

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
		// firebase.database().ref().child("series").child(this.props.navigation.state.p
		// a rams.key).child("parts").on("value",snapshot => {     databaseItems = [];
		// for(var i=1;i<=snapshot.numChildren();i++) { databaseItems.push("სეზონი " +
		// i);     }     }) this.setState({seasons:databaseItems})
		// this.getSeason("სეზონი 1");

		fetch(
			`http://net.adjara.com/req/jsondata/req.php?id=${
			this.props.item.id
			}&reqId=getInfo`
		)
			.then(res => res.json())
			.then(res => {


				const myarr = Object.keys(res).map(i => res[i]);
				this.setState({ link: myarr[myarr.length - 1], des: res.desc });
				//alert(myarr[myarr.length - 1])

				myarr.forEach(item => {
					if (item[1]) {
						if (typeof item === 'object') {
							if (Object.keys(item).length > 1) {
								seasons.push(item);
							}
						}
					}
				});

				var testSznNum = 0;

				var szns;

				if (seasons[testSznNum][testSznNum + 1].lang) {
					szns = Object.keys(seasons[testSznNum]).map(i => {
						if (
							seasons[testSznNum][i].quality ||
							seasons[testSznNum][i].lang ||
							typeof seasons[testSznNum][i] !== 'undefined'
						) {
							if (seasons[testSznNum][i].lang) {
								return seasons[testSznNum][i];
							} else {
								return '';
							}
						}
					});
				} else {
					testSznNum++;
					szns = Object.keys(seasons[testSznNum]).map(i => {
						if (
							seasons[testSznNum][i].quality ||
							seasons[testSznNum][i].lang ||
							typeof seasons[testSznNum][i] !== 'undefined'
						) {
							if (seasons[testSznNum][i].lang) {
								return seasons[testSznNum][i];
							} else {
								return '';
							}
						}
					});
				}
				szn = szns;

				let sznss = [];
				seasons.forEach((item, ind) => {
					sznss.push({ value: ("სეზონი " + (ind + 1)) })
				})
				this.setState({ series: szn, isLoading: false, seasons, sznss });
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
			this._toggleNavbar('hidden');
		} else {
			this._toggleNavbar('shown');
		}
	}

	_toggleNavbar(status) {
		if (status == "hidden") {

			Navigation.mergeOptions(this.props.componentId, {
				topBar: {
					visible: false,
				}
			});
		} else {

			Navigation.mergeOptions(this.props.componentId, {
				topBar: {
					visible: true,
				}
			});
		}
	}

	_onChangeTab({ i, ref }) {
		this.setState({ tab: i });
	}

	// ScrollView onContentSizeChange prop
	_onContentSizeChange(width, height) {
		if (this.state.tab === 0 && this.state.infoTabHeight === this.state.castsTabHeight) {
			//this.setState({ infoTabHeight: height });
		}
		//this.setState({ castsTabHeight: height });
	}

	_getTabHeight(tabName, height) {
		if (tabName === 'casts') this.setState({ castsTabHeight: height });
		if (tabName === 'series') this.setState({ castsTabHeight: height });
		if (tabName === 'trailers') this.setState({ trailersTabHeight: height });
		if (tabName === 'INFO') this.setState({ infoTabHeight: height });
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

	_storeData = async (data1, data2) => {
		try {
			await AsyncStorage.setItem(data1, data2);
		} catch (error) {
			// Error saving data
		}
	};


	_openYoutube(youtubeUrl) {
		Linking.canOpenURL(youtubeUrl).then(supported => {
			if (supported) {
				Linking.openURL(youtubeUrl);
			} else {
				//	ToastAndroid.show(`RN Don't know how to handle this url ${youtubeUrl}`, ToastAndroid.SHORT);
			}
		});
	}
	checkImdb(data) {
		if ((parseFloat(data.data_rating).toFixed(1)) !== parseFloat(0.0).toFixed(1)) {
			return (parseFloat(data.data_rating).toFixed(1));
		} else {
			return (null);
		}
	}




	handleBackButton() {
		return true;
	}


	componentDidMount() {
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





	async navigationButtonPressed({ buttonId }) {
		if (buttonId == "close") {
			Navigation.dismissModal(this.props.componentId);
		}

		if (buttonId == "love") {

			if (!this.state.addedToFavorites) {
				var value = await AsyncStorage.getItem('favorites');
				//JSON.stringify(added))
				let added;

				if (value !== null) {
					added = JSON.parse(value)
				} else {
					added = []
				}

				let poster;

				if (this.props.item.poster) {
					poster = this.props.item.poster;
				} else {
					poster = "http://staticnet.adjara.com/moviecontent/" + this.props.item.id + "/covers/214x321-" + this.props.item.id + ".jpg";
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


	checkTitle(data) {
		if (data.title_ge !== "") {
			return (data.title_ge);
		} else {
			return (data.title_en);
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
		} a
	}


	getSeason(value) {
		var datiko = [];
		let kaka = parseInt(value.substr(value.length - 1)) - 1;
		if (kaka == -1) {
			kaka = 9;
		}
		var sss = this.state.seasons[kaka];

		if (sss == undefined) {
		}
		datiko = Object
			.keys(sss)
			.map(i => {
				if (sss[i].quality || sss[i].lang || typeof (sss[i]) !== "undefined") {
					return sss[i]
				}
			})
		//	alert(datiko)


		let std = [];
		datiko.map((item, ind) => {
			std.push({
				value: ("სერია " + (ind + 1) + " " + item.name),
				lang: item.lang,
				qual: item.quality
			})
		})


		this.setState({ seriesToDown: std })
	}
	async onValueChange(value) {
		this.setState({ selected: value });

		this.getSeason(value)
	}

	selectSerieToDownload(value, ind, data) {
		let serieData = data[ind];
		//alert(JSON.stringify(serieData))
		let lang = serieData.lang;
		let qual = serieData.qual;
		var noption = lang.split(",")
		var noquality = qual.split(",")
		//	alert(JSON.stringify(noption))
		let nores = [];
		let noqures = [];


		noption.map((item) => {
			nores.push({ label: item, value: item })
		})
		noquality.map((item) => {
			noqures.push({ label: this.getq(item), value: item })
		})
		this.setState({ serieI: ind, options: nores, selectedLang: noption[0], Quality_Options: noqures, selectedQual: noquality[0] }, () => {
			this.setState({ selectSerieToDownload: value, selectedSerieToDownloadData: serieData })
		})

	}

	getNum(num, sub) {
		if (num == -1) {
			return "10"
		} else {
			if (num < 9) {
				if (sub) {
					return ((num + 1)).toString()
				} else {
					return ("0" + (num + 1)).toString()
				}
			} else {
				return (num + 1).toString();
			}
		}
	}
	getq(data) {
		if (data > 1000) {
			return "HD"
		} else {
			return "SD"
		}
	}
	startDownloading() {
		// alert("http://" + this.props.link + this.props.id + "_" + this.getNum(parseInt(this.state.selected.substr(this.state.selected.length - 1)) - 1) +
		// 	"_" + this.getNum(this.state.serieI) + "_" + this.state.selectedLang + "_"
		// 	+ this.state.selectedQual + ".mp4")
		const url = "http://" + this.state.link + this.props.item.id + "_" + this.getNum(parseInt(this.state.selected.substr(this.state.selected.length - 1)) - 1) +
			"_" + this.getNum(this.state.serieI) + "_" + this.state.selectedLang + "_"
			+ this.state.selectedQual + ".mp4"
		const config = {
			downloadTitle: this.checkTitle(this.props.item),
			downloadDescription: 'მიმდინარეობს გადმოწერა',
			saveAsName: (this.state.selectedSerieToDownload + ".mp4"),
			allowedInRoaming: true,
			allowedInMetered: true,
			showInDownloads: true,
			external: false, //when false basically means use the default Download path (version ^1.3)
			path: "Downloads/" //if "external" is true then use this path (version ^1.3)
		};
		downloadManager.download(url, {}, config).then(() => {
			console.log('Download success!');
		}).catch(err => {
			console.log(err);
			if (err.reason == "ERROR_INSUFFICIENT_SPACE") {
				alert("თქვენ არ გაქვთ საკმარისი მეხსიერება")
			}
		})


		// alert("http://" + this.props.link + this.props.id + "_" + this.getNum(parseInt(this.state.selected.substr(this.state.selected.length - 1))-1) +
		// "_" + this.getNum(this.state.serieI) + "_" +  this.state.selectedLang + "_"
		// + this.state.selectedQual + ".mp4")
		// http://" + this.state.link +  this.props.navigation.state.params.key+ "_" + this.state.lang + "_" + 1500 + ".mp4
		this.setState({ ShowDownloadModal: false })

	}

	render() {
		const iconStar = <Icon name="md-star" size={16} color="#F5B642" />;
		const { details } = this.props;
		const { item } = this.props;
		const info = details;
		const options = this.state.QOptions;
		let height;
		if (this.state.tab === 0) height = this.state.infoTabHeight;
		if (this.state.tab === 1) height = this.state.castsTabHeight;
		if (this.state.tab === 2) height = this.state.trailersTabHeight;

		return (
			this.state.isLoading ? <View style={styles.progressBar}><ProgressBar /></View> :
				<View style={{ flex: 1, backgroundColor: '#0a0a0a' }}>
					<DropdownAlert ref={ref => this.dropdown = ref} />
					<ScrollView
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
							isVisible={this.state.ShowDownloadModal} >
							<View style={{
								flex: 1,
								flexDirection: 'column',
								justifyContent: 'center',
								alignItems: 'center'
							}}>
								<View style={{
									backgroundColor: "#2B2C3D",
									width: 300,
									alignItems: 'center',
									padding: 15
								}}>

									<View style={{ width: 250 }}>
										<Dropdown
											label='სეზონის არჩევა'
											baseColor="#fff"
											textColor="#FFF"
											data={this.state.sznss}
											selectedItemColor="#000"
											value={this.state.selected}
											onChangeText={(data) => this.onValueChange(data)}
										/>
									</View>
									{
										this.state.seriesToDown ? (
											<View style={{ width: 250, marginTop: 15 }}>
												<Dropdown
													label='სერიის არჩევა'
													baseColor="#fff"
													textColor="#FFF"
													data={this.state.seriesToDown}
													selectedItemColor="#000"
													value={this.state.selectedSerieToDownload}
													onChangeText={(data, ind, dat) => this.selectSerieToDownload(data, ind, dat)}
												/>
											</View>
										) : (
												<View />
											)
									}
									{
										this.state.selectedSerieToDownloadData ? (
											<View style={{ width: 250 }}>
												<Text style={{ color: "#FFF", paddingTop: 20, paddingBottom: 20 }}>აირჩიე ენა</Text>
												<SwitchSelector options={this.state.options} initial={0} onPress={value => this.setState({ selectedLang: value })} />
												<Text style={{ color: "#FFF", paddingTop: 20, paddingBottom: 20 }}>აირჩიე ხარისხი</Text>

												<SwitchSelector options={this.state.Quality_Options} initial={0} onPress={value => this.setState({ selectedQual: value })} />
											</View>
										) : (<View />)
									}


									<View style={{ marginTop: 50, flexDirection: 'row' }}>


										<TouchableOpacity onPress={() => this.setState({ ShowDownloadModal: false })} style={{ height: 30, width: 110, backgroundColor: "#2B2C3D", borderRadius: 25, justifyContent: 'center', alignItems: 'center' }}>
											<Text style={{ color: "#FFF" }} >დახურვა</Text>
										</TouchableOpacity>
										<View style={{ width: 10 }} />
										<TouchableOpacity disabled={this.state.selectedSerieToDownloadData ? (false) : (true)} onPress={() => this.startDownloading()} style={{
											height: 38,
											width: 110,
											backgroundColor: this.state.selectedSerieToDownloadData ? ("#FFF") : ("2B2C3D"), borderRadius: 5, justifyContent: 'center', alignItems: 'center'
										}}>
											<Text style={{ color: this.state.selectedSerieToDownloadData ? ("#2B2C3D") : ("#7a797a") }}>გადმოწერა</Text>
										</TouchableOpacity>


									</View>

								</View>
							</View>
						</Modal >
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

						<View style={{ height }}>
							<View>
								<Image blurRadius={2} source={{ uri: item.poster ? (item.poster) : ("http://staticnet.adjara.com/moviecontent/" + item.id + "/covers/214x321-" + item.id + ".jpg") }} style={styles.imageBackdrop} />
								<LinearGradient colors={['rgba(0, 0, 0, 0.2)', 'rgba(0,0,0, 0.2)', 'rgba(0,0,0, 0.7)']} style={styles.linearGradient} />
								<View style={{ position: 'absolute', top: 100, alignSelf: 'center', flexDirection: 'row' }}>
									<TouchableOpacity style={{ width: 50, height: 50 }} onPress={() => {
										this.setState({ ShowQrModal: true })
									}} >
										<MaterialCommunityIcons size={50} color="#FFF" name="qrcode" />
									</TouchableOpacity>

									<TouchableOpacity style={{ width: 50, height: 50, marginLeft: 15 }} onPress={() => {
										this.setState({ ShowDownloadModal: true })
									}} >
										<Icon size={50} color="#FFF" name="md-download" />
									</TouchableOpacity>
								</View>
							</View>

							<View style={styles.cardContainer}>
								<Image source={{ uri: item.poster ? (item.poster) : ("http://staticnet.adjara.com/moviecontent/" + item.id + "/covers/214x321-" + item.id + ".jpg") }} style={styles.cardImage} />
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
										<View style={styles.cardStar}>
											{iconStar}
											<Text style={styles.cardStarRatings}>{this.checkImdb(item)}</Text>
										</View>
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
									<Series tabLabel="SERIES" id={this.props.item.id} link={this.state.link} seasons={this.state.seasons} series={this.state.series} getTabHeight={this._getTabHeight} />
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
																	{/* <Image style={{ width: 50, height: 50, borderRadius: 25, marginTop: 0 }} source={{ uri: this.getPhoto((item.avatar + "&redirect=false")) }} /> */}
																	{/* <AsyncImageAnimated
																	source={{
																		uri: 'https://i.imgur.com/R5TraVR.p'
																	}}
																	placeholderColor={'#cfd8dc'}
																	style={{
																		width: 50, height: 50, borderRadius: 25, marginTop: 0
																	}}
																/> */}

																	<GetPhoto url={item.user.avatar} />
																</View>

																<View style={{ flex: 1, paddingLeft: 8 }}>
																	<Text style={{ color: "#FFF", fontWeight: 'bold' }}>{item.user.name}</Text>
																	<Text style={{ color: "#FFF", lineHeight: 20 }}>{item.msg}</Text>
																</View>

															</View>
															{
																this.state.loggedIn ? (
																	<Reactions
																		screenshot={() => {
																			this.refs["viko" + index].capture().then(uri => {
																				const shareOptions = {
																					title: 'Share via',
																					url: uri,
																				};
																				Share.open(shareOptions);
																			});

																		}}
																		userData={this.state.UserData} onChange={(type, lk) => { this.ReactLove(this.state.keys[index], lk, type) }} item={item} />
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
					</ScrollView >
				</View >
		);
	}
}

Serie.navigatorStyle = {
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

export default connect(mapStateToProps, mapDispatchToProps)(Serie);
