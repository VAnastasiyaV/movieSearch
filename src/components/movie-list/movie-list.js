import React, { Component } from 'react';
import PropsTypes from 'prop-types'
import store from 'store';
import { Row, Col, Pagination } from 'antd';

import Movie from '../movie';
import './movie-list.css';

export default class MovieList extends Component {

    render() {
        const {
            movies, changePage, currentPage, guestSessionId, totalPages
        } = this.props;
        const moviesList = movies.filter(movie => Boolean(movie.totalPages) !== true);

        const renderMovies = moviesList.map((movie) => (
            <Col span={12} xs={24} md={24} lg={12} key={movie.id}>
                <Movie
                    title={movie.title}
                    year={movie.year}
                    image={movie.image}
                    description={movie.description}
                    guestSessionId={guestSessionId}
                    id={movie.id}
                    rating={store.get(`${movie.id}`) || '0'}
                    popularity={movie.popularity}
                    genreIds={movie.genreIds}
                />
            </Col>
        ));

        return (
            <>
                <Row gutter={[16, 16]} justify='space-between'>
                    {renderMovies}
                </Row >
                <Pagination defaultCurrent={1}
                    current={currentPage}
                    pageSize={1}
                    total={totalPages}
                    showSizeChanger={false}
                    onChange={(page) => changePage(page)} />
            </>
        );
    }
}

MovieList.defaultProps = {
    movies: [],
    changePage: () => { },
    currentPage: 1,
    guestSessionId: '',
    totalPages: 0
}

MovieList.propsTypes = {
    // eslint-disable-next-line react/forbid-prop-types
    movies: PropsTypes.array,
    changePage: PropsTypes.func,
    currentPage: PropsTypes.number,
    guestSessionId: PropsTypes.string,
    totalPages: PropsTypes.number
}