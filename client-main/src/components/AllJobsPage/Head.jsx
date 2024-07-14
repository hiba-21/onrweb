import React, { useEffect, useState } from "react";

import styled from "styled-components";
import { CiSearch } from "react-icons/ci";
import { useJobContext } from "../../context/JobContext";
const Landing = () => {
    const { handleJobFetch } = useJobContext();
    const [searchQuery, setSearchQuery] = useState("");
    useEffect(() => {
        const baseUrl =
            "http://localhost:3000/api/v1/jobs?page=1&limit=6";
        let url = baseUrl;
        const queryParams = {};

        if (searchQuery) {
            queryParams.search = searchQuery;
        }
        
        // Constructing query string
        const queryString = new URLSearchParams(queryParams).toString();

        if (queryString) {
            url += `&${queryString}`;
            // url += `?${queryString}`;
        }
        console.log(url);
        handleJobFetch(url);
    }, [searchQuery]);

    return (
            <Wrapper>
                <div className="hero-content">
                    <div className="text-content">
                        <h1> Find your  <span className="fancy">new job </span> 
                            today 
                        </h1>
                        <p>
                            Thousands of jobs in the computer ,engineering and technology sectors are waiting for you.
                        </p>
                    </div>
                  
                </div>
                
            </Wrapper>
          
    );
};
const Wrapper = styled.div`
display: flex;
justify-content: center;
align-items: center;
/* min-height: 100vh; */
width: 100%;
max-width: 1250px;
margin: 0 auto;
padding: calc(1.5rem + 1.5vh) calc(1.2rem + 1.75vw);
.hero-content {
    width: 100%;
    display: grid;
    grid-template-columns: minmax(auto, 600px) minmax(auto, 450px);
    justify-content: space-between;
    align-items: center;
}
h1 {
    font-size: calc(1.2rem + 1.75vw);
    font-weight: 700;
    letter-spacing: 1.5px;
}
h1 .fancy {
    color: var(--color-primary);
}
p {
    font-size: calc(0.8rem + 0.2vw);
    font-weight: 300;
    line-height: 24px;
    text-align: justify;
    margin-top: 2rem;
    margin-bottom: 2.2rem;
}


@media screen and (max-width: 768px) {
    .hero-content {
        display: flex;
        flex-direction: column-reverse;
    }
    .text-content {
        margin-top: 1.75rem;
    }
   
    p {
        margin-top: 1.5rem;
        margin-bottom: 2.2rem;
    }
}
`
export default Landing;
