import { createBrowserRouter } from "react-router-dom";
import HomeLayout from "../Layout/HomeLayout";
import DashboardLayout from "../Layout/DashboardLayout";

// Pages
import {
    Register,
    Login,
    Landing,
    Error,
    AllJobs,
    Stats,
    Profile,
    Admin,
    EditJob,
    AddJob,
    ManageJobs,
    Job,
    MyJobs,
    EditProfile,
    ManageUsers,
    ForgetPassword,
    ResetPassword,
    AddArticle,
    AllArticles,
    EditArticle,
    Article,
    ManageArticles,
} from "../pages";

import { JobContext } from "../context/JobContext";
import { ArticleContext  } from "../context/ArticleContext";
import CommonProtectRoute from "../components/shared/CommonProtectRoute";
import ProtectAdminRoute from "../components/shared/ProtectAdminRoute";
import RecruiterRoute from "../components/shared/RecruiterRoute";

const router = createBrowserRouter([
    {
        path: "/",
        element: <HomeLayout></HomeLayout>,
        errorElement: <Error />,
        children: [
            {
                index: true,
                element: <Landing />,
            },
            {
                path: "all-jobs",
                element: (
                    
                        <JobContext>
                            <AllJobs />
                        </JobContext>
                    
                ),
            },
            {
                path: "job/:id",
                element: (
                    
                        <JobContext>
                            <Job />
                        </JobContext>
                    
                ),
            }
            ,
            {
                path: "all-articles",
                element: (
                    
                    <ArticleContext>
                        <AllArticles/>
                        </ArticleContext>
                        
                            
                       
                    
                ),
            },
            {
                path: "article/:id",
                element: (
                    
                    <ArticleContext>
                            <Article />
                            </ArticleContext>
                    
                ),
            },

            {
                path: "register",
                element: <Register></Register>,
            },
            {
                path: "login",
                element: <Login></Login>,
            },
            {
                path: "forgot_password",
                element: <ForgetPassword></ForgetPassword>,
            },
            {
                path: "reset",
                element: <ResetPassword></ResetPassword>,
            },
            {
                path: "dashboard",
                element: (
                    <CommonProtectRoute>
                        <JobContext>
                            <DashboardLayout></DashboardLayout>
                        </JobContext>
                    </CommonProtectRoute>
                ),
                children: [
                    {
                        index: true,
                        element: <Profile />,
                    },
                    {
                        path: "edit-profile/:id",
                        element: <EditProfile />,
                    },
                    {
                        path: "stats",
                        element: (
                            <ProtectAdminRoute>
                                <Stats />
                            </ProtectAdminRoute>
                        ),
                    },
                    {
                        path: "add-jobs",
                        element: (
                            <RecruiterRoute>
                                <AddJob />
                            </RecruiterRoute>
                        ),
                    },
                    {
                        path: "manage-jobs",
                        element: (
                            <RecruiterRoute>
                                <ManageJobs />
                            </RecruiterRoute>
                        ),
                    },
                    
                    {
                        path: "add-articles",
                        element: (
                            <RecruiterRoute>
                                <AddArticle />
                            </RecruiterRoute>
                        ),
                    },
                    {
                        path: "manage-articles",
                        element: (
                            <RecruiterRoute>
                                <ManageArticles />
                            </RecruiterRoute>
                        ),
                    },
                    {
                        path: "manage-users",
                        element: (
                            <ProtectAdminRoute>
                                <ManageUsers />
                            </ProtectAdminRoute>
                        ),
                    },
                    {
                        path: "admin",
                        element: (
                            <ProtectAdminRoute>
                                <Admin />
                            </ProtectAdminRoute>
                        ),
                    },
                    {
                        path: "edit-job/:id",
                        element: (
                            <RecruiterRoute>
                                <EditJob />
                            </RecruiterRoute>
                        ),
                    },
                    {
                        path: "edit-article/:id",
                        element: (
                            <RecruiterRoute>
                                <EditArticle />
                            </RecruiterRoute>
                        ),
                    },
                    {
                        path: "my-jobs",
                        element: (
                            <CommonProtectRoute>
                                <MyJobs />
                            </CommonProtectRoute>
                        ),
                    },
                ],
            },
        ],
    },
]);

export default router;
