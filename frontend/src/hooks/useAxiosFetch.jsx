import React, { useEffect } from 'react'

import axios from "axios";

const useAxiosFetch = () => {
    const axiosInstance = axios.create({
        baseURL: 'http://localhost:3000/'
    });

    // Interceptors
    useEffect(() => {
        // ajout d’un intercepteur de requête
        const requestInterceptor = axios.interceptors.request.use(function (config) {
        // faire quelque chose avant que la requête ne soit envoyée
            return config;
        }, function (error) {
            // faire quelque chose en cas d’erreur
            return Promise.reject(error);
        });

        // ajout d’un intercepteur de réponse
        const responseInterceptor = axios.interceptors.response.use(function (response) {
            // n’importe quel code de réponse HTTP dans la plage 2xx activera cette
            // fonction
            // faire quelque chose avec les données de la réponse
            return response;
        }, function (error) {
            // n’importe quel code de réponse HTTP hors de la plage 2xx activera cette
            // fonction
            // faire quelque chose avec les données de l’erreur
            return Promise.reject(error);
        });

        return () => {
            axiosInstance.interceptors.request.eject(requestInterceptor);
            axiosInstance.interceptors.response.eject(responseInterceptor);
        }
    }, [axiosInstance])

  return (
    <div>useAxiosFetch</div>
  )
}

export default useAxiosFetch