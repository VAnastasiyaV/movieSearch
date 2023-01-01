import React, { Component } from 'react';
import store from 'store';
import { Offline, Online } from "react-detect-offline";

import Header from '../header';
import SearchBar from '../search-bar';
import SwapiService from '../../services/swapi-service';
import ErrorIndicator from '../error-indicator';
import MovieList from '../movie-list';
import Spinner from '../spinner';
import { GenresProvider } from '../genres-context';

import './app.css';

export default class App extends Component {

    SwapiService = new SwapiService();

    state = {
        movies: [],
        ratedMovies: [],
        genresList: [],
        searchQuery: '',
        error: null,
        loading: true,
        currentPage: 1,
        totalPages: 0,
        search: true,
        guestSessionId: '',
        tabPane: '1',
    };

    componentDidMount() {
        if (!store.get('guestSessionId')) {
            this.createGuestSession();
        } else {
            this.setState({
                guestSessionId: store.get('guestSessionId'),
            });

            this.getGenresList();
            this.getTopRated();
        }

    }

    componentDidUpdate(prevProps, prevState) {
        if (this.state.searchQuery !== prevState.searchQuery) {
            this.searchMovies();
        }
    }

    componentDidCatch(error, info) {
        // eslint-disable-next-line no-console 
        console.error(info.componentStack);
    }

    getGenresList = () => {
        this.SwapiService
            .getGenersList()
            .then((res) => {
                this.setState({
                    genresList: [...res.genres],
                });
            })
            .catch(this.onError);
    }

    onMovieLoaded = (movies) => {
        const totalPages = movies.length === 0
            ? 0
            : movies.filter(movie => Boolean(movie.totalPages) !== false)[0].totalPages;
        this.setState({
            movies,
            loading: false,
            totalPages,
        })
    }

    onError = (error) => {
        this.setState({
            loading: false,
            error
        })
    }

    getTopRated = () => {
        const { currentPage } = this.state;
        this.setState({
            movies: [],
            search: true,
            loading: true
        });
        if (!this.state.searchQuery) {
            this.SwapiService
                .getTopRated(currentPage)
                .then(this.onMovieLoaded)
                .catch(this.onError)
        } else {
            this.searchMovies();
        }
    }

    getRatedMovies = () => {
        const { guestSessionId, currentPage } = this.state;
        this.setState({
            ratedMovies: [],
            search: true,
            loading: true
        });
        this.SwapiService
            .getRatedMovies(guestSessionId, currentPage)
            .then((ratedMovies) => {
                const totalPages = ratedMovies.length === 0
                    ? 0
                    : ratedMovies.filter(movie => Boolean(movie.totalPages) !== false)[0].totalPages;
                this.setState({
                    ratedMovies,
                    loading: false,
                    totalPages,
                })
            })
            .catch(this.onError)
    }

    createGuestSession = () => {
        this.SwapiService
            .getNewGuestSession()
            .then((res) => {
                store.set('guestSessionId', `${res.guest_session_id}`);
                this.setState({
                    // eslint-disable-next-line react/no-unused-state
                    guestSessionId: res.guest_session_id,
                    loading: false,
                });
            })
            .catch(this.onError);
    }

    searchQueryChange = (query) => {
        this.setState({
            searchQuery: query,
            currentPage: 1,
        })
    }

    searchMovies = () => {
        const { searchQuery, currentPage } = this.state;
        this.setState({
            movies: [],
            loading: true
        });

        if (!searchQuery) {
            this.getTopRated();
        } else {
            this.SwapiService
                .getMovieQuery(searchQuery, currentPage)
                .then(this.onMovieLoaded)
                .catch(this.onError)
        }
    };

    changeTabs = (key) => {
        if (key === '1') {
            this.setState({
                tabPane: key,
                currentPage: 1
            },
            () => {
                this.getTopRated()
            });
        } else {
            this.setState({
                tabPane: key,
                currentPage: 1
            },
            () => {
                this.getRatedMovies()
            });
        }
    }

    changePage = (page) => {
        const { tabPane } = this.state;
        this.setState(
            {
                currentPage: page
            },
            () => {
                if (tabPane === '1') {
                    this.searchMovies();
                } else {
                    this.getRatedMovies();
                }
            }
        );
    };

    render() {

        const { error, loading, genresList,
            movies, ratedMovies, tabPane,
            currentPage, totalPages,
            moviesPerPage, guestSessionId } = this.state;

        const movieFromBase = tabPane === '1' ? movies : ratedMovies;
        const search = tabPane === '1' ?
            <SearchBar searchQueryChange={this.searchQueryChange}
                search={this.state.search} /> :
            null;
        let contain;

        if (loading) {
            return <Spinner />
        }

        if (error) {
            return <ErrorIndicator />
        }

        if (movieFromBase.length === 0 && tabPane === '1') {
            contain = <div className='app__bad-query'><p>Nothing has been found. Enter another query</p></div>
        } else if (movieFromBase.length === 0 && tabPane === '2') {
            contain = <div className='app__bad-query'><p>Nothing has been rated. Should rate a film</p></div>
        } else {
            contain = <MovieList
                movies={movieFromBase}
                currentPage={currentPage}
                totalPages={totalPages}
                moviesPerPage={moviesPerPage}
                changePage={this.changePage}
                guestSessionId={guestSessionId}
                tabPane={tabPane} />;
        }

        return (
            <GenresProvider value={genresList}>
                <div className='app'>
                    <Online>
                        <Header
                            changeTabs={this.changeTabs}
                            tabPane={tabPane} />
                        {search}
                        {contain}
                    </Online>
                    <Offline>You are offline right now. Check your connection.</Offline>
                </div>
            </GenresProvider>
        );
    }
}
