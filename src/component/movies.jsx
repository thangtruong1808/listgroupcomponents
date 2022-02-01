import React, { Component } from "react";
import { getMovies } from "../services/fakeMovieService";
import Like from "./common/like";
import Pagination from "./common/pagination";
import { paginate } from "../utils/paginate";
import ListGroup from "./common/listgroup";
import { getGenres } from "../services/fakeGenreService";

class Movies extends Component {
	state = {
		//movies: getMovies(),
		movies: [],
		genres: [],
		pageSize: 2,
		currentPage: 1,
	};

	componentDidMount() {
		const genres = [{ name: "All Genres" }, ...getGenres()];
		this.setState({ movies: getMovies(), genres: genres });
	}
	handleGenreSelect = (genre) => {
		this.setState({ selectedGenre: genre, currentPage: 1 });
		//console.log("Genre: ", genre);
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
		console.log("Total Object: ", this.state.movies.length);
	};
	getBadgeClasess() {
		let classes = "badge m-2 bg-";
		const { length: countMovies } = this.state.movies;
		classes += countMovies === 0 ? "success" : "info";
		return classes;
	}

	render() {
		const { length: countMovies } = this.state.movies;
		const {
			pageSize,
			currentPage,
			selectedGenre,
			movies: allMovies,
		} = this.state;
		if (countMovies === 0) {
			return (
				<p className={this.getBadgeClasess()}>
					There are no movies in the database.
				</p>
			);
		}
		const filtered =
			selectedGenre && selectedGenre._id
				? allMovies.filter((m) => m.genre._id === selectedGenre._id)
				: allMovies;
		const movies = paginate(filtered, currentPage, pageSize);
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
						Showing {filtered.length} movies in the databse
					</p>
					<table className="table">
						<thead>
							<tr>
								<th>Title</th>
								<th>Genre</th>
								<th>Stock</th>
								<th>Rate</th>
								<th></th>
								<th></th>
							</tr>
						</thead>
						<tbody>
							{movies.map((movie) => (
								<tr key={movie._id}>
									<td>{movie.title}</td>
									<td>{movie.genre.name}</td>
									<td>{movie.numberInStock}</td>
									<td>{movie.dailyRentalRate}</td>
									<td>
										<Like
											liked={movie.liked}
											onClick={() => this.handleLike(movie)}
										/>
									</td>
									<td>
										<button
											onClick={() => this.handleDelete(movie)}
											className="btn btn-danger btn-sm"
										>
											Delete
										</button>
									</td>
								</tr>
							))}
						</tbody>
					</table>
					<Pagination
						itemsCount={filtered.length}
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
