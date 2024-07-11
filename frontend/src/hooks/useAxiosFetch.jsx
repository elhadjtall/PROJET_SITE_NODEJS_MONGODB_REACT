import { useEffect } from 'react';
import axios from 'axios';

const useAxiosFetch = () => {
    const axiosInstance = axios.create({
        baseURL: 'http://localhost:3000/'
    });

    useEffect(() => {
        const requestInterceptor = axiosInstance.interceptors.request.use(
            config => config,
            error => Promise.reject(error)
        );

        const responseInterceptor = axiosInstance.interceptors.response.use(
            response => response,
            error => Promise.reject(error)
        );

        return () => {
            axiosInstance.interceptors.request.eject(requestInterceptor);
            axiosInstance.interceptors.response.eject(responseInterceptor);
        };
    }, [axiosInstance]);

    return axiosInstance;
};

export default useAxiosFetch;
