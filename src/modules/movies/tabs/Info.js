import React, { PropTypes, Component } from 'react';
import {
	Text,
	View,
	ScrollView
} from 'react-native';
import _ from 'lodash';
import moment from 'moment';
import numeral from 'numeral';
import CardTwo from '../components/CardTwo'
import { Navigation } from "react-native-navigation"
import { iconsMap } from '../../../utils/AppIcons';
import styles from './styles/Info';
import axios from 'axios'




export default class Info extends Component {
	constructor(props) {
		super(props)
		this.state = {
			similarMovies: []
		}

		//alert(JSON.stringify(props.item))
		axios.get("http://net.adjara.com/Movie/BuildSliderRelated?ajax=1&movie_id=" + this.props.item.id + "&isepisode=0&type=related&order=top&period=day&limit=25")
			.then(res => {
				this.setState({ similarMovies: res.data })
			})

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

	render() {

		return (
			<View style={styles.container}>
				<View style={styles.overview}>
					<Text style={styles.label}>
						აღწერა
							</Text>
					<Text style={styles.overviewText}>
						{this.props.description}
					</Text>
				</View>

				<View style={styles.labelRow}>
					<Text style={styles.label}>გამოშვების წელი</Text>
					<Text style={styles.value}>{this.props.item.release_date}</Text>
				</View>
				<View style={styles.labelRow}>
					<Text style={styles.label}>რეჟისორი</Text>
					<Text style={styles.value}>{this.props.director}</Text>
				</View>

				<View style={{ marginTop: 15, alignItems: 'center' }}>
					<Text style={{ fontSize: 19, fontWeight: 'bold', color: "#FFF" }}>მსგავსი ფილმები</Text>
				</View>

				<View style={{ flex: 1, paddingTop: 20, flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'center' }}>
					{
						this.state.similarMovies.map(info => {
							return (
								<View style={{ padding: 20 }}>
									<CardTwo key={info.id} info={info} viewMovie={() => this._viewMovie(info.id, info)} />
								</View>
							)
						})
					}
				</View>
			</View>
		);
	}
}
