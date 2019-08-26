/* eslint-disable import/prefer-default-export */
import { Navigation } from 'react-native-navigation';

import Drawer from './modules/_global/Drawer';
import Movies from './modules/movies/Movies';
import MoviesList from './modules/movies/MoviesList';
import Movie from './modules/movies/Movie';
import Serie from './modules/movies/Serie';
import Search from './modules/movies/Search';
import Favorites from './modules/movies/Favorites';
import CatMoviesList from './modules/movies/CatMoviesList';
import ColMoviesList from './modules/movies/ColMoviesList';
import ActorMoviesList from './modules/movies/ActorMoviesList';
import CatCol from './modules/movies/CatCol';
import VideoPlayer from "./VideoPlayer"
import CategoriesPage from './modules/movies/CategoriesPage'
import CollectionsPage from './modules/movies/CollectionsPage'
import QrCodeScan from './modules/movies/QrCodeScan'

export function registerScreens(store, Provider) {
	Navigation.registerComponentWithRedux('movieapp.Movie', () => Movie, Provider, store);
	Navigation.registerComponentWithRedux('movieapp.Serie', () => Serie, Provider, store);
	Navigation.registerComponentWithRedux('movieapp.Movies', () => Movies, Provider, store);
	Navigation.registerComponentWithRedux('movieapp.MoviesList', () => MoviesList, Provider, store);
	Navigation.registerComponentWithRedux('movieapp.Search', () => Search, Provider, store);
	Navigation.registerComponentWithRedux('movieapp.Favorites', () => Favorites, Provider, store);
	Navigation.registerComponentWithRedux('movieapp.CatMoviesList', () => CatMoviesList, Provider, store);
	Navigation.registerComponentWithRedux('movieapp.ColMoviesList', () => ColMoviesList, Provider, store);
	Navigation.registerComponentWithRedux('movieapp.ActorMoviesList', () => ActorMoviesList, Provider, store);
	Navigation.registerComponentWithRedux('movieapp.CategoriesPage', () => CategoriesPage, Provider, store);
	Navigation.registerComponentWithRedux('movieapp.CollectionsPage', () => CollectionsPage, Provider, store);
	Navigation.registerComponentWithRedux('movieapp.QrCodeScan', () => QrCodeScan, Provider, store);


	Navigation.registerComponentWithRedux('movieapp.CatCol', () => CatCol, store, Provider);
	Navigation.registerComponent('movieapp.Drawer', () => Drawer);
	Navigation.registerComponent('movieapp.Player', () => VideoPlayer);
}
