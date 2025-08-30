import React, {useEffect, useState, useMemo} from 'react';
import {
  View,
  StyleSheet,
  useWindowDimensions,
  FlatList,
  RefreshControl,
  Alert,
} from 'react-native';
import {
  FAB,
  Searchbar,
  Chip,
  Menu,
  IconButton,
  Text,
  Card,
  Button,
  Portal,
  Modal,
  List,
} from 'react-native-paper';
import {HomeScreenParams} from '../../navigation/types';
import EmptyList from './components/EmptyList';
import {useAppSelector, useAppDispatch} from '../../hooks/reduxHooks';
import TodoItem from './components/Task';
import ScreenWrapper from '../../components/ScreenWrapper';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {
  fetchTodos,
  deleteCompletedTodos,
  setFilter,
  setSorting,
  setSearchQuery,
  clearError,
  searchTodos,
  getTodosByFilter,
  setTodos,
} from '../../redux/tasks/tasksSlice';
import {TodoFilter, TodoSortBy, SortOrder, TaskItem} from '../../types/appTypes';
import firebaseService from '../../services/firebaseService';

const Home: React.FC<HomeScreenParams> = ({navigation}) => {
  const {width} = useWindowDimensions();
  const insets = useSafeAreaInsets();
  const dispatch = useAppDispatch();
  
  const {todos, loading, error, filter, sortBy, sortOrder, searchQuery} = useAppSelector(state => state.todos);
  const {isLoggedInt} = useAppSelector(state => state.auth);
  const prefsState = useAppSelector(state => state.preferences);
  
  const [searchVisible, setSearchVisible] = useState(false);
  const [filterMenuVisible, setFilterMenuVisible] = useState(false);
  const [sortMenuVisible, setSortMenuVisible] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  // Filter and sort todos locally for better performance
  const filteredTodos = useMemo(() => {
    let filtered = [...todos];
    
    // Apply search filter
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(todo =>
        todo.title.toLowerCase().includes(query) ||
        todo.description.toLowerCase().includes(query) ||
        todo.tags?.some(tag => tag.toLowerCase().includes(query)) ||
        todo.category?.toLowerCase().includes(query)
      );
    }
    
    // Apply status/priority filter
    switch (filter) {
      case 'completed':
        filtered = filtered.filter(todo => todo.isCompleted);
        break;
      case 'pending':
        filtered = filtered.filter(todo => !todo.isCompleted);
        break;
      case 'high':
        filtered = filtered.filter(todo => todo.priority === 'high');
        break;
      case 'medium':
        filtered = filtered.filter(todo => todo.priority === 'medium');
        break;
      case 'low':
        filtered = filtered.filter(todo => todo.priority === 'low');
        break;
      default:
        // Show all
        break;
    }
    
    // Apply sorting
    filtered.sort((a, b) => {
      let aValue: any = a[sortBy];
      let bValue: any = b[sortBy];
      
      if (sortBy === 'createdAt' || sortBy === 'dueDate') {
        // Handle Firestore timestamps, Date objects, and ISO strings
        aValue = aValue?.toDate ? aValue.toDate().getTime() : 
                aValue?.getTime?.() || (typeof aValue === 'string' ? new Date(aValue).getTime() : 0);
        bValue = bValue?.toDate ? bValue.toDate().getTime() : 
                bValue?.getTime?.() || (typeof bValue === 'string' ? new Date(bValue).getTime() : 0);
      } else if (sortBy === 'priority') {
        const priorityOrder: {[key: string]: number} = {low: 1, medium: 2, high: 3};
        aValue = priorityOrder[aValue as string] || 0;
        bValue = priorityOrder[bValue as string] || 0;
      } else if (sortBy === 'title') {
        aValue = aValue.toLowerCase();
        bValue = bValue.toLowerCase();
      }
      
      if (sortOrder === 'asc') {
        return aValue < bValue ? -1 : aValue > bValue ? 1 : 0;
      } else {
        return aValue > bValue ? -1 : aValue < bValue ? 1 : 0;
      }
    });
    
    return filtered;
  }, [todos, searchQuery, filter, sortBy, sortOrder]);

  const loadTodos = async (refresh = false) => {
    try {
      if (refresh) setRefreshing(true);
      await dispatch(fetchTodos({sortBy, sortOrder})).unwrap();
    } catch (error) {
      console.error('Error loading todos:', error);
      Alert.alert('Error', 'Failed to load todos. Please try again.');
    } finally {
      if (refresh) setRefreshing(false);
    }
  };

  const setupRealtimeListener = () => {
    if (!isLoggedInt) return;

    const unsubscribe = firebaseService.subscribeToTodos(
      (todos: TaskItem[]) => {
        // Serialize timestamps before dispatching to prevent Redux warnings
        const serializedTodos = todos.map(todo => ({
          ...todo,
          createdAt: (todo.createdAt as any)?.toDate ? (todo.createdAt as any).toDate().toISOString() : 
                    todo.createdAt instanceof Date ? todo.createdAt.toISOString() : (todo.createdAt as string),
          updatedAt: (todo.updatedAt as any)?.toDate ? (todo.updatedAt as any).toDate().toISOString() : 
                    todo.updatedAt instanceof Date ? todo.updatedAt.toISOString() : (todo.updatedAt as string),
          dueDate: (todo.dueDate as any)?.toDate ? (todo.dueDate as any).toDate().toISOString() : 
                  todo.dueDate instanceof Date ? todo.dueDate.toISOString() : (todo.dueDate as string | undefined),
        }));
        dispatch(setTodos(serializedTodos));
      },
      sortBy,
      sortOrder
    );

    return unsubscribe;
  };

  useEffect(() => {
    if (isLoggedInt) {
      loadTodos();
      const unsubscribe = setupRealtimeListener();
      return () => unsubscribe?.();
    }
  }, [isLoggedInt, sortBy, sortOrder]);

  useEffect(() => {
    if (error) {
      Alert.alert('Error', error, [
        {text: 'OK', onPress: () => dispatch(clearError())},
      ]);
    }
  }, [error, dispatch]);

  const handleSearch = (query: string) => {
    dispatch(setSearchQuery(query));
  };

  const handleFilterChange = async (newFilter: TodoFilter) => {
    dispatch(setFilter(newFilter));
    setFilterMenuVisible(false);
    
    if (newFilter !== 'all') {
      try {
        await dispatch(getTodosByFilter(newFilter)).unwrap();
      } catch (error) {
        console.error('Error filtering todos:', error);
      }
    } else {
      await loadTodos();
    }
  };

  const handleSortChange = async (newSortBy: TodoSortBy, newSortOrder: SortOrder) => {
    dispatch(setSorting({sortBy: newSortBy, sortOrder: newSortOrder}));
    setSortMenuVisible(false);
    await loadTodos();
  };

  const handleDeleteCompleted = () => {
    Alert.alert(
      'Delete Completed Todos',
      'Are you sure you want to delete all completed todos? This action cannot be undone.',
      [
        {text: 'Cancel', style: 'cancel'},
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              await dispatch(deleteCompletedTodos()).unwrap();
              Alert.alert('Success', 'Completed todos deleted successfully!');
            } catch (error) {
              console.error('Error deleting completed todos:', error);
              Alert.alert('Error', 'Failed to delete completed todos. Please try again.');
            }
          },
        },
      ]
    );
  };

  const filterOptions: {key: TodoFilter; label: string; icon: string}[] = [
    {key: 'all', label: 'All', icon: 'format-list-bulleted'},
    {key: 'pending', label: 'Pending', icon: 'clock-outline'},
    {key: 'completed', label: 'Completed', icon: 'check-circle'},
    {key: 'high', label: 'High Priority', icon: 'flag-variant'},
    {key: 'medium', label: 'Medium Priority', icon: 'flag'},
    {key: 'low', label: 'Low Priority', icon: 'flag-outline'},
  ];

  const sortOptions: {key: TodoSortBy; label: string; icon: string}[] = [
    {key: 'createdAt', label: 'Date Created', icon: 'calendar-plus'},
    {key: 'dueDate', label: 'Due Date', icon: 'calendar-clock'},
    {key: 'priority', label: 'Priority', icon: 'flag'},
    {key: 'title', label: 'Title', icon: 'format-title'},
  ];

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return '#f44336';
      case 'medium': return '#ff9800';
      case 'low': return '#4caf50';
      default: return '#757575';
    }
  };

  const completedCount = todos.filter(todo => todo.isCompleted).length;

  return (
    <ScreenWrapper withScrollView={false} style={styles.container}>
      {/* Header with search and filters */}
      <View style={[styles.header, {paddingTop: insets.top}]}>
        <View style={styles.headerContent}>
          <Text variant="headlineMedium" style={styles.title}>
            My Todos
          </Text>
          
          <View style={styles.headerActions}>
            <IconButton
              icon="magnify"
              onPress={() => setSearchVisible(!searchVisible)}
              iconColor={prefsState.dark ? prefsState.theme.dark.onSurface : prefsState.theme.light.onSurface}
            />
            
            <Menu
              visible={filterMenuVisible}
              onDismiss={() => setFilterMenuVisible(false)}
              anchor={
                <IconButton
                  icon="filter-variant"
                  onPress={() => setFilterMenuVisible(true)}
                  iconColor={filter !== 'all' ? 
                    (prefsState.dark ? prefsState.theme.dark.primary : prefsState.theme.light.primary) : 
                    (prefsState.dark ? prefsState.theme.dark.onSurface : prefsState.theme.light.onSurface)
                  }
                />
              }>
              {filterOptions.map(option => (
                <Menu.Item
                  key={option.key}
                  onPress={() => handleFilterChange(option.key)}
                  title={option.label}
                  leadingIcon={option.icon}
                  trailingIcon={filter === option.key ? 'check' : undefined}
                />
              ))}
            </Menu>
            
            <Menu
              visible={sortMenuVisible}
              onDismiss={() => setSortMenuVisible(false)}
              anchor={
                <IconButton
                  icon="sort"
                  onPress={() => setSortMenuVisible(true)}
                  iconColor={prefsState.dark ? prefsState.theme.dark.onSurface : prefsState.theme.light.onSurface}
                />
              }>
              {sortOptions.map(option => (
                <View key={option.key}>
                  <Menu.Item
                    onPress={() => handleSortChange(option.key, 'desc')}
                    title={`${option.label} (Desc)`}
                    leadingIcon={option.icon}
                    trailingIcon={sortBy === option.key && sortOrder === 'desc' ? 'check' : undefined}
                  />
                  <Menu.Item
                    onPress={() => handleSortChange(option.key, 'asc')}
                    title={`${option.label} (Asc)`}
                    leadingIcon={option.icon}
                    trailingIcon={sortBy === option.key && sortOrder === 'asc' ? 'check' : undefined}
                  />
                </View>
              ))}
            </Menu>
          </View>
        </View>

        {/* Search bar */}
        {searchVisible && (
          <Searchbar
            placeholder="Search todos..."
            onChangeText={handleSearch}
            value={searchQuery}
            style={styles.searchbar}
            icon="magnify"
            onIconPress={() => {}}
            onClearIconPress={() => handleSearch('')}
          />
        )}

        {/* Active filters */}
        <View style={styles.filtersContainer}>
          {filter !== 'all' && (
            <Chip
              icon={filterOptions.find(f => f.key === filter)?.icon}
              onClose={() => handleFilterChange('all')}
              style={styles.filterChip}>
              {filterOptions.find(f => f.key === filter)?.label}
            </Chip>
          )}
          
          {searchQuery !== '' && (
            <Chip
              icon="magnify"
              onClose={() => handleSearch('')}
              style={styles.filterChip}>
              "{searchQuery}"
            </Chip>
          )}
        </View>

        {/* Stats */}
        <View style={styles.statsContainer}>
          <Text variant="bodyMedium" style={styles.statsText}>
            {filteredTodos.length} todo{filteredTodos.length !== 1 ? 's' : ''}
            {completedCount > 0 && (
              <Text> • {completedCount} completed</Text>
            )}
          </Text>
          
          {completedCount > 0 && (
            <Button
              mode="text"
              compact
              onPress={handleDeleteCompleted}
              textColor={prefsState.dark ? prefsState.theme.dark.error : prefsState.theme.light.error}>
              Clear Completed
            </Button>
          )}
        </View>
      </View>

      {/* Todo List */}
      <FlatList
        style={styles.todoList}
        contentContainerStyle={[
          styles.todoListContent,
          {paddingBottom: insets.bottom + 100}
        ]}
        data={filteredTodos}
        keyExtractor={(item) => item.id}
        renderItem={({item, index}) => (
          <TodoItem
            style={[styles.todoItem, {width: width * 0.92}]}
            todo={item}
            onEdit={() => navigation.navigate('Task', {todo: item, mode: 'edit'})}
          />
        )}
        ListEmptyComponent={() => (
          <EmptyList 
            filter={filter}
            hasSearch={searchQuery !== ''}
            onClearFilters={() => {
              handleFilterChange('all');
              handleSearch('');
            }}
          />
        )}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={() => loadTodos(true)}
            colors={[prefsState.dark ? prefsState.theme.dark.primary : prefsState.theme.light.primary]}
          />
        }
        showsVerticalScrollIndicator={false}
      />

      {/* Floating Action Button */}
      <FAB
        icon="plus"
        onPress={() => navigation.navigate('Task')}
        visible={true}
        size="medium"
        variant="primary"
        style={styles.fab}
      />
    </ScreenWrapper>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    paddingHorizontal: 16,
    paddingBottom: 8,
    elevation: 2,
    shadowOffset: {width: 0, height: 1},
    shadowOpacity: 0.1,
    shadowRadius: 3,
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  title: {
    fontWeight: 'bold',
    flex: 1,
  },
  headerActions: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  searchbar: {
    marginBottom: 12,
    elevation: 0,
  },
  filtersContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 8,
    gap: 8,
  },
  filterChip: {
    marginBottom: 4,
  },
  statsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 8,
  },
  statsText: {
    opacity: 0.7,
  },
  todoList: {
    flex: 1,
  },
  todoListContent: {
    flexGrow: 1,
    alignItems: 'center',
    paddingTop: 8,
  },
  todoItem: {
    marginBottom: 12,
  },
  fab: {
    position: 'absolute',
    bottom: 24,
    right: 24,
  },
});

export default Home;