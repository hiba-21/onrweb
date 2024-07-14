import React, { useContext, useEffect, useState } from "react";
import axios from "axios";
import { getAllHandler } from "../utils/FetchHandlers";

const articleContext = React.createContext();

const ArticleContext = ({ children }) => {
    const [articleLoading, setArticleLoading] = useState(true);
    const [articleError, setArticleError] = useState({ status: false, message: "" });
    const [articles, setArticles] = useState({});

    const handleArticleFetch = async (url) => {
        setArticleLoading(true);
        try {
            const response = await axios.get(url, { withCredentials: true });
            setArticleError({ status: false, message: "" });
            setArticles(response?.data);
        } catch (error) {
            setArticleError({ status: true, message: error?.message });
            setArticles({ status: false });
            setArticleLoading(false);
        }
        setArticleLoading(false);
    };

    useEffect(() => {
        handleArticleFetch(
            `http://localhost:3000/api/v1/articles?page=1`
        );
    }, []);
    const passing = {
        articleLoading,
        articleError,
        articles,
        setArticles,
        handleArticleFetch,
    };

    return (
        <articleContext.Provider value={passing}>{children}</articleContext.Provider>
    );
};

const useArticleContext = () => useContext(articleContext);

export { useArticleContext, ArticleContext };
