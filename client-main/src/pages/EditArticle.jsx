import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import styled from "styled-components";
import axios from "axios";
import { useForm } from "react-hook-form";
import Swal from "sweetalert2";
import { CiSquarePlus } from "react-icons/ci";
import { MdClose } from "react-icons/md"; 
import { getSingleHandler } from "../utils/FetchHandlers";
import { TagsInput } from "react-tag-input-component";
import LoadingComTwo from "../components/shared/LoadingComTwo";
import { useQuery, useMutation, QueryClient } from "@tanstack/react-query";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";

const queryClient = new QueryClient();

const EditArticle = () => {
    const { id } = useParams();
    const { isPending, isError, data: article, error } = useQuery({
        queryKey: ["updateArticle"],
        queryFn: () =>
            getSingleHandler(`http://localhost:3000/api/v1/articles/${id}`),
    });

    const { register, handleSubmit, reset, formState: { errors } } = useForm();

    const [services, setServices] = useState([]);
    const [community, setCommunity] = useState([]);
    const [references, setReferences] = useState([]);
    const [selectedFiles, setSelectedFiles] = useState([]);
    const [description, setDescription] = useState(""); 

    useEffect(() => {
        reset();
        if (article) {
            setServices(article?.services || []);
            setCommunity(article?.community || []);
            setReferences(article?.references || []);
            setDescription(article?.description || ""); 
        }
        
    }, [article]);

    const updateArticleMutation = useMutation({
        mutationFn: async (formData) => {
            const response = await axios.put(
                `http://localhost:3000/api/v1/articles/${id}`,
                formData,
                {
                    headers: {
                        "Content-Type": "multipart/form-data",
                    },
                }
            );
            return response.data;
        },
        onSuccess: (data) => {
            queryClient.invalidateQueries({ queryKey: ["updateArticle"] });
            Swal.fire({
                icon: "success",
                title: "Article Updated",
                text: data?.message,
            });
        reset();
        },
        onError: (error) => {
            console.log(error);
            Swal.fire({
                icon: "error",
                title: "Oops...",
                text: error?.message,
            });
        },
    });

    const onSubmit = async (data) => {
        const formData = new FormData();
        formData.append("titre", data.titre);
        formData.append("description", description);
        formData.append("isPublished", data.isPublished);
        formData.append("services", services.join(","));
        formData.append("community", community.join(","));
        formData.append("references", references.join(","));

        selectedFiles.forEach((file) => {
            formData.append("images", file);
        });

        updateArticleMutation.mutate(formData);
    };

    const handleFileChange = (event) => {
        setSelectedFiles(Array.from(event.target.files));
    };

    const appendService = () => {
        setServices([...services, ""]);
    };

    const removeService = (index) => {
        const updatedServices = [...services];
        updatedServices.splice(index, 1);
        setServices(updatedServices);
    };

    const appendCommunity = () => {
        setCommunity([...community, ""]);
    };

    const removeCommunity = (index) => {
        const updatedCommunity = [...community];
        updatedCommunity.splice(index, 1);
        setCommunity(updatedCommunity);
    };

    const appendReference = () => {
        setReferences([...references, ""]);
    };

    const removeReference = (index) => {
        const updatedReferences = [...references];
        updatedReferences.splice(index, 1);
        setReferences(updatedReferences);
    };

    if (isPending) {
        return <LoadingComTwo />;
    }
    if (isError) {
        return <h2 className="">{error?.message}</h2>;
    }

    return (
        <Wrapper>
            <div className="">
                <div className="title-row">
                    Update Article
                    <CiSquarePlus className="ml-1 text-xl md:text-2xl" />
                </div>
                <div className="content-row">
                    <form autoComplete="off" onSubmit={handleSubmit(onSubmit)} encType="multipart/form-data">
                        <div className="form-1">
                            {/* Titre */}
                            <div className="row">
                                <label htmlFor="titre">Titre</label>
                                <input
                                    type="text"
                                    id="titre"
                                    name="titre"
                                    placeholder="Article Titre"
                                    defaultValue={article?.titre}
                                    {...register("titre", {
                                        required: {
                                            value: true,
                                            message: "Titre is required",
                                        },
                                        maxLength: {
                                            value: 100,
                                            message: "Too long (max 100char)",
                                        },
                                        minLength: {
                                            value: 5,
                                            message: "Too short (max 5char)",
                                        },
                                    })}
                                />
                                {errors?.titre && (
                                    <span className="text-[10px] font-semibold text-red-600 mt-1 pl-1 tracking-wider">
                                        {errors?.titre?.message}
                                    </span>
                                )}
                                  {/* Published */}
                            <div className="row">
                                <label htmlFor="isPublished">Publish</label>
                                <select
                                    defaultValue={article?.isPublished}
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
                            </div>
                          
                            
                        {/* Description */}
                        <div className="row">
                            <label htmlFor="description">Description</label>
                            <ReactQuill
                                className="textarea"
                                defaultValue={description}
                                value={description}
                                onChange={setDescription}
                                modules={{
                                    toolbar: [
                                        [{ 'header': '1' }, { 'header': '2' }, { 'font': [] }],
                                        [{ size: [] }],
                                        ['bold', 'italic', 'underline', 'strike', 'blockquote'],
                                        [{ 'list': 'ordered' }, { 'list': 'bullet' }, { 'indent': '-1' }, { 'indent': '+1' }],
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
                            <div className="form">

                            {/* Services */}
                            <div className="row">
                                <label htmlFor="services">Services</label>
                                {services.map((service, index) => (
                                    <div key={`service-${index}`} className="flex items-center">
                                        <input
                                            type="text"
                                            {...register(`services.${index}`, { required: "This field is required" })}
                                            placeholder="Add service"
                                            className="flex-1"
                                            value={service}
                                            onChange={(e) => {
                                                const updatedServices = [...services];
                                                updatedServices[index] = e.target.value;
                                                setServices(updatedServices);
                                            }}
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
                                <button type="button" onClick={appendService} className="flex items-center">
                                    <CiSquarePlus className="mr-1" /> Add Service
                                </button>
                            </div>

                            {/* Community */}
                            <div className="row">
                                <label htmlFor="community">Community</label>
                                {community.map((item, index) => (
                                    <div key={`community-${index}`} className="flex items-center">
                                        <input
                                            type="text"
                                            {...register(`community.${index}`, { required: "This field is required" })}
                                            placeholder="Add community"
                                            className="flex-1"
                                            value={item}
                                            onChange={(e) => {
                                                const updatedCommunity = [...community];
                                                updatedCommunity[index] = e.target.value;
                                                setCommunity(updatedCommunity);
                                            }}
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
                                <button type="button" onClick={appendCommunity} className="flex items-center">
                                    <CiSquarePlus className="mr-1" /> Add Community
                                </button>
                            </div>

                            {/* References */}
                            <div className="row">
                                <label htmlFor="references">References</label>
                                {references.map((item, index) => (
                                    <div key={`reference-${index}`} className="flex items-center">
                                        <input
                                            type="text"
                                            {...register(`references.${index}`, { required: "This field is required" })}
                                            placeholder="Add reference"
                                            className="flex-1"
                                            value={item}
                                            onChange={(e) => {
                                                const updatedReferences = [...references];
                                                updatedReferences[index] = e.target.value;
                                                setReferences(updatedReferences);
                                            }}
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
                                <button type="button" onClick={appendReference} className="flex items-center">
                                    <CiSquarePlus className="mr-1" /> Add Reference
                                </button>
                            </div>
                        </div>

                            {/* Images */}
                            <div className="row mt-5">
                                <label htmlFor="images">Images</label>
                                <input
                                    type="file"
                                    id="images"
                                    name="images"
                                    accept="image/*"
                                    multiple
                                    onChange={handleFileChange}
                                />
                                {errors?.images && (
                                    <span className="text-[10px] font-semibold text-red-600 mt-1 pl-1 tracking-wider">
                                        {errors?.images?.message}
                                    </span>
                                )}
                                  {/* Display current images */}
                                    {article?.images && (
                                    <div className="row mt-5">
                                        <label>Current Images</label>
                                        <div className="current-images">
                                            {article.images.map((imageUrl, index) => (
                                                <img
                                                    key={index}
                                                    src={imageUrl}
                                                    alt={`Image ${index}`}
                                                    className="current-image"
                                                />
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </div>

                        <div className="mt-4 ">
                            <button
                                type="submit"
                                className=" font-semibold bg-black text-white py-3 px-7 hover:shadow-lg rounded-md border-none btn"
                            >
                                Update
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </Wrapper>
    );
};


export default EditArticle;


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
    .form-1 {
        margin-top: calc(30px + 1vw);
        width: 100%;
        display: grid;
        grid-template-columns: repeat(2, 1fr);
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
        min-height: 130px;
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
    .py-3 {
        padding-top: 0.55rem;
        padding-bottom: 0.55rem;
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

    .current-images {
        display: flex;
        flex-wrap: wrap;
        gap: 10px;
    }

    .current-image {
        max-width: 100px;
        height: auto;
    }
`;
