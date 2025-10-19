import { useState, useCallback } from 'react';

const useForm = ({ initialValues, validationRules }) => {
  // useState: Manage form values and errors
  const [values, setValues] = useState(initialValues);
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({}); // Track touched fields

  // useCallback: Memoize handleChange to update values and validate
  const handleChange = useCallback(
    (e) => {
      const { name, value } = e.target;
      setValues((prev) => ({ ...prev, [name]: value })); // Spread operator
      setTouched((prev) => ({ ...prev, [name]: true })); // Mark field as touched

      if (validationRules[name]) {
        const error = validationRules[name](value);
        setErrors((prev) => ({ ...prev, [name]: error }));
      }
    },
    [validationRules]
  );

  // useCallback: Memoize handleSubmit to validate and submit
  const handleSubmit = useCallback(
    (submitFn) => async (e) => {
      e.preventDefault();
      // Run all validations
      const newErrors = {};
      Object.keys(validationRules).forEach((key) => {
        const error = validationRules[key](values[key]);
        if (error) newErrors[key] = error;
      });
      setErrors(newErrors);
      setTouched(Object.keys(validationRules).reduce((acc, key) => ({ ...acc, [key]: true }), {}));
      

      // Proceed with submission if no errors
      if (Object.keys(newErrors).length === 0) {
        try {
          await submitFn(values); // Pass values to submitFn
        } catch (error) {
          setErrors({ form: error.message || 'Submission failed' });
        }
      }
    },
    [values, validationRules]
  );

  // useCallback: Memoize resetForm to clear form
  const resetForm = useCallback(() => {
    setValues(initialValues);
    setErrors({});
    setTouched({});
  }, [initialValues]);

  // useCallback: Memoize validateField for manual validation
  const validateField = useCallback(
    (name) => {
      if (validationRules[name]) {
        const error = validationRules[name](values[name]);
        setErrors((prev) => ({ ...prev, [name]: error }));
        setTouched((prev) => ({ ...prev, [name]: true }));
        return error;
      }
      return '';
    },
    [values, validationRules]
  );

  return { values, errors, touched, handleChange, handleSubmit, resetForm, validateField };
};

export default useForm;