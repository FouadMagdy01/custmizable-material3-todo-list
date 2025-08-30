import {Material3Theme} from '@pchmn/expo-material3-theme';
import {InferType} from 'yup';
import {todoFormScheme} from '../screens/Edit+CreateTask/components/TaskForm/formSchemes';
import {FirebaseFirestoreTypes} from '@react-native-firebase/firestore';

export interface UserPreferences {
  dark: boolean;
  theme: Material3Theme;
  defaultPriority?: TodoPriority;
  defaultSortBy?: TodoSortBy;
  defaultSortOrder?: SortOrder;
  autoDeleteCompleted?: boolean;
  pushNotifications?: boolean;
  emailNotifications?: boolean;
}

export type TodoPriority = 'low' | 'medium' | 'high';

export type TodoInput = InferType<typeof todoFormScheme>;

export interface TaskItem {
  id: string;
  title: string;
  description: string;
  isCompleted: boolean;
  priority: TodoPriority;
  createdAt: FirebaseFirestoreTypes.Timestamp | string;
  updatedAt: FirebaseFirestoreTypes.Timestamp | string;
  userId: string;
  dueDate?: FirebaseFirestoreTypes.Timestamp | string;
  tags?: string[];
  category?: string;
}

export interface TodoFormData {
  title: string;
  description: string;
  priority: TodoPriority;
  dueDate?: Date;
  tags?: string[];
  category?: string;
}

export interface UserProfile {
  userId: string;
  email: string;
  displayName: string;
  photoURL?: string;
  createdAt: FirebaseFirestoreTypes.Timestamp;
  updatedAt: FirebaseFirestoreTypes.Timestamp;
  preferences?: {
    defaultPriority: TodoPriority;
    autoDeleteCompleted: boolean;
    notificationsEnabled: boolean;
    sortBy: 'createdAt' | 'priority' | 'dueDate' | 'title';
    sortOrder: 'asc' | 'desc';
  };
}

export interface TodosState {
  todos: TaskItem[];
  loading: boolean;
  error: string | null;
  hasMore: boolean;
}

export type TodoFilter = 'all' | 'completed' | 'pending' | 'high' | 'medium' | 'low';
export type TodoSortBy = 'createdAt' | 'priority' | 'dueDate' | 'title';
export type SortOrder = 'asc' | 'desc';

// Legacy support for existing code
export type Todo = TodoInput;