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
import CatCol from './modules/movies/CatCol';
import VideoPlayer from "./modules/movies/VideoPlayer"

export function registerScreens(store, Provider) {
	Navigation.registerComponentWithRedux('movieapp.Movie', () => Movie, Provider, store);
	Navigation.registerComponentWithRedux('movieapp.Serie', () => Serie, Provider, store);
	Navigation.registerComponentWithRedux('movieapp.Movies', () => Movies, Provider, store);
	Navigation.registerComponentWithRedux('movieapp.MoviesList', () => MoviesList, Provider, store);
	Navigation.registerComponentWithRedux('movieapp.Search', () => Search, Provider, store);
	Navigation.registerComponentWithRedux('movieapp.Favorites', () => Favorites, Provider, store);
	Navigation.registerComponentWithRedux('movieapp.CatMoviesList', () => CatMoviesList, Provider, store);
	Navigation.registerComponentWithRedux('movieapp.ColMoviesList', () => ColMoviesList, Provider, store);
	Navigation.registerComponentWithRedux('movieapp.CatCol', () => CatCol, store, Provider);
	Navigation.registerComponent('movieapp.Drawer', () => Drawer);
	Navigation.registerComponent('movieapp.Player', () => VideoPlayer);
}
