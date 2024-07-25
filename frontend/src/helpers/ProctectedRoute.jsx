import React, { useEffect } from 'react';
import toast from "react-hot-toast";
import { useNavigate } from 'react-router-dom';

const ProctectedRoute = ({ children }) => {
    const navigate = useNavigate();
    const isAuthenticated = !!localStorage.getItem("token");

    useEffect(() => {
        if (!isAuthenticated) {
            toast.error("Please Login First")
            navigate("/checkemail");
        }
    }, [isAuthenticated, navigate]);

   

    return <>{children}</>;
};

export default ProctectedRoute;
