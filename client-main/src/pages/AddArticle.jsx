import React, { useState } from "react";
import styled from "styled-components";
import { CiSquarePlus } from "react-icons/ci";
import { MdClose } from "react-icons/md"; // Importer l'icône de suppression
import { useForm, useFieldArray } from "react-hook-form";
import axios from "axios";
import Swal from "sweetalert2";
import { v4 as uuidv4 } from "uuid";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";

const AddArticle = () => {
    const [isLoading, setIsLoading] = useState(false);
	 const [description, setDescription] = useState("");
    const { register, handleSubmit, reset, control, formState: { errors } } = useForm();
    const { fields: serviceFields, append: appendService, remove: removeService } = useFieldArray({ control, name: "services" });
    const { fields: communityFields, append: appendCommunity, remove: removeCommunity } = useFieldArray({ control, name: "community" });
    const { fields: referenceFields, append: appendReference, remove: removeReference } = useFieldArray({ control, name: "references" });

    const onSubmit = async (data) => {
        setIsLoading(true);
        const formData = new FormData();
        formData.append("titre", data.titre);
        formData.append("description", description);
        data.services.forEach(service => formData.append("services", service));
        data.community.forEach(community => formData.append("community", community));
        data.references.forEach(reference => formData.append("references", reference));
        formData.append("isPublished", data.isPublished);
        formData.append("publishedAt", data.isPublished ? new Date() : null);

        for (let i = 0; i < data.images.length; i++) {
            const file = data.images[i];
            const uniqueFileName = `${uuidv4()}-${file.name}`;
            formData.append("images", file, uniqueFileName);
        }

        try {
            const response = await axios.post(
                "http://localhost:3000/api/v1/Articles",
                formData,
                {
                    withCredentials: true,
                    headers: {
                        "Content-Type": "multipart/form-data",
                    },
                }
            );

            Swal.fire({
                icon: "success",
                title: "Done...",
                text: response?.data?.message,
            });

            reset();
			    setDescription(""); 
        } catch (error) {
            console.log(error);
            Swal.fire({
                icon: "error",
                title: "Oops...",
                text: error?.response?.data,
            });
        }
        setIsLoading(false);
    };

    return (
        <Wrapper>
            <div className="">
                <div className="title-row">
                    Create Article
                    <CiSquarePlus className="ml-1 text-xl md:text-2xl" />
                </div>
                <div className="content-row">
                    <form autoComplete="off" onSubmit={handleSubmit(onSubmit)}>
                        <div className="form">
                            {/* Title */}
                            <div className="row">
                                <label htmlFor="titre">Title</label>
                                <input
                                    type="text"
                                    id="titre"
                                    name="titre"
                                    placeholder="Article Title"
                                    {...register("titre", {
                                        required: {
                                            value: true,
                                            message: "Article Title is required",
                                        },
                                        maxLength: {
                                            value: 100,
                                            message: "Too long (max 100char)",
                                        },
                                        minLength: {
                                            value: 5,
                                            message: "Too short (min 5char)",
                                        },
                                    })}
                                />
                                {errors?.titre && (
                                    <span className="text-[10px] font-semibold text-red-600 mt-1 pl-1 tracking-wider">
                                        {errors?.titre?.message}
                                    </span>
                                )}
                            </div>
                            {/* Published */}
                            <div className="row">
                                <label htmlFor="isPublished">Publish</label>
                                <select
                                    defaultValue={"false"}
                                    name="isPublished"
                                    id="isPublished"
                                    {...register("isPublished", {
                                        required: {
                                            value: true,
                                            message: "Publish status is required",
                                        },
                                    })}
                                >
                                    <option value="true">Yes</option>
                                    <option value="false">No</option>
                                </select>
                                {errors?.isPublished && (
                                    <span className="text-[10px] font-semibold text-red-600 mt-1 pl-1 tracking-wider">
                                        {errors?.isPublished?.message}
                                    </span>
                                )}
                            </div>
                            {/* Images */}
                            <div className="row">
                                <label htmlFor="images">Images</label>
                                <input
                                    type="file"
                                    id="images"
                                    name="images"
                                    multiple
                                    {...register("images", {
                                        required: {
                                            value: true,
                                            message: "At least one image is required",
                                        },
                                    })}
                                />
                                {errors?.images && (
                                    <span className="text-[10px] font-semibold text-red-600 mt-1 pl-1 tracking-wider">
                                        {errors?.images?.message}
                                    </span>
                                )}
                            </div>

                            {/* Services */}
                            <div className="row">
                                <label htmlFor="services">Services</label>
                                {serviceFields.map((item, index) => (
                                    <div key={item.id} className="flex items-center">
                                        <input
                                            type="text"
                                            {...register(`services.${index}`, { required: "This field is required" })}
                                            placeholder="Add service"
                                            className="flex-1"
                                        />
                                        <button type="button" onClick={() => removeService(index)}>
                                            <MdClose className="text-red-500" />
                                        </button>
                                        {errors?.services?.[index] && (
                                            <span className="text-[10px] font-semibold text-red-600 mt-1 pl-1 tracking-wider">
                                                {errors?.services?.[index]?.message}
                                            </span>
                                        )}
                                    </div>
                                ))}
                                <button type="button" onClick={() => appendService('')} className="flex items-center">
                                    <CiSquarePlus className="mr-1" /> Add Service
                                </button>
                            </div>

                            {/* Community */}
                            <div className="row">
                                <label htmlFor="community">Community</label>
                                {communityFields.map((item, index) => (
                                    <div key={item.id} className="flex items-center">
                                        <input
                                            type="text"
                                            {...register(`community.${index}`, { required: "This field is required" })}
                                            placeholder="Add community"
                                            className="flex-1"
                                        />
                                        <button type="button" onClick={() => removeCommunity(index)}>
                                            <MdClose className="text-red-500" />
                                        </button>
                                        {errors?.community?.[index] && (
                                            <span className="text-[10px] font-semibold text-red-600 mt-1 pl-1 tracking-wider">
                                                {errors?.community?.[index]?.message}
                                            </span>
                                        )}
                                    </div>
                                ))}
                                <button type="button" onClick={() => appendCommunity('')} className="flex items-center">
                                    <CiSquarePlus className="mr-1" /> Add Community
                                </button>
                            </div>

                            {/* References */}
                            <div className="row">
                                <label htmlFor="references">References</label>
                                {referenceFields.map((item, index) => (
                                    <div key={item.id} className="flex items-center">
                                        <input
                                            type="text"
                                            {...register(`references.${index}`, { required: "This field is required" })}
                                            placeholder="Add reference"
                                            className="flex-1"
                                        />
                                        <button type="button" onClick={() => removeReference(index)}>
                                            <MdClose className="text-red-500" />
                                        </button>
                                        {errors?.references?.[index] && (
                                            <span className="text-[10px] font-semibold text-red-600 mt-1 pl-1 tracking-wider">
                                                {errors?.references?.[index]?.message}
                                            </span>
                                        )}
                                    </div>
                                ))}
                                <button type="button" onClick={() => appendReference('')} className="flex items-center">
                                    <CiSquarePlus className="mr-1" /> Add Reference
                                </button>
                            </div>
                            {/* Description */}
                            <div className="row">
                                <label htmlFor="description">Description</label>
                                    <ReactQuill
                                    className="textarea"
                                    value={description}
                                    onChange={setDescription}
                                    modules={{
                                        toolbar: [
                                            [{ 'header': '1'}, {'header': '2'}, { 'font': [] }],
                                            [{size: []}],
                                            ['bold', 'italic', 'underline', 'strike', 'blockquote'],
                                            [{'list': 'ordered'}, {'list': 'bullet'}, {'indent': '-1'}, {'indent': '+1'}],
                                            ['link', 'image'],
                                            ['clean']
                                        ],
                                    }}
                                    formats={[
                                        'header', 'font', 'size',
                                        'bold', 'italic', 'underline', 'strike', 'blockquote',
                                        'list', 'bullet', 'indent',
                                        'link', 'image'
                                    ]}
                                    placeholder="Write the article description here..."
                                />
                                {errors?.description && (
                                    <span className="text-[10px] font-semibold text-red-600 mt-1 pl-1 tracking-wider">
                                        {errors?.description?.message}
                                    </span>
                                )}
                            </div>
                        </div>

                        <div className="row mt-4 sm:mt-0">
                            <label htmlFor="" className="invisible">
                                delete
                            </label>
                            <input
                                type="submit"
                                value="Submit"
                                className="btn"
                                disabled={isLoading}
                            />
                        </div>
                    </form>
                </div>
            </div>
        </Wrapper>
    );
};

const Wrapper = styled.section`
    .title-row {
        display: flex;
        justify-content: flex-start;
        align-items: center;
        font-size: calc(0.9rem + 0.4vw);
        text-transform: capitalize;
        letter-spacing: 1px;
        font-weight: 600;
        opacity: 0.85;
        color: var(--color-black);
        position: relative;
    }
    .title-row:before {
        content: "";
        position: absolute;
        bottom: -4px;
        left: 0;
        width: calc(30px + 0.7vw);
        height: calc(2px + 0.1vw);
        background-color: var(--color-primary);
    }
    .content-row {
        margin-top: calc(2rem + 0.5vw);
    }
    .form {
        margin-top: calc(30px + 1vw);
        width: 100%;
        display: grid;
        grid-template-columns: repeat(3, 1fr);
        justify-content: space-between;
        align-items: center;
        grid-gap: calc(1rem + 0.5vw);
    }
    @media screen and (max-width: 1000px) {
        .form {
            grid-template-columns: repeat(2, 1fr);
        }
    }
    @media screen and (max-width: 600px) {
        .form {
            grid-template-columns: 1fr;
        }
    }
    .row {
        display: flex;
        flex-direction: column;
        width: 100%;
    }
    .row label {
        font-size: 14px;
        font-weight: 600;
        letter-spacing: 1px;
        color: var(--color-black);
        opacity: 0.95;
    }
    input,
    select,
    textarea {
        font-size: 1.3rem;
        font-weight: 700;
        display: flex;
        align-items: center;
        width: 100%;
        max-width: 500px;
        padding: 8px 14px;
        margin-top: 6px;
        display: inline-block;
        border: 1px solid #0000004a;
        border-radius: 4px;
        box-sizing: border-box;
        font-size: calc(0.8rem + 0.1vw);
        outline: none;
        color: var(--color-black);
    }
    textarea {
        max-width: none;
        min-height: 2550px;
        max-height: 500px;
    }
    .mr-1 {
        
        color: #458ff8;
    }
    .btn {
        width: 100%;
        max-width: 150px;
        height: 100%;
        display: inline-block;
        background-color: var(--color-black);
        color: var(--color-white);
        cursor: pointer;
        transition: all 0.3s linear;
        text-transform: capitalize;
        font-size: calc(0.9rem + 0.1vw);
    }
    
    .btn:hover {
        background-color: var(--color-primary);
    }
    .btn:active {
        transform: translateY(1px);
        box-shadow: 0 0 5px 0 rgba(0, 0, 0, 0.05);
    }
    .btn2 {
        width: 100%;
        max-width: 150px;
        height: 100%;
        display: inline-block;
        background-color: var(--color-black);
        color: var(--color-white);
        cursor: pointer;
        transition: all 0.3s linear;
        text-transform: capitalize;
        font-size: calc(0.9rem + 0.1vw);
    }
    .btn2:disabled {
        background-color: var(--color-gray-light);
        color: var(--color-black);
        cursor: not-allowed;
    }
    .btn2:hover {
        background-color: var(--color-primary);
    }
    .btn2:active {
        transform: translateY(1px);
        box-shadow: 0 0 5px 0 rgba(0, 0, 0, 0.05);
    }
    .text-box {
        border-radius: 0.5rem;
        border: 1px solid #e0e0e0;
        height: 100%;
        width: 100%;
        padding: 1rem;
        font-size: 0.8rem;
    }
    .success {
        color: var(--color-primary);
        padding-top: 1rem;
        padding-bottom: 1rem;
        text-align: center;
    }
    .sm:-mx-2 {
        margin-left: -0.5rem !important;
        margin-right: -0.5rem !important;
    }
    .sm:px-2 {
        padding-left: 0.5rem !important;
        padding-right: 0.5rem !important;
    }
    .xmda-hidden {
        display: none !important;
    }
`;

export default AddArticle;
