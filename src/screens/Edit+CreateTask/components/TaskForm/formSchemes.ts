import {object, string} from 'yup';

export const todoFormScheme = object({
  title: string()
    .required('Title is required')
    .trim()
    .min(6, 'Task title should be more than 6 characters'),
  desc: string()
    .required('Task description is required')
    .trim()
    .min(6, 'Task description should be more than 6 characters'),
});
