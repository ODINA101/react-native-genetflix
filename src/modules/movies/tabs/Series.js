import React, { Component } from 'react';
import Math from "mathjs"
import {
	Text,
	View,
	Image,
	TouchableOpacity,
	AsyncStorage,
	Linking
} from 'react-native';
import { Navigation } from "react-native-navigation";
import { convertStringToNumber } from 'convert-string-to-number'
import styles from './styles/Casts';
import { TMDB_IMG_URL } from '../../../constants/api';
import { Dropdown } from 'react-native-material-dropdown';
import SwitchSelector from 'react-native-switch-selector';
import Modal from "react-native-modal";
import Swiper from 'react-native-swiper';
import VideoPlayer from "react-native-native-video-player"
import axios from "axios"
import { AppInstalledChecker, CheckPackageInstallation } from 'react-native-check-app-install';


export default class Series extends Component {
	constructor(props) {
		super(props);
		this.state = {
			seasons: [],
			selected: "სეზონი 1",
			series: props.series,
			Quality_Options: [],
			selectedQual: "",
			options: [],
			selectedLang: "",
			ShowModal: false,
			url: props.link,
			serieI: 0,
			selectedSerieId: null,
			selectedSznId: null,
			RecommendedPlayerInstalled: true,
			video_Options: [
				{ label: 'შიდა', value: 'shida' },
				{ label: 'მობილურის', value: 'mobiluris' },
			],
			selectedVideo: "shida",
			Captions: false,
			SubTitles_Options: [
				{ label: 'On', value: 'on' },
				{ label: 'Off', value: 'off' },
			],
			selectedCaptions: "",
			CaptionsUrl: ""
		}

		let szns = [];
		props.seasons.forEach((item, ind) => {
			szns.push({ value: ("სეზონი " + (ind + 1)) })
		})




		this._retrieveData = this._retrieveData.bind(this)
		this.state.seasons = szns
		this._retrieveData()

		AppInstalledChecker
			.checkPackageName('com.mxtech.videoplayer.ad')
			.then((isInstalled) => {
				this.setState({ RecommendedPlayerInstalled: isInstalled })
			});
	}
	getCaptions = (id) => {
		//	alert(parseInt(this.state.selected.substr(this.state.selected.length - 1)) - 1)
		///alert(this.getNum(parseInt(this.state.selected.substr(this.state.selected.length - 1)) - 1))
	//	alert("http://staticnet.adjara.com/subtitles/" + this.props.id + "_" + this.getNum(parseInt(this.state.selected.substr(this.state.selected.length - 1)) - 1, true) +
			//"_" + this.getNum(this.state.serieI, true) + "_English.vtt")
		axios.get("http://staticnet.adjara.com/subtitles/" + this.props.id + "_" + this.getNum(parseInt(this.state.selected.substr(this.state.selected.length - 1)) - 1, true) +
			"_" + this.getNum(this.state.serieI, true) + "_English.vtt")
			.then(res => {
				this.setState({
					Captions: true, CaptionsUrl: "http://staticnet.adjara.com/subtitles/" + this.props.id + "_" + this.getNum(parseInt(this.state.selected.substr(this.state.selected.length - 1)) - 1, true) +
						"_" + this.getNum(this.state.serieI, true) + "_English.vtt"
				})
			}).catch(error => {
				this.setState({ Captions: false, CaptionsUrl: "" })
			})
	}

	async _retrieveData() {
		try {
			const value = await AsyncStorage.getItem(('SelectedSerie' + this.props.id));
			if (value !== null) {
				// We have data!!
				this.setState({ selectedSerieId: value });
			} else {
			}
		} catch (error) {
			alert(error)
		}

		try {
			const value2 = await AsyncStorage.getItem(('SelectedSzn' + this.props.id));
			if (value2 !== null) {
				// We have data!!
				this.setState({ selected: value2, selectedSznId: value2 });
				this.getSeason(value2)
			} else {
				//alert(value2)
			}
		} catch (error) {
			//alert(error)
		}
	};

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

	async playSerie(lang, qual, serieI) {

		//alert('SelectedSerie'+this.props.id)


		try {
			await AsyncStorage.setItem(('SelectedSerie' + this.props.id), serieI.toString());
			this.setState({ selectedSerieId: serieI, selectedSznId: this.state.selected })
		} catch (error) {
			// Error saving data
		}

		try {
			await AsyncStorage.setItem(('SelectedSzn' + this.props.id), this.state.selected);
		} catch (error) {
			// Error saving data
		}

		// alert(JSON.stringify(lang))
		// alert(JSON.stringify(qual))
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
		this.setState({ serieI, options: nores, selectedLang: noption[0], Quality_Options: noqures, selectedQual: noquality[0] }, () => {

			this.getCaptions()
			this.setState({ ShowModal: true })
		})




	}

	Play() {
		// alert("http://" + this.props.link + this.props.id + "_" + this.getNum(parseInt(this.state.selected.substr(this.state.selected.length - 1)) - 1) +
		// 	"_" + this.getNum(this.state.serieI) + "_" + this.state.selectedLang + "_"
		// 	+ this.state.selectedQual + ".mp4")

		if (this.state.selectedVideo == "shida") {
			Navigation.showModal({
				stack: {
					children: [{
						component: {
							name: 'movieapp.Player',
							passProps: {
								url: "http://" + this.props.link + this.props.id + "_" + this.getNum(parseInt(this.state.selected.substr(this.state.selected.length - 1)) - 1) +
									"_" + this.getNum(this.state.serieI) + "_" + this.state.selectedLang + "_"
									+ this.state.selectedQual + ".mp4",
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
			VideoPlayer.showVideoPlayer("http://" + this.props.link + this.props.id + "_" + this.getNum(parseInt(this.state.selected.substr(this.state.selected.length - 1)) - 1) +
				"_" + this.getNum(this.state.serieI) + "_" + this.state.selectedLang + "_"
				+ this.state.selectedQual + ".mp4")
		}



		// alert("http://" + this.props.link + this.props.id + "_" + this.getNum(parseInt(this.state.selected.substr(this.state.selected.length - 1))-1) +
		// "_" + this.getNum(this.state.serieI) + "_" +  this.state.selectedLang + "_"
		// + this.state.selectedQual + ".mp4")
		// http://" + this.state.link +  this.props.navigation.state.params.key+ "_" + this.state.lang + "_" + 1500 + ".mp4
		this.setState({ ShowModal: false })

	}


	getSeason(value) {
		var datiko = [];
		let kaka = parseInt(value.substr(value.length - 1)) - 1;

		if (kaka == -1) {
			kaka = 9;
		}
		var sss = this.props.seasons[kaka];

		if (sss == undefined) {

		}
		datiko = Object
			.keys(sss)
			.map(i => {
				if (sss[i].quality || sss[i].lang || typeof (sss[i]) !== "undefined") {
					return sss[i]
				}
			})

		this.setState({ series: datiko, isLoading: false })



	}
	async onValueChange(value) {
		//	alert(Number.parseInt(value[value.length-1]))


		this.setState({ selected: value });
		//value = Number.parseInt(value[value.length-1]);
		this.getSeason(value)

		//
		// try {
		//    await AsyncStorage.setItem(('SelectedSzn'+this.props.id),value);
		//  } catch (error) {
		//    // Error saving data
		//  }


		//  if(this.state.savedSelectedIndex) {
		// if(this.state.savedSelectedIndexSzn) {
		//  this.save(value,this.state.savedSelectedIndex,this.state.savedSelectedIndexSzn)
		//
		// }else{
		//  this.save(value,this.state.savedSelectedIndex,null)
		//
		// }
		//  }else{
		//
		// 	 this.save(value,null,null)
		//  }
	}

	render() {
		let computedHeight = (80 + 15) * this.props.series.length; // (castImage.height + castContainer.marginBottom)
		computedHeight += 447 + 40; // Header height + container ((20 paddingVertical) = 40)
		return (
			<View style={styles.container} onLayout={this.props.getTabHeight.bind(this, 'series', computedHeight)}>
				<Dropdown
					label='სეზონის არჩევა'
					baseColor="#fff"
					textColor="#FFF"
					data={this.state.seasons}
					selectedItemColor="#000"
					value={this.state.selected}
					onChangeText={(data) => this.onValueChange(data)}
				/>
				<View style={{ marginTop: 30 }} />
				{
					this.state.series.map((item, ind) => (

						<TouchableOpacity onPress={() => this.playSerie(item.lang, item.quality, ind)} key={item.id} style={styles.castContainer}>
							{
								ind == this.state.selectedSerieId && this.state.selectedSznId == this.state.selected ? (
									<View style={[styles.characterContainer, { backgroundColor: "#F5F5F5" }]}>
										<Text style={[styles.characterName, { color: "#000" }]}>
											({ind + 1}) {item.name}
										</Text>
									</View>
								) : (
										<View style={styles.characterContainer}>
											<Text style={styles.characterName}>
												({ind + 1}) {item.name}
											</Text>
										</View>

									)
							}





						</TouchableOpacity>
					))
				}
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
							width: 300,
							alignItems: 'center',
							padding: 15
						}}>

							<Text style={{ color: "#FFF", paddingTop: 20, paddingBottom: 20 }}>აირჩიე ენა</Text>
							<SwitchSelector options={this.state.options} initial={0} onPress={value => this.setState({ selectedLang: value })} />
							<Text style={{ color: "#FFF", paddingTop: 20, paddingBottom: 20 }}>აირჩიე ხარისხი</Text>

							<SwitchSelector options={this.state.Quality_Options} initial={0} onPress={value => this.setState({ selectedQual: value })} />


							<Text style={{ color: "#FFF", paddingTop: 20, paddingBottom: 20 }}>აირჩიე player</Text>
							<SwitchSelector options={this.state.video_Options} initial={0} onPress={value => this.setState({ selectedVideo: value })} />


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

							<View style={{ marginTop: 50, flexDirection: 'row' }}>


								<TouchableOpacity onPress={() => this.setState({ ShowModal: false })} style={{ height: 30, width: 110, backgroundColor: "#2B2C3D", borderRadius: 25, justifyContent: 'center', alignItems: 'center' }}>
									<Text style={{ color: "#FFF" }} >დახურვა</Text>
								</TouchableOpacity>
								<View style={{ width: 10 }} />
								<TouchableOpacity onPress={() => this.Play()} style={{
									height: 38,
									width: 110,
									backgroundColor: "#FFF", borderRadius: 5, justifyContent: 'center', alignItems: 'center'
								}}>
									<Text style={{ color: "#2B2C3D" }}>კარგი</Text>
								</TouchableOpacity>


							</View>

						</View>
					</View>
				</Modal>
			</View>
		);
	}
}
