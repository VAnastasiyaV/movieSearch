import React, { Component } from 'react';
import PropTypes from 'prop-types';
// import store from 'store';
import { format, parseISO } from 'date-fns';
import { Tag, Card } from 'antd';
import RateStars from '../rate-stars';
import { GenresConsumer } from '../genres-context';

import './movie.css';

export default class Movie extends Component {

    shorten = (string, maxLength = 200, separator = ' ') => {
        if (string.length <= maxLength) return string;
        return string.substr(0, string.lastIndexOf(separator, maxLength));
    }

    render() {
        const {
            title, description, id, year, image, rating, guestSessionId, popularity, genreIds,
        } = this.props;

        const releaseDate = year ? format(parseISO(year), 'MMMM dd, yyyy') : 'no release date';

        const shortDescrip = this.shorten({ description }.description, 200) || 'no description';

        const popularClass = ['movie-popular']
        if (popularity >= 3 && popularity < 5) {
            popularClass.push('orange')
        }
        if (popularity >= 5 && popularity < 7) {
            popularClass.push('yellow')
        }
        if (popularity >= 7) {
            popularClass.push('green')
        }

        return (
            <GenresConsumer>
                {(genresList) => {
                    const movieGenres = [];

                    genreIds.forEach((genreId) => {
                        // eslint-disable-next-line react/destructuring-assignment
                        genresList.forEach((genre) => {
                            if (genre.id === genreId) {
                                movieGenres.push(genre.name);
                            }
                        })
                    });


                    const genres = movieGenres.map((genre) => (
                        <Tag className="movie__tag" key={genre}>
                            {genre}
                        </Tag>
                    ));

                    return (
                        < Card hoverable key={id}>
                            <img className="movie-image"
                                src={`https://image.tmdb.org/t/p/w500/${image}`}
                                alt={`poster of ${title}`} />
                            <p className="movie-title">{title}</p>
                            <span className={popularClass.join(' ')}>{popularity}</span>
                            <span className="movie-date">{releaseDate}</span>
                            <div className="movie-genres">
                                {genres}
                            </div>
                            <p className="movie-description">{shortDescrip}</p>
                            <RateStars
                                className="movie-rate-stars"
                                id={id}
                                guestSessionId={guestSessionId}
                                rating={rating} />
                        </Card>
                    )
                }}
            </GenresConsumer>
        )
    }
}

Movie.defaultProps = {
    title: '',
    description: '',
    id: 0,
    year: '',
    image: '',
    rating: '',
    guestSessionId: '',
    popularity: '',
    genreIds: '',
}

Movie.propTypes = {
    title: PropTypes.string,
    description: PropTypes.string,
    id: PropTypes.number,
    year: PropTypes.string,
    image: PropTypes.string,
    rating: PropTypes.string,
    guestSessionId: PropTypes.string,
    popularity: PropTypes.number,
    // eslint-disable-next-line react/forbid-prop-types
    genreIds: PropTypes.array,
}
