import React, { useEffect, useState } from "react";
import styled from "styled-components";
import Pagination from "./Pagination";
import { Link } from "react-router-dom";
import SearchComponent from "./SearchComponent";
import FliterComponent from "./FliterComponet";

const ListContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 20px;
  justify-content: center;
`;

const Card = styled.div`
  border: 1px solid teal;
  border-radius: 10px;
  padding: 10px;
  width: 250px;
  height:450px;
  background-color: #f9f9f9;
  text-align: center;
`;

const Image = styled.img`
  width: 100%;
  border-radius: 5px;
`;

const Title = styled.h3`
  margin: 10px 0;
  font-family: cursive;
`;

const Price = styled.p`
  font-weight: bold;
  font-family: cursive;
`;

const SortContainer = styled.div`
  display: flex;
  justify-content: center;
  border: 3px solid teal;
  gap: 45px;
  padding: 10px;
  background-color: #f9f9f9;
`;

const Sort = styled.div`
  border: 1px solid green;
  padding: 10px;

`;

const SearchCategory = styled.div`
  border: 1px solid green;
  padding: 10px;
  background-color: #f9f9f9;
`;

const MainContainer = styled.div`
  display: flex;
  flex-direction: row;
  border: 1px solid green;
  background-color: #f9f9f9;
`;

const ProductList = () => {
  const [sortingOrder, setSortingOrder] = useState("asc");
  const [products, setProducts] = useState([]);
  const [limit, setLimit] = useState(20);
  const [total, setTotal] = useState();
  const [currentPage, setCurrentPage] = useState(1);
  const skip = (currentPage - 1) * limit;
  const url = `https://dummyjson.com/products?limit=${limit}&skip=${skip}`;

  const getProducts = async (url) => {
    try {
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      const data = await response.json();
      setProducts(data.products);
      setTotal(data.total);
    } catch (error) {
      console.error("Error fetching products:", error);
    }
  };

  useEffect(() => {
    getProducts(url, skip, limit);
  }, [currentPage, limit, skip]);

  const handleCategoryFilter = (category, checked) => {
    if (checked) {
      const categoryurl = `https://dummyjson.com/products/category/${category}`;
      getProducts(categoryurl);
    } else {
      getProducts(url);
    }
  };

  const handleSearch = async (query) => {
    try {
      const response = await fetch(
        `https://dummyjson.com/products/search?q=${query}`
      );
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      const data = await response.json();
      setProducts(data.products);
      setTotal(data.total);
    } catch (error) {
      console.error("Error fetching products:", error);
    }
  };

  const handleSorting = (event) => {
    setSortingOrder(event.target.value);
    const sortedProducts = [...products].sort((a, b) => {
      if (event.target.value === "asc") {
        return a.price - b.price;
      } else {
        return b.price - a.price;
      }
    });
    setProducts(sortedProducts);
  };

  return (
    <div>
      <SortContainer>
        <Sort>
          <h2>sort by price</h2>
          <select onChange={handleSorting}>
            <option value={"asc"}>Low to High</option>
            <option value="desc"> High to Low</option>
          </select>
        </Sort>
        <SearchCategory>
          <SearchComponent handleSearch={handleSearch} />
        </SearchCategory>
      </SortContainer>
      <MainContainer>
        <FliterComponent handleCategoryFilter={handleCategoryFilter} />
        <ListContainer>
          {products.map((product) => (
            <Card key={product.id}>
              <Image src={product.images[0]} alt={product.title} />
              <Title>{product.title}</Title>
              <Price>Price - Rs.{product.price * 80}</Price>
              <Link to={`/${product.id}`}>
                <h4>get product details</h4>
              </Link>
            </Card>
          ))}
        </ListContainer>
      </MainContainer>

      <Pagination
        total={total}
        currentPage={currentPage}
        setCurrentPage={setCurrentPage}
      />
    </div>
  );
};

export default ProductList;
