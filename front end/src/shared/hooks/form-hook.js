import { useCallback, useReducer } from 'react';

//reducer function for managing form state
const formReducer = (state, action) => {
  switch (action.type) {
    case 'INPUT_CHANGE':
      let formIsValid = true;
      //iterate over inputs to check validity and update overall form validity
      for (const inputId in state.inputs) {
        if (!state.inputs[inputId]) {
          continue;
        }
        if (inputId === action.inputId) {
          //update validity for the current input
          formIsValid = formIsValid && action.isValid;
        } else {
          //keep the validity for other inputs unchanged
          formIsValid = formIsValid && state.inputs[inputId].isValid;
        }
      }
      return {
        ...state,
        inputs: {
          ...state.inputs,
          [action.inputId]: { value: action.value, isValid: action.isValid }
        },
        isValid: formIsValid
      };
    case 'SET_DATA':
      //set the form inputs and overall form validity
      return {
        inputs: action.inputs,
        isValid: action.formIsValid
      };
    default:
      return state;
  }
};

//custom form handling hook
export const useForm = (initialInputs, initialFormValidity) => {
  //use the formReducer to manage form state
  const [formState, dispatch] = useReducer(formReducer, {
    inputs: initialInputs,
    isValid: initialFormValidity
  });

  //handler for updating input values and validity
  const inputHandler = useCallback((id, value, isValid) => {
    dispatch({
      type: 'INPUT_CHANGE',
      value: value,
      isValid: isValid,
      inputId: id
    });
  }, []);

  //function to set the entire form data and validity
  const setFormData = useCallback((inputData, formValidity) => {
    dispatch({
      type: 'SET_DATA',
      inputs: inputData,
      formIsValid: formValidity
    });
  }, []);

  //return the form state, input handler, and set form data function
  return [formState, inputHandler, setFormData];
};