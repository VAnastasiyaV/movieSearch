import React, { Component } from 'react';
import propsTypes from 'prop-types';

import debounce from 'lodash.debounce';

import './search-bar.css';

export default class SearchBar extends Component {
    state = {
        label: '',
    }

    debouncedChangeHandler =
        debounce(() => {
            this.props.searchQueryChange(this.state.label)
        }, 2000);


    changeHandler = (e) => {
        this.setState({
            label: e.target.value,
        });
        this.debouncedChangeHandler();
    }

    render() {
        const {
            search
        } = this.props;

        const searchClassName = search
            ? 'search-bar'
            : 'hidden';

        return (
            <input
                type="text"
                className={searchClassName}
                onChange={this.changeHandler}
                placeholder="Type to search..."
                value={this.state.label}
                autoFocus
            />
        );
    }
}

SearchBar.defaultProps = {
    search: 'search-bar',
    searchQueryChange: () => { },
}

SearchBar.propsTypes = {
    search: propsTypes.string,
    searchQueryChange: propsTypes.func,
}
