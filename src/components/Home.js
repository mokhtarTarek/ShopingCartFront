import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { useAlert } from 'react-alert';
import MetaData from './layouts/MetaData';
import Pagination from 'react-js-pagination';

import Slider from 'rc-slider';
import 'rc-slider/assets/index.css';

import Product from './product/Product';
import Loader from './layouts/Loader';
import { getProducts } from '../actions/productActions';

const { createSliderWithTooltip } = Slider;
const Range = createSliderWithTooltip(Slider.Range);

function Home() {
	const dispatch = useDispatch();
	const alert = useAlert();
	const { keyword } = useParams();

	const {
		loading,
		products,
		error,
		productsCount,
		resPerPage,
		filteredProductsCount,
	} = useSelector((state) => state.products);

	//console.log(productsCount);

	const [currentPage, setCurrentPage] = useState(1);
	const [price, setPrice] = useState([1, 1000]);
	const [category, setCategory] = useState('');

	const categories = [
		'All Categories',
		'Electronics',
		'Cameras',
		'Laptops',
		'Accessories',
		'Headphones',
		'Food',
		'Books',
		'Clothes/Shoes',
		'Beauty/Health',
		'Sports',
		'Outdoor',
		'Home',
	];

	useEffect(() => {
		if (error) {
			return alert.error(error);
		}
		dispatch(getProducts(keyword, currentPage, price, category));
	}, [dispatch, currentPage, keyword, price, error, category]);

	const setCurrentPageNo = (pageNumber) => {
		setCurrentPage(pageNumber);
	};

	let count = productsCount;
	if (keyword) {
		count = filteredProductsCount;
	}

	console.log('rerender');
	return (
		<>
			{loading ? (
				<Loader />
			) : (
				<>
					<MetaData title={'Bye best products online'} />
					<h1 id="products_heading">Latest Products</h1>

					<section id="products" className="container mt-5">
						<div className="row">
							<div className="col-6 col-md-3 mt-5 mb-5">
								<div className="px-5">
									<Range
										marks={{
											1: `$1`,
											1000: `$1000`,
										}}
										min={1}
										max={1000}
										defaultValue={[1, 1000]}
										tipFormatter={(value) => `$${value}`}
										tipProps={{
											placement: 'top',
											visible: true,
										}}
										value={price}
										onChange={(price) => setPrice(price)}
									/>
									<hr className="my-5" />

									<div className="mt-5">
										<h4 className="mb-3">Categories</h4>

										<ul className="pl-0">
											{categories.map((category) => (
												<li
													style={{
														cursor: 'pointer',
														listStyleType: 'none',
													}}
													key={category}
													onClick={() => setCategory(category)}
												>
													{category}
												</li>
											))}
										</ul>
									</div>
								</div>
							</div>

							{keyword ? (
								<>
									<div className="col-6 col-md-9">
										<div className="row">
											{products &&
												products.map((product) => (
													<Product
														key={product._id}
														product={product}
														col={4}
													/>
												))}
										</div>
									</div>
								</>
							) : (
								products &&
								products.map((product) => (
									<Product key={product._id} product={product} col={3} />
								))
							)}
						</div>
					</section>

					{resPerPage <= count && (
						<div className="d-flex justify-content-center mt-5">
							<Pagination
								activePage={currentPage}
								itemsCountPerPage={resPerPage}
								totalItemsCount={productsCount ? productsCount : 0}
								onChange={setCurrentPageNo}
								nextPageText={'Next'}
								prevPageText={'Prev'}
								firstPageText={'First'}
								lastPageText={'Last'}
								itemClass="page-item"
								linkClass="page-link"
							/>
						</div>
					)}
				</>
			)}
		</>
	);
}

export default Home;
