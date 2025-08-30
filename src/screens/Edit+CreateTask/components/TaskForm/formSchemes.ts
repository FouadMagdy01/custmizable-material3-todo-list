import {object, string, array, date} from 'yup';

export const todoFormScheme = object({
  title: string()
    .required('Title is required')
    .trim()
    .min(1, 'Task title is required')
    .max(255, 'Task title is too long'),
  description: string()
    .required('Task description is required')
    .trim()
    .min(1, 'Task description is required')
    .max(1000, 'Task description is too long'),
  priority: string()
    .oneOf(['low', 'medium', 'high'], 'Invalid priority')
    .default('medium'),
  dueDate: date().optional().nullable(),
  tags: array().of(string()).optional().default([]),
  category: string().optional(),
});

// Legacy support - keeping the old form schema for backward compatibility
export const legacyTodoFormScheme = object({
  title: string()
    .required('Title is required')
    .trim()
    .min(6, 'Task title should be more than 6 characters'),
  desc: string()
    .required('Task description is required')
    .trim()
    .min(6, 'Task description should be more than 6 characters'),
});