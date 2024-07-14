import React, { useState } from "react";
import styled from "styled-components";
import Swal from "sweetalert2";
import dayjs from "dayjs";
import { FaRegCalendarAlt } from "react-icons/fa";
import { TfiLocationPin } from "react-icons/tfi";
import { BsFillBriefcaseFill } from "react-icons/bs";
import { TbTargetArrow } from "react-icons/tb";
import { useUserContext } from "../../context/UserContext";
import { postHandler } from "../../utils/FetchHandlers";
import { Link } from "react-router-dom";
import ApplyFormModal from "./ApplyFormModal"; // Assuming correct path

const JobCard = ({ job }) => {
  const date = dayjs(job?.jobDeadline).format("MMM Do, YYYY");
  const { user } = useUserContext();
  const [showForm, setShowForm] = useState(false);

  const handleApply = async () => {
    if (user?.email) {
      let currentDate = new Date();
      let date = currentDate.toISOString().slice(0, 10);
      const appliedJob = {
        applicantId: user?._id,
        recruiterId: job?.createdBy,
        jobId: job?._id,
        status: "pending",
        dateOfApplication: date,
        resume: user?.resume || "",
      };
      try {
        const response = await postHandler({
          url: "http://localhost:3000/api/v1/application/apply",
          body: appliedJob,
        });
        Swal.fire({
          icon: "success",
          title: "Hurray...",
          text: response?.data?.message,
        });
      } catch (error) {
        console.log(error);
        if (error?.response?.data?.error) {
          Swal.fire({
            icon: "error",
            title: "Oops...",
            text: "Please upload your resume before applying.",
          });
        } else {
          Swal.fire({
            icon: "error",
            title: "Oops...",
            text: error?.response?.data,
          });
        }
      }
    } else {
      setShowForm(true);
    }
  };

  const handleFormSubmit = async (formData) => {
    try {
      const appliedJob = new FormData();
      appliedJob.append("username", formData.get("name"));
      appliedJob.append("email", formData.get("email"));
      appliedJob.append("recruiterId", job?.createdBy);
      appliedJob.append("jobId", job?._id);
      appliedJob.append("status", "pending");
      appliedJob.append("resume", formData.get("resume"));

      const response = await postHandler({
        url: "http://localhost:3000/api/v1/ApplicationGeust/applyGeust",
        body: appliedJob,
        isFormData: true, // Pass this to indicate form data
      });
      setShowForm(false); // Close the form after submission
      Swal.fire({
        icon: "success",
        title: "Hurray...",
        text: response?.data?.message,
      });
    } catch (error) {
      console.error("Error applying for job:", error);
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: "An error occurred while applying for this job.",
      });
    }
  };

  const isAdminOrRecruiter = () => {
    return user?.role === "admin" || user?.role === "recruiter";
  };

  return (
    <Wrapper>
      <div className="card-container">
        <div className="card-header">
          <div className="logo">
            <span>{job.company.charAt(0)}</span>
          </div>
          <div className="right">
            <h2 className="title">{job?.titre}</h2>
            <h4 className="company">- {job?.company}</h4>
          </div>
        </div>
        <div className="middle-row">
          <div className="location" title="Last Date">
            <FaRegCalendarAlt className="mr-2 text-lg" />
            <span className="">{date}</span>
          </div>
          <div className="location">
            <TfiLocationPin className="mr-2 text-lg" />
            <span className="">{job?.jobLocation}</span>
          </div>
          <div className="type">
            <BsFillBriefcaseFill className="mr-2 text-lg" />
            <span className="capitalize">{job?.jobType}</span>
          </div>
          <div className="status capitalize">
            <TbTargetArrow className="mr-2 text-lg" />
            <span className={job?.jobStatus}>{job?.jobStatus}</span>
          </div>
        </div>
        <div className="end-row">
          <Link to={`/job/${job._id}`} className="detail-btn">
            details
          </Link>
          {!isAdminOrRecruiter() && (
            <button className="apply-btn" onClick={handleApply}>
              Apply
            </button>
          )}
          {user?._id === job?.createdBy && (
            <Link to={`/dashboard/edit-job/${job._id}`} className="detail-btn">
              edit
            </Link>
          )}
        </div>
      </div>
      {showForm && (
        <ApplyFormModal
          onClose={() => setShowForm(false)}
          onSubmit={handleFormSubmit}
        />
      )}
    </Wrapper>
  );
};

const Wrapper = styled.div`
  width: 100%;
  height: 100%;
  margin: 0 auto;
  .card-container {
    height: 100%;
    box-shadow: 0 4px 4px var(--shadow-medium),
      0 -2px 6px var(--shadow-medium);
    border-radius: 4px;
    padding: 2rem 1.5rem;
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
    color: var(--color-white);
    font-size: 30px;
    font-weight: 700;
    display: flex;
    justify-content: center;
    align-items: center;
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
  .status span.interview {
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

export default JobCard;
