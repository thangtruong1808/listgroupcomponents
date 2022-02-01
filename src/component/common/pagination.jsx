import React, { Component } from "react";
import _ from "lodash";
import PropTypes from "prop-types";

//Stateless Functional
const Pagination = (props) => {
	const { itemsCount, pageSize, currentPage, onPageChange } = props;
	console.log("currentPage: ", currentPage);
	const pagesCount = Math.ceil(itemsCount / pageSize);
	//console.log(pagesCount);
	if (pagesCount === 1) {
		return null;
	}
	//Creates an array of numbers. progressing from start up to but not including end
	const pages = _.range(1, pagesCount + 1);
	return (
		<nav>
			<ul className="pagination">
				{pages.map((page) => (
					<li
						key={page}
						className={page === currentPage ? "page-item active" : "page-item"}
					>
						<a
							onClick={() => onPageChange(page)}
							className="page-link"
							style={{ cursor: "pointer" }}
						>
							{page}
						</a>
					</li>
				))}
			</ul>
		</nav>
	);
};

Pagination.propTypes = {
	itemsCount: PropTypes.number.isRequired,
	pageSize: PropTypes.number.isRequired,
	currentPage: PropTypes.number.isRequired,
	onPageChange: PropTypes.func.isRequired,
};
export default Pagination;
