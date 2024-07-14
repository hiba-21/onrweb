import React, { useEffect, useState, useCallback } from "react";
import styled from "styled-components";
import { Article_Sort_By } from "../../utils/ArticleData";
import { CiFilter, CiSearch } from "react-icons/ci";
import { useArticleContext } from "../../context/ArticleContext";
import throttle from "lodash/throttle";
import debounce from "lodash/debounce";

const SearchAndFilter = () => {
    const { handleArticleFetch } = useArticleContext();
    const [sortBy, setSortBy] = useState("");
    const [searchQuery, setSearchQuery] = useState("");

    // Throttle function for search query
    const throttledSearch = useCallback(
        throttle((query) => {
            setSearchQuery(query);
        }, 300), // Adjust the throttle delay as needed (300ms in this case)
        []
    );

    // Debounce function for search query
    const debouncedSearch = useCallback(
        debounce((query) => {
            throttledSearch(query);
        }, 300), // Adjust the debounce delay as needed (300ms in this case)
        [throttledSearch]
    );

    const handleSearchChange = (e) => {
        debouncedSearch(e.target.value);
    };

    useEffect(() => {
        const baseUrl = "http://localhost:3000/api/v1/articles?page=1&limit=6";
        let url = baseUrl;
        const queryParams = {};

        if (searchQuery) {
            queryParams.search = searchQuery;
        }
        if (sortBy) {
            queryParams.sort = sortBy;
        }

        const queryString = new URLSearchParams(queryParams).toString();
        if (queryString) {
            url += `&${queryString}`;
        }
        console.log(url);
        handleArticleFetch(url);
    }, [sortBy, searchQuery]);

    return (
        <Wrapper>
            <form action="" className="form">
                <div className="filter">
                    <div className="status-row">
                        <span className="text">Sort By</span>
                        <select
                            className="status-select"
                            onChange={(e) => setSortBy(e.target.value)}
                            value={sortBy}
                        >
                            <option value="">default</option>
                            {Article_Sort_By?.map((type, i) => (
                                <option key={i + type} value={type}>
                                    {type}
                                </option>
                            ))}
                        </select>
                    </div>
                    <div className="search-row">
                        <input
                            type="text"
                            placeholder="Type Article Title"
                            onChange={handleSearchChange}
                            // Using value={searchQuery} might cause the throttle to trigger continuously,
                            // it's better to leave the input value uncontrolled.
                        />
                        <span className="icon">
                            <CiSearch />
                        </span>
                    </div>
                </div>
            </form>
        </Wrapper>
    );
};

const Wrapper = styled.div`
    background-color: #f8f4f4;
    padding: 1.2rem 1rem;
    display: flex;
    align-items: center;
    border-radius: 6px;
    .hero-content {
        width: 100%;
        display: grid;
        grid-template-columns: minmax(auto, 600px) minmax(auto, 450px);
        justify-content: space-between;
        align-items: center;}
    .form {
        width: 100%;
        display: flex;
        justify-content: space-between;
        align-items: center;
    }
    .filter {
        display: flex;
        justify-content: flex-start;
        flex-wrap: wrap;
        align-items: center;
        column-gap: 1.1rem;
    }
    .hidden {
        display: inline-block;
    }
    @media screen and (max-width: 778px) {
        .form {
            flex-direction: column;
            row-gap: 1rem;
        }
        .filter {
            justify-content: center;
            row-gap: 0.75rem;
        }
        .hidden {
            display: none;
        }
    }
    .type-row,
    .status-row {
        display: flex;
        align-items: center;
    }
    .text {
        font-size: 13px;
        font-weight: 400;
        color: var(--color-black);
        opacity: 0.75;
        background-color: #e4e4e4;
        height: 100%;
        padding: 2px 5px;
    }
    .type-select,
    .status-select {
        text-transform: capitalize;
        padding: 1px 4px;
        outline: none;
        border: 1px solid #0000002c;
        border-radius: 0 3px 3px 0;
        color: #000;
        opacity: 0.8;
        font-size: 13px;
        background-color: #fafafa;
    }
    .search-row {
        display: flex;
        flex-wrap: wrap;
        justify-content: start;
        align-items: center;
        gap: 1rem;
        font-weight: 400;
    }
    .search-row .search {
        padding: 5px 8px;
        border: 2px solid #0000002c;
        font-size: 13px;
        border-radius: 3px;
    }

    .search-row .search:focus {
        border: 2px solid #000000ad;
        outline: none;
    }
    .search-row .icon {
        text-decoration: none;
        text-transform: capitalize;
        font-weight: 400;
        font-size: calc(1rem + 0.2vw);
        color: var(--color-white);
        background-color: var(--color-primary);
        border: 1px solid var(--color-primary);
        padding: calc(5px + 0.15vw) calc(15px + 0.3vw);
        border-radius: 6px;
        transition: all 0.3s ease-in;
    }
`;

export default SearchAndFilter;
