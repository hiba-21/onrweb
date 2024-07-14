import styled from "styled-components";
import dayjs from "dayjs";
import { FaRegCalendarAlt } from "react-icons/fa";
import { TfiLocationPin } from "react-icons/tfi";
import { TbTargetArrow } from "react-icons/tb";
import { useUserContext } from "../../context/UserContext";
import { Link } from "react-router-dom";

const ArticleCard = ({ article }) => {
  const date = dayjs(article?.publishedAt).format("MMM Do, YYYY");
  const { user } = useUserContext();

  // Check if the article is published or if the current user is the creator
  if (!article?.isPublished && user?._id !== article?.createdBy) {
    return null;
  }

  return (
    <Wrapper>
      <div className="card-container">
        {article?.images && article.images.length > 0 && (
          <div className="image-container">
            <img
              src={article.images[0]}
              alt="Article Image"
              className="article-image"
            />
          </div>
        )}
      
        <div className="middle-row">
          <div className="location" title="Last Date">
            <span className=""> {new Date(article?.publishedAt).toLocaleDateString()}</span>
          </div>
          <div className="card-header">
          {/*<div className="logo">
            <span>{article.titre.charAt(0)}</span>
            </div>*/}
          <div className="right">
            <h4 className="company">- {article?.titre}</h4>
          </div>
        </div>
          <div className="status capitalize">
            <TbTargetArrow className="mr-2 text-lg" />
            <span className={article?.isPublished ? "published" : "draft"}>
              {article?.isPublished ? "Published" : "Draft"}
            </span>
          </div>
        </div>
        <div className="end-row">
          <Link to={`/article/${article._id}`} className="detail-btn">
            details
          </Link>
          {user?._id === article?.createdBy && (
            <Link to={`/dashboard/edit-article/${article._id}`} className="detail-btn">
              edit
            </Link>
          )}
        </div>
      </div>
    </Wrapper>
  );
};

const Wrapper = styled.div`
  width: 100%;
  height: 100%;
  margin: 0 auto;
  .card-container {
    height: 100%;
    box-shadow: 0 4px 4px var(--shadow-medium), 0 -2px 6px var(--shadow-medium);
    border-radius: 4px;
    padding: 2rem 1.5rem;
  }
  .image-container {
    width: 100%;
    height: auto;
    margin-bottom: 1rem;
  }
  .article-image {
    width: 100%;
    height: auto;
    border-radius: 4px;
  }
  .card-container .card-header {
    display: flex;
    justify-content: flex-start;
    align-items: center;
  }
  .card-container .logo {
    margin-right: 18px;
    width: 50px;
    height: 50px;
    border-radius: 50%;
    background-color: #5095f9;
    display: flex;
    justify-content: center;
    align-items: center;
    color: var(--color-white);
    font-size: 30px;
    font-weight: 700;
    text-transform: uppercase;
  }
  .right .title {
    text-transform: capitalize;
    font-size: calc(15px + 0.3vw);
    font-weight: 600;
    color: var(--color-black);
    line-height: 24px;
  }
  .right .company {
    display: inline-block;
    text-transform: capitalize;
    font-size: calc(11px + 0.15vw);
    font-weight: 600;
    color: var(--color-black);
    letter-spacing: 1px;
    padding: 1px 2px;
    border-radius: 4px;
  }
  @media screen and (max-width: 550px) {
    .right .title {
      line-height: 18px;
    }
  }
  .middle-row {
    margin-top: 20px;
    display: grid;
    grid-template-columns: 1fr;
    grid-row-gap: calc(0.6rem + 0.09vw);
    align-items: center;
  }
  .location,
  .type,
  .status {
    display: flex;
    justify-content: flex-start;
    align-items: center;
    font-size: 14px;
  }
  .status span {
    background-color: #fefe7d;
    padding: 2px 15px;
    border-radius: 6px;
    text-transform: uppercase;
    font-size: 12.5px;
    font-weight: 400;
    letter-spacing: 1px;
  }
  .status span.pending {
    background-color: #fefe7d;
  }
  .status span.declined {
    background-color: #feb69a;
  }
  .status span.published {
    background-color: #a0ffa3;
  }
  .end-row {
    margin-top: calc(18px + 0.4vw);
    display: flex;
    align-items: center;
    gap: 10px;
  }
  .end-row .detail-btn {
    padding: 4px 18px;
    text-transform: capitalize;
    background-color: var(--color-black);
    color: var(--color-white);
    border-radius: 4px;
    letter-spacing: 1px;
    font-size: 14px;
    font-weight: 500;
    transition: all 0.3s linear;
    border: none;
  }
  .end-row .detail-btn:hover {
    background-color: #5095f9;
  }
  .end-row .apply-btn {
    padding: 4px 18px;
    text-transform: capitalize;
    background-color: #5095f9;
    color: var(--color-white);
    border-radius: 4px;
    letter-spacing: 1px;
    font-size: 14px;
    font-weight: 500;
    transition: all 0.3s linear;
    border: none;
    outline: none;
  }
  .end-row .apply-btn:hover {
    background-color: var(--color-black);
  }
`;

export default ArticleCard;
