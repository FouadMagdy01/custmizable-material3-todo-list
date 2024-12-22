import {Material3Theme} from '@pchmn/expo-material3-theme';
import {InferType} from 'yup';
import {todoFormScheme} from '../screens/Edit+CreateTask/components/TaskForm/formSchemes';

export interface UserPreferences {
  dark: boolean;
  theme: Material3Theme;
}

export type Todo = InferType<typeof todoFormScheme>;
export type TaskItem = Todo & {isCompleted: boolean; id: string};
