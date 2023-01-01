import React, { Component } from 'react';
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
    };

    setMovieRating = (rate) => {
        const { guestSessionId, id } = this.props;
        this.setState({
            rating: rate,
        });
        if (Number(rate) === 0) {
            this.SwapiService.deleteRatingMovie(id, guestSessionId);
        } else {
            this.SwapiService.setRatingMovie(id, guestSessionId, rate);
        }
        store.set(`${id}`, `${rate}`);
    };

    render() {
        const { rating } = this.state;
        return (
            <Rate
                allowHalf
                allowClear
                count={10}
                value={rating}
                onChange={(rate) => {
                    this.setMovieRating(rate);
                }}
            />
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