import React, { Component, Fragment } from 'react';
import store from 'store';
import PropTypes from 'prop-types';
import { Rate } from 'antd';

import './rate-stars.css';
import SwapiService from '../../services/swapi-service';

export default class RateStars extends Component {
    SwapiService = new SwapiService();

    state = {
        // eslint-disable-next-line react/destructuring-assignment
        rating: store.get(`${this.props.id}`) || '0',
        loading: true
    };

    setMovieRating = (rate) => {
        const { guestSessionId, id } = this.props;

        if (Number(rate) === 0) {
            this.SwapiService.deleteRatingMovie(id, guestSessionId);
        } else {
            this.SwapiService.setRatingMovie(id, guestSessionId, rate).then(() => {
                this.setState({
                    rating: rate,
                });
                store.set(`${id}`, `${rate}`);
            })
                .catch(() => {
                    this.setState({
                        loading: false
                    })
                });
        }
    };

    render() {
        const { rating, loading } = this.state;
        const ErrorMessage = loading
            ? null
            // eslint-disable-next-line react/no-unescaped-entities
            : <div className='rate-stars__errorMessage'>Request error. The film can't be rated.</div>
        return (
            <>
                <Rate
                    allowClear
                    count={10}
                    value={rating}
                    onChange={(rate) => {
                        this.setMovieRating(rate);
                    }}
                />
                {ErrorMessage}
            </>
        );
    }
}

RateStars.defaultProps = {
    guestSessionId: '',
    id: 0,
};

RateStars.propTypes = {
    guestSessionId: PropTypes.string,
    id: PropTypes.number,
};