import React, { useEffect, useState, useCallback } from "react";
import styled from "styled-components";
import {  Job_Type, Job_Sort_By, JOB_Modality } from "../../utils/JobData";
import { CiFilter, CiSearch } from "react-icons/ci";
import { useJobContext } from "../../context/JobContext";
import throttle from "lodash/throttle";
import debounce from "lodash/debounce";

const SearchAndFilter = () => {
    const { handleJobFetch } = useJobContext();

    const [typeFilter, setTypeFilter] = useState("");
    //const [statusFilter, setStatusFilter] = useState("");
    const [ModalityFilter, setModalityFilter] = useState("");
    const [sortBy, setSortBy] = useState("");
    const [searchQuery, setSearchQuery] = useState("");

    /**
     * la fonction debouncedSearch appelle throttledSearch, qui est ensuite utilisée pour mettre à jour l'état searchQuery 
     * après une période d'inactivité de 300 ms. Cela assure que la recherche est effectuée à une fréquence contrôlée et uniquement 
     * après que l'utilisateur a cessé de taper pendant un certain temps.
     */
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
        const baseUrl = "http://localhost:3000/api/v1/jobs?page=1&limit=5";
        let url = baseUrl;
        const queryParams = {};

        if (searchQuery) {
            queryParams.search = searchQuery;
        }
        if (typeFilter) {
            queryParams.jobType = typeFilter;
        }
        /*if (statusFilter) {
            queryParams.jobStatus = statusFilter;
        }*/
        if (ModalityFilter) {
            queryParams.jobModality = ModalityFilter;
        }
        if (sortBy) {
            queryParams.sort = sortBy;
        }

        const queryString = new URLSearchParams(queryParams).toString();
        if (queryString) {
            url += `&${queryString}`;
        }
        console.log(url);
        handleJobFetch(url);
    }, [typeFilter, ModalityFilter, sortBy, searchQuery]);

    return (
        <Wrapper>
            <form action="" className="form">
                <div className="filter">
                    <div className="hidden">
                        <CiFilter />
                    </div>
                    <div className="type-row">
                        <span className="text">Types</span>
                        <select
                            className="type-select"
                            onChange={(e) => setTypeFilter(e.target.value)}
                            value={typeFilter}
                        >
                            <option value="">default</option>
                            {Job_Type?.map((type, i) => (
                                <option key={i + type} value={type}>
                                    {type}
                                </option>
                            ))}
                        </select>
                    </div>
                    <div className="status-row">
                        <span className="text">Modality</span>
                        <select
                            className="status-select"
                            onChange={(e) => setModalityFilter(e.target.value)}
                            value={ModalityFilter}
                        >
                            <option value="">default</option>
                            {JOB_Modality?.map((type, i) => (
                                <option key={i + type} value={type}>
                                    {type}
                                </option>
                            ))}
                        </select>
                    </div>
                    <div className="status-row">
                        <span className="text">Sort By</span>
                        <select
                            className="status-select"
                            onChange={(e) => setSortBy(e.target.value)}
                            value={sortBy}
                        >
                            <option value="">default</option>
                            {Job_Sort_By?.map((type, i) => (
                                <option key={i + type} value={type}>
                                    {type}
                                </option>
                            ))}
                        </select>
                    </div>
                </div>
                <div className="search-row">
                    <input
                        type="text"
                        className="search"
                        placeholder="Type Job Title"
                        onChange={handleSearchChange}
                        // Using value={searchQuery} might cause the throttle to trigger continuously,
                        // it's better to leave the input value uncontrolled.
                    />
                    <span className="icon">
                        <CiSearch />
                    </span>
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
        border: 2px solid #0000002c;
        border-radius: 3px;
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
