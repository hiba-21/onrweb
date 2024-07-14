import React from "react";
import styled from "styled-components";

import ArticlesListCom from "../components/AllArtcilesPage/ArticlesListCom";
import SearchAndFilter from "../components/AllArtcilesPage/SearchAndFilter";
import Head from "../components/AllArtcilesPage/Head"
import Navbar from "../components/shared/Navbar";
import PaginationCom from "../components/AllArtcilesPage/PaginationCom";

const AllArticles = () => {
    return (
        <> 
            <Navbar />
            <Wrapper>
                <Head/>
                <SearchAndFilter />
                <ArticlesListCom />
                <PaginationCom />
            </Wrapper>
        </>
    );
};

const Wrapper = styled.section`
    padding: 2rem 1.5rem;
    width: 100%;
    max-width: 1200px;
    margin: 0 auto;
`;
export default AllArticles;
