import firestore, {FirebaseFirestoreTypes} from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth';
import {TaskItem, TodoFormData, UserProfile, TodoPriority, TodoSortBy, SortOrder} from '../types/appTypes';

class FirebaseService {
  private db = firestore();
  
  // Get current user ID
  private getCurrentUserId(): string {
    const user = auth().currentUser;
    if (!user) {
      throw new Error('User not authenticated');
    }
    return user.uid;
  }

  // User Profile Operations
  async createUserProfile(userData: Partial<UserProfile>): Promise<void> {
    const userId = this.getCurrentUserId();
    const user = auth().currentUser;
    
    if (!user) {
      throw new Error('No authenticated user found');
    }

    const profileData: UserProfile = {
      userId,
      email: user.email || '',
      displayName: user.displayName || '',
      photoURL: user.photoURL || undefined,
      createdAt: firestore.Timestamp.now(),
      updatedAt: firestore.Timestamp.now(),
      preferences: {
        defaultPriority: 'medium',
        autoDeleteCompleted: false,
        notificationsEnabled: true,
        sortBy: 'createdAt',
        sortOrder: 'desc',
      },
      ...userData,
    };

    await this.db.collection('users').doc(userId).collection('profile').doc('data').set(profileData);
  }

  async getUserProfile(): Promise<UserProfile | null> {
    const userId = this.getCurrentUserId();
    const doc = await this.db.collection('users').doc(userId).collection('profile').doc('data').get();
    
    if (doc.exists) {
      return doc.data() as UserProfile;
    }
    
    return null;
  }

  async updateUserProfile(updates: Partial<UserProfile>): Promise<void> {
    const userId = this.getCurrentUserId();
    await this.db.collection('users').doc(userId).collection('profile').doc('data').update({
      ...updates,
      updatedAt: firestore.Timestamp.now(),
    });
  }

  // Todo CRUD Operations
  async createTodo(todoData: TodoFormData): Promise<TaskItem> {
    const userId = this.getCurrentUserId();
    const todoRef = this.db.collection('users').doc(userId).collection('todos').doc();
    
    const todo: TaskItem = {
      id: todoRef.id,
      title: todoData.title,
      description: todoData.description,
      isCompleted: false,
      priority: todoData.priority,
      createdAt: firestore.Timestamp.now(),
      updatedAt: firestore.Timestamp.now(),
      userId,
      dueDate: todoData.dueDate ? firestore.Timestamp.fromDate(todoData.dueDate) : undefined,
      tags: todoData.tags || [],
      category: todoData.category,
    };

    await todoRef.set(todo);
    return todo;
  }

  async getTodos(
    limit: number = 20,
    lastVisible?: FirebaseFirestoreTypes.QueryDocumentSnapshot,
    sortBy: TodoSortBy = 'createdAt',
    sortOrder: SortOrder = 'desc'
  ): Promise<{todos: TaskItem[], lastVisible?: FirebaseFirestoreTypes.QueryDocumentSnapshot}> {
    const userId = this.getCurrentUserId();
    let query = this.db
      .collection('users')
      .doc(userId)
      .collection('todos')
      .orderBy(sortBy, sortOrder)
      .limit(limit);

    if (lastVisible) {
      query = query.startAfter(lastVisible);
    }

    const snapshot = await query.get();
    const todos: TaskItem[] = [];
    
    snapshot.docs.forEach(doc => {
      todos.push(doc.data() as TaskItem);
    });

    return {
      todos,
      lastVisible: snapshot.docs[snapshot.docs.length - 1],
    };
  }

  async getTodoById(todoId: string): Promise<TaskItem | null> {
    const userId = this.getCurrentUserId();
    const doc = await this.db.collection('users').doc(userId).collection('todos').doc(todoId).get();
    
    if (doc.exists) {
      return doc.data() as TaskItem;
    }
    
    return null;
  }

  async updateTodo(todoId: string, updates: Partial<TaskItem>): Promise<void> {
    const userId = this.getCurrentUserId();
    await this.db.collection('users').doc(userId).collection('todos').doc(todoId).update({
      ...updates,
      updatedAt: firestore.Timestamp.now(),
    });
  }

  async toggleTodoCompletion(todoId: string): Promise<void> {
    const userId = this.getCurrentUserId();
    const todoRef = this.db.collection('users').doc(userId).collection('todos').doc(todoId);
    
    await this.db.runTransaction(async (transaction) => {
      const doc = await transaction.get(todoRef);
      if (!doc.exists) {
        throw new Error('Todo does not exist');
      }
      
      const todo = doc.data() as TaskItem;
      transaction.update(todoRef, {
        isCompleted: !todo.isCompleted,
        updatedAt: firestore.Timestamp.now(),
      });
    });
  }

  async deleteTodo(todoId: string): Promise<void> {
    const userId = this.getCurrentUserId();
    await this.db.collection('users').doc(userId).collection('todos').doc(todoId).delete();
  }

  async deleteCompletedTodos(): Promise<void> {
    const userId = this.getCurrentUserId();
    const completedTodos = await this.db
      .collection('users')
      .doc(userId)
      .collection('todos')
      .where('isCompleted', '==', true)
      .get();

    const batch = this.db.batch();
    completedTodos.docs.forEach(doc => {
      batch.delete(doc.ref);
    });

    await batch.commit();
  }

  // Real-time listeners
  subscribeToTodos(
    callback: (todos: TaskItem[]) => void,
    sortBy: TodoSortBy = 'createdAt',
    sortOrder: SortOrder = 'desc'
  ): () => void {
    const userId = this.getCurrentUserId();
    
    return this.db
      .collection('users')
      .doc(userId)
      .collection('todos')
      .orderBy(sortBy, sortOrder)
      .onSnapshot(
        (snapshot) => {
          const todos: TaskItem[] = [];
          snapshot.docs.forEach(doc => {
            todos.push(doc.data() as TaskItem);
          });
          callback(todos);
        },
        (error) => {
          console.error('Error listening to todos:', error);
        }
      );
  }

  subscribeToUserProfile(callback: (profile: UserProfile | null) => void): () => void {
    const userId = this.getCurrentUserId();
    
    return this.db
      .collection('users')
      .doc(userId)
      .collection('profile')
      .doc('data')
      .onSnapshot(
        (doc) => {
          if (doc.exists) {
            callback(doc.data() as UserProfile);
          } else {
            callback(null);
          }
        },
        (error) => {
          console.error('Error listening to user profile:', error);
        }
      );
  }

  // Batch operations
  async batchUpdateTodos(updates: Array<{id: string; data: Partial<TaskItem>}>): Promise<void> {
    const userId = this.getCurrentUserId();
    const batch = this.db.batch();
    
    updates.forEach(({id, data}) => {
      const todoRef = this.db.collection('users').doc(userId).collection('todos').doc(id);
      batch.update(todoRef, {
        ...data,
        updatedAt: firestore.Timestamp.now(),
      });
    });

    await batch.commit();
  }

  // Search and filter operations
  async searchTodos(searchTerm: string): Promise<TaskItem[]> {
    const userId = this.getCurrentUserId();
    
    // Firestore doesn't support full-text search natively, 
    // so we'll fetch all todos and filter client-side
    const snapshot = await this.db
      .collection('users')
      .doc(userId)
      .collection('todos')
      .get();
    
    const todos: TaskItem[] = [];
    const searchTermLower = searchTerm.toLowerCase();
    
    snapshot.docs.forEach(doc => {
      const todo = doc.data() as TaskItem;
      if (
        todo.title.toLowerCase().includes(searchTermLower) ||
        todo.description.toLowerCase().includes(searchTermLower) ||
        todo.tags?.some(tag => tag.toLowerCase().includes(searchTermLower)) ||
        todo.category?.toLowerCase().includes(searchTermLower)
      ) {
        todos.push(todo);
      }
    });

    return todos;
  }

  async getTodosByPriority(priority: TodoPriority): Promise<TaskItem[]> {
    const userId = this.getCurrentUserId();
    const snapshot = await this.db
      .collection('users')
      .doc(userId)
      .collection('todos')
      .where('priority', '==', priority)
      .orderBy('createdAt', 'desc')
      .get();
    
    const todos: TaskItem[] = [];
    snapshot.docs.forEach(doc => {
      todos.push(doc.data() as TaskItem);
    });

    return todos;
  }

  async getTodosByCompletion(isCompleted: boolean): Promise<TaskItem[]> {
    const userId = this.getCurrentUserId();
    const snapshot = await this.db
      .collection('users')
      .doc(userId)
      .collection('todos')
      .where('isCompleted', '==', isCompleted)
      .orderBy('createdAt', 'desc')
      .get();
    
    const todos: TaskItem[] = [];
    snapshot.docs.forEach(doc => {
      todos.push(doc.data() as TaskItem);
    });

    return todos;
  }

  // Statistics
  async getTodoStats(): Promise<{
    total: number;
    completed: number;
    pending: number;
    highPriority: number;
    mediumPriority: number;
    lowPriority: number;
  }> {
    const userId = this.getCurrentUserId();
    const snapshot = await this.db
      .collection('users')
      .doc(userId)
      .collection('todos')
      .get();
    
    const stats = {
      total: 0,
      completed: 0,
      pending: 0,
      highPriority: 0,
      mediumPriority: 0,
      lowPriority: 0,
    };

    snapshot.docs.forEach(doc => {
      const todo = doc.data() as TaskItem;
      stats.total++;
      
      if (todo.isCompleted) {
        stats.completed++;
      } else {
        stats.pending++;
      }
      
      switch (todo.priority) {
        case 'high':
          stats.highPriority++;
          break;
        case 'medium':
          stats.mediumPriority++;
          break;
        case 'low':
          stats.lowPriority++;
          break;
      }
    });

    return stats;
  }
}

export default new FirebaseService();