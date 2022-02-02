import React, { Component } from "react";
import { getMovies } from "../services/fakeMovieService";

import Pagination from "./common/pagination";
import { paginate } from "../utils/paginate";
import ListGroup from "./common/listgroup";
import { getGenres } from "../services/fakeGenreService";
import MoviesTable from "./common/moviesTable";
import _ from "lodash";

class Movies extends Component {
	state = {
		//movies: getMovies(),
		movies: [],
		genres: [],
		pageSize: 4,
		currentPage: 1,
		sortColumn: { path: "title", order: "asc" },
	};

	componentDidMount() {
		const genres = [{ _id: "", name: "All Genres" }, ...getGenres()];
		this.setState({ movies: getMovies(), genres: genres });
	}
	handleGenreSelect = (genre) => {
		this.setState({ selectedGenre: genre, currentPage: 1 });
		console.log("Genre: ", genre);
	};
	handleSort = (sortColumn) => {
		this.setState({ sortColumn });
		//console.log("handleSort: ", path);
	};
	handleLike = (movie) => {
		const movies = [...this.state.movies];
		const index = movies.indexOf(movie);
		movies[index] = { ...movies[index] };
		movies[index].liked = !movies[index].liked;
		this.setState({ movies });
		//console.log("Like, Clicked", movie);
	};
	handlePageChange = (page) => {
		this.setState({ currentPage: page });
		//console.log("handlePageChange: ", page);
	};
	handleDelete = (movie) => {
		const movies_filtered = this.state.movies.filter(
			(m) => m._id !== movie._id
		);
		this.setState({ movies: movies_filtered });
		//console.log("Total Object: ", this.state.movies.length);
	};
	getBadgeClasess() {
		let classes = "badge m-2 bg-";
		const { length: countMovies } = this.state.movies;
		classes += countMovies === 0 ? "success" : "info";
		return classes;
	}

	getPageData = () => {
		const {
			pageSize,
			currentPage,
			sortColumn,
			selectedGenre,
			movies: allMovies,
		} = this.state;
		const filtered =
			selectedGenre && selectedGenre._id
				? allMovies.filter((m) => m.genre._id === selectedGenre._id)
				: allMovies;
		const sorted = _.orderBy(filtered, [sortColumn.path], [sortColumn.order]);
		const movies = paginate(sorted, currentPage, pageSize);
		return { totalCount: filtered.length, data: movies };
	};
	render() {
		const { length: countMovies } = this.state.movies;
		const { pageSize, currentPage, sortColumn } = this.state;
		if (countMovies === 0) {
			return (
				<p className={this.getBadgeClasess()}>
					There are no movies in the database.
				</p>
			);
		}

		const { totalCount, data: movies } = this.getPageData();
		return (
			<div className="row">
				<div className="col-3">
					<ListGroup
						items={this.state.genres}
						// Because we defined in the ListGroup:defaultProps
						// textProperty="name"
						// valueProperty="_id"

						selectedItem={this.state.selectedGenre}
						onItemSelect={this.handleGenreSelect}
					/>
				</div>
				<div className="col">
					<p className={this.getBadgeClasess()}>
						Showing {totalCount} movies in the databse
					</p>
					<MoviesTable
						movies={movies}
						sortColumn={sortColumn}
						onLike={this.handleLike}
						onDelete={this.handleDelete}
						onSort={this.handleSort}
					/>
					<Pagination
						itemsCount={totalCount}
						pageSize={pageSize}
						currentPage={currentPage}
						onPageChange={this.handlePageChange}
					/>
				</div>
			</div>
		);
	}
}

export default Movies;
