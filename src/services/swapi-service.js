export default class SwapiService {

    apiBase = 'https://api.themoviedb.org/3/';

    apiKey = '40ff226e70405a604d919f20e3d02db8';

    async getResource(url) {
        try {
            const res = await fetch(`${this.apiBase}${url}`);

            if (!res.ok) {
                throw new Error(`Could not fetch ${url}` +
                    `, received ${res.status}`)
            }
            const result = await res.json();
            return result
        } catch (err) {
            // eslint-disable-next-line no-console
            console.error('Ошибка с fetch запросом: ', err.message);
            return err.message;
        }
    }

    async getNewGuestSession() {
        const res = await this.getResource(`authentication/guest_session/new?api_key=${this.apiKey}`);
        return res;
    }

    async getTopRated(pageNumber = 1) {
        const res = await this.getResource(`movie/top_rated?api_key=${this.apiKey}&page=${pageNumber}`);
        const movies = res.results.map(this.transformMovie);
        if (res.results.length !== 0) movies.push({ totalPages: res.total_pages });
        return movies;
    }

    async getMovieQuery(query = 'return', pageNumber = 1) {
        const res = await this.getResource(`search/movie?api_key=${this.apiKey}&query=${query}&page=${pageNumber}`);
        let movies = res.results.map(this.transformMovie);
        if (res.results.length !== 0) movies = [...movies, { totalPages: res.total_pages }];
        return movies;
    }

    async getGenersList() {
        const res = await this.getResource(`genre/movie/list?api_key=${this.apiKey}`);
        return res;
    };

    async getRatedMovies(guestSessionId, pageNumber = 1) {
        const url = `guest_session/${guestSessionId}/rated/movies?api_key=${this.apiKey}&page=${pageNumber}`
        const res = await this.getResource(url);
        const movies = res.results.map(this.transformMovie);
        if (res.results.length !== 0) movies.push({ totalPages: res.total_pages });
        return movies
    };

    async setRatingMovie(id, guestSessionId, rating) {
        const url = `${this.apiBase}movie/${id}/rating?api_key=${this.apiKey}&guest_session_id=${guestSessionId}`;
        await fetch(url, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json;charset=utf-8' },
            body: JSON.stringify({ value: rating }),
        }).then((res) => {
            if (res.status <= 200 || res.status > 300) {
                const error = new Error(res.statusText);
                error.response = res;
                throw error
            }
        })
    }

    async deleteRatingMovie(id, guestSessionId) {
        const url = `movie/${id}/rating?api_key=${this.apiKey}&guest_session_id=${guestSessionId}`;
        await fetch(`${this.apiBase}${url}`, {
            method: 'DELETE',
            headers: { 'Content-Type': 'application/json;charset=utf-8' },
        });
    };

    transformMovie = (movie) => ({
        id: movie.id,
        title: movie.title,
        year: movie.release_date,
        image: movie.poster_path,
        description: movie.overview,
        popularity: movie.vote_average,
        genreIds: movie.genre_ids
    })
}