import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import NotFound from "../assets/NotFound.avif"
import LoadingSpinner from "./loadingSpinner";

const WrongPath = () => {
    const navigate = useNavigate();

    useEffect(() => {
        toast.error("Path Doesn't Exist");
        const timer = setTimeout(() => {
            navigate("/");
        }, 3000);

        return () => clearTimeout(timer); // Cleanup timeout on component unmount
    }, [navigate]);

    return (
        <div className='py-5 flex flex-col gap-2 justify-center items-center'>
            <img src={NotFound} alt="image_not_found"/>
            <div className='flex flex-col gap-3 justify-center items-center'>
            <h1 className='font-extrabold text-4xl'>Path Doesn't Exist</h1>
            <p>Redirecting......</p>
            <LoadingSpinner/>
            </div>
            
        </div>
    );
}

export default WrongPath;
