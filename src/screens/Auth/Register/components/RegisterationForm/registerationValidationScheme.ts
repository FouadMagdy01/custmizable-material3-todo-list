import * as yup from 'yup';

export const registrationFormValidationScheme = yup.object().shape({
  firstName: yup
    .string()
    .trim()
    .min(2, 'First name must contain at least two characters')
    .required('First name is required'),

  lastName: yup
    .string()
    .trim()
    .min(2, 'Last name must contain at least two characters')
    .required('Last name is required'),

  email: yup
    .string()
    .trim()
    .email('Please enter a valid email address')
    .required('Email address is required'),

  confirmEmail: yup
    .string()
    .oneOf([yup.ref('email')], 'Email addresses must match')
    .required('Please confirm your email address'),

  password: yup
    .string()
    .min(8, 'Password must be at least 8 characters long')
    .matches(/[A-Z]/, 'Password must contain at least one uppercase letter')
    .matches(/[a-z]/, 'Password must contain at least one lowercase letter')
    .matches(/[0-9]/, 'Password must contain at least one number')
    .matches(
      /[!@#$%^&*(),.?":{}|<>]/,
      'Password must contain at least one special character',
    )
    .required('Password is required'),

  confirmPassword: yup
    .string()
    .oneOf([yup.ref('password')], 'Passwords must match')
    .required('Please confirm your password'),
});

export type RegisterationFormValues = yup.InferType<
  typeof registrationFormValidationScheme
>;
