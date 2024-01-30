import { useState, useCallback, useRef, useEffect } from 'react';

//custom hook for handling HTTP requests
export const useHttpClient = () => {
  //state variables for loading state and error handling
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState();

  //ref for storing active AbortController instances
  const activeHttpRequests = useRef([]);

  //function for sending an HTTP request
  const sendRequest = useCallback(
    async (url, method = 'GET', body = null, headers = {}) => {
      setIsLoading(true);
      const httpAbortCtrl = new AbortController();
      activeHttpRequests.current.push(httpAbortCtrl);

      try {
        //send the HTTP request using fetch and the provided options
        const response = await fetch(url, {
          method,
          body,
          headers,
          signal: httpAbortCtrl.signal
        });
        //parse the response data as JSON
        const responseData = await response.json();
        
        //remove the completed request from the activeHttpRequests ref
        activeHttpRequests.current = activeHttpRequests.current.filter(
          reqCtrl => reqCtrl !== httpAbortCtrl
        );
        
        //throw an error if the response is not ok
        if (!response.ok) {
          throw new Error(responseData.message);
        }
        
        //update loading state and return the response data
        setIsLoading(false);
        return responseData;
      } catch (err) {
        //handle and propagate the error, update loading state
        setError(err.message);
        setIsLoading(false);
        throw err;
      }
    },
    []
  );
  
  //function for clearing the error state
  const clearError = () => {
    setError(null);
  };

  //cleanup effect for aborting ongoing requests on component unmount
  useEffect(() => {
    return () => {
      activeHttpRequests.current.forEach(abortCtrl => abortCtrl.abort());
    };
  }, []);

  return { isLoading, error, sendRequest, clearError };
};
