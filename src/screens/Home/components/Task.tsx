import React, {useState} from 'react';
import {View, StyleSheet, Alert, Pressable} from 'react-native';
import {
  Card,
  Checkbox,
  Text,
  IconButton,
  Chip,
  Menu,
  Badge,
  Surface,
} from 'react-native-paper';
import {TaskItem} from '../../../types/appTypes';
import {StyleProp, ViewStyle} from 'react-native';
import {useAppDispatch, useAppSelector} from '../../../hooks/reduxHooks';
import {toggleTodoCompletion, deleteTodo} from '../../../redux/tasks/tasksSlice';

type Props = {
  todo: TaskItem;
  style?: StyleProp<ViewStyle>;
  onEdit?: () => void;
};

const TodoItem: React.FC<Props> = ({todo, style, onEdit}) => {
  const dispatch = useAppDispatch();
  const prefsState = useAppSelector(state => state.preferences);
  const [menuVisible, setMenuVisible] = useState(false);

  const handleToggleCompletion = async () => {
    try {
      await dispatch(toggleTodoCompletion(todo.id)).unwrap();
    } catch (error) {
      console.error('Error toggling todo completion:', error);
      Alert.alert('Error', 'Failed to update todo. Please try again.');
    }
  };

  const handleDelete = () => {
    Alert.alert(
      'Delete Todo',
      'Are you sure you want to delete this todo? This action cannot be undone.',
      [
        {text: 'Cancel', style: 'cancel'},
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              await dispatch(deleteTodo(todo.id)).unwrap();
            } catch (error) {
              console.error('Error deleting todo:', error);
              Alert.alert('Error', 'Failed to delete todo. Please try again.');
            }
          },
        },
      ]
    );
  };

  const getPriorityColor = (priority: string) => {
    const colors = {
      high: prefsState.dark ? '#f44336' : '#d32f2f',
      medium: prefsState.dark ? '#ff9800' : '#f57c00',
      low: prefsState.dark ? '#4caf50' : '#388e3c',
    };
    return colors[priority as keyof typeof colors] || '#757575';
  };

  const getPriorityIcon = (priority: string) => {
    const icons = {
      high: 'flag-variant',
      medium: 'flag',
      low: 'flag-outline',
    };
    return icons[priority as keyof typeof icons] || 'flag';
  };

  const formatDate = (date: any) => {
    if (!date) return null;
    const dateObj = (date as any)?.toDate ? (date as any).toDate() : 
                   date instanceof Date ? date : 
                   typeof date === 'string' ? new Date(date) : new Date(date);
    return dateObj.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: dateObj.getFullYear() !== new Date().getFullYear() ? 'numeric' : undefined,
    });
  };

  const isOverdue = () => {
    if (!todo.dueDate || todo.isCompleted) return false;
    const today = new Date();
    const dueDate = (todo.dueDate as any)?.toDate ? (todo.dueDate as any).toDate() : 
                   todo.dueDate instanceof Date ? todo.dueDate : 
                   typeof todo.dueDate === 'string' ? new Date(todo.dueDate) : new Date();
    return dueDate.getTime() < today.getTime();
  };

  const isDueSoon = () => {
    if (!todo.dueDate || todo.isCompleted) return false;
    const today = new Date();
    const dueDate = (todo.dueDate as any)?.toDate ? (todo.dueDate as any).toDate() : 
                   todo.dueDate instanceof Date ? todo.dueDate : 
                   typeof todo.dueDate === 'string' ? new Date(todo.dueDate) : new Date();
    const timeDiff = dueDate.getTime() - today.getTime();
    const daysDiff = Math.ceil(timeDiff / (1000 * 3600 * 24));
    return daysDiff <= 3 && daysDiff >= 0;
  };

  const cardBackgroundColor = todo.isCompleted
    ? (prefsState.dark ? prefsState.theme.dark.surfaceVariant : prefsState.theme.light.surfaceVariant)
    : (prefsState.dark ? prefsState.theme.dark.surface : prefsState.theme.light.surface);

  const textColor = todo.isCompleted
    ? (prefsState.dark ? prefsState.theme.dark.outline : prefsState.theme.light.outline)
    : (prefsState.dark ? prefsState.theme.dark.onSurface : prefsState.theme.light.onSurface);

  return (
    <Card
      style={[
        styles.card,
        style,
        {
          backgroundColor: cardBackgroundColor,
          opacity: todo.isCompleted ? 0.7 : 1,
        },
      ]}
      elevation={todo.isCompleted ? 1 : 3}>
      <Pressable onPress={onEdit} style={styles.pressable}>
        <Card.Content style={styles.cardContent}>
          {/* Header row with checkbox, priority, and menu */}
          <View style={styles.headerRow}>
            <Checkbox
              status={todo.isCompleted ? 'checked' : 'unchecked'}
              onPress={handleToggleCompletion}
              uncheckedColor={getPriorityColor(todo.priority)}
            />
            
            <View style={styles.headerInfo}>
              <View style={styles.priorityContainer}>
                <Chip
                  icon={getPriorityIcon(todo.priority)}
                  compact
                  mode="outlined"
                  style={[
                    styles.priorityChip,
                    {
                      backgroundColor: getPriorityColor(todo.priority) + '15',
                      borderColor: getPriorityColor(todo.priority) + '40',
                    }
                  ]}
                  textStyle={{
                    color: getPriorityColor(todo.priority),
                    fontSize: 11,
                    fontWeight: '600',
                    lineHeight: 16,
                  }}>
                  {todo.priority.toUpperCase()}
                </Chip>
                
                {isOverdue() && (
                  <Badge
                    style={[styles.badge, styles.overdueBadge]}
                    size={16}>
                    !
                  </Badge>
                )}
                
                {isDueSoon() && !isOverdue() && (
                  <Badge
                    style={[styles.badge, styles.dueSoonBadge]}
                    size={16}>
                    ⚠
                  </Badge>
                )}
              </View>
            </View>

            <Menu
              visible={menuVisible}
              onDismiss={() => setMenuVisible(false)}
              anchor={
                <IconButton
                  icon="dots-vertical"
                  size={20}
                  onPress={() => setMenuVisible(true)}
                />
              }>
              <Menu.Item
                onPress={() => {
                  setMenuVisible(false);
                  onEdit?.();
                }}
                title="Edit"
                leadingIcon="pencil"
              />
              <Menu.Item
                onPress={() => {
                  setMenuVisible(false);
                  handleToggleCompletion();
                }}
                title={todo.isCompleted ? 'Mark as Pending' : 'Mark as Complete'}
                leadingIcon={todo.isCompleted ? 'close-circle' : 'check-circle'}
              />
              <Menu.Item
                onPress={() => {
                  setMenuVisible(false);
                  handleDelete();
                }}
                title="Delete"
                leadingIcon="delete"
                titleStyle={{color: prefsState.dark ? prefsState.theme.dark.error : prefsState.theme.light.error}}
              />
            </Menu>
          </View>

          {/* Title */}
          <Text
            variant="titleMedium"
            style={[
              styles.title,
              {
                color: textColor,
                textDecorationLine: todo.isCompleted ? 'line-through' : 'none',
              },
            ]}
            numberOfLines={2}>
            {todo.title}
          </Text>

          {/* Description */}
          <Text
            variant="bodyMedium"
            style={[
              styles.description,
              {
                color: textColor,
                opacity: todo.isCompleted ? 0.6 : 0.8,
              },
            ]}
            numberOfLines={3}>
            {todo.description}
          </Text>

          {/* Footer with tags, category, and due date */}
          <View style={styles.footerRow}>
            <View style={styles.tagsContainer}>
              {todo.category && (
                <Chip
                  icon="folder"
                  compact
                  mode="outlined"
                  style={[
                    styles.categoryChip,
                    {
                      backgroundColor: prefsState.dark 
                        ? prefsState.theme.dark.secondaryContainer 
                        : prefsState.theme.light.secondaryContainer,
                      borderColor: prefsState.dark
                        ? prefsState.theme.dark.outline
                        : prefsState.theme.light.outline,
                    }
                  ]}
                  textStyle={[
                    styles.chipText,
                    {
                      color: prefsState.dark 
                        ? prefsState.theme.dark.onSecondaryContainer 
                        : prefsState.theme.light.onSecondaryContainer,
                    }
                  ]}>
                  {todo.category}
                </Chip>
              )}
              
              {todo.tags?.slice(0, 2).map((tag, index) => (
                <Chip
                  key={index}
                  icon="tag"
                  compact
                  mode="outlined"
                  style={[
                    styles.tagChip,
                    {
                      backgroundColor: prefsState.dark 
                        ? prefsState.theme.dark.tertiaryContainer 
                        : prefsState.theme.light.tertiaryContainer,
                      borderColor: prefsState.dark
                        ? prefsState.theme.dark.outline
                        : prefsState.theme.light.outline,
                    }
                  ]}
                  textStyle={[
                    styles.chipText,
                    {
                      color: prefsState.dark 
                        ? prefsState.theme.dark.onTertiaryContainer 
                        : prefsState.theme.light.onTertiaryContainer,
                    }
                  ]}>
                  {tag}
                </Chip>
              ))}
              
              {todo.tags && todo.tags.length > 2 && (
                <Text style={styles.moreTagsText}>
                  +{todo.tags.length - 2} more
                </Text>
              )}
            </View>

            {todo.dueDate && (
              <View style={styles.dueDateContainer}>
                <Text
                  variant="bodySmall"
                  style={[
                    styles.dueDate,
                    {
                      color: isOverdue()
                        ? (prefsState.dark ? prefsState.theme.dark.error : prefsState.theme.light.error)
                        : isDueSoon()
                        ? (prefsState.dark ? '#ff9800' : '#f57c00')
                        : textColor,
                    },
                  ]}>
                  {formatDate(todo.dueDate)}
                </Text>
              </View>
            )}
          </View>

          {/* Progress indicator for completed todos */}
          {todo.isCompleted && (
            <Surface style={styles.completedIndicator} elevation={0}>
              <Text variant="bodySmall" style={styles.completedText}>
                ✓ Completed
              </Text>
            </Surface>
          )}
        </Card.Content>
      </Pressable>
    </Card>
  );
};

const styles = StyleSheet.create({
  card: {
    marginHorizontal: 4,
    marginVertical: 2,
  },
  pressable: {
    flex: 1,
  },
  cardContent: {
    paddingVertical: 16,
    paddingHorizontal: 16,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  headerInfo: {
    flex: 1,
    marginLeft: 8,
  },
  priorityContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  priorityChip: {
    height: 28,
    minWidth: 70,
  },
  badge: {
    position: 'absolute',
    top: -4,
    right: -4,
  },
  overdueBadge: {
    backgroundColor: '#f44336',
  },
  dueSoonBadge: {
    backgroundColor: '#ff9800',
  },
  title: {
    marginBottom: 4,
    marginLeft: 48,
    fontWeight: '600',
  },
  description: {
    marginBottom: 12,
    marginLeft: 48,
    lineHeight: 20,
  },
  footerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    marginLeft: 48,
  },
  tagsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    flex: 1,
    gap: 6,
    marginRight: 8,
  },
  categoryChip: {
    height: 28,
    minWidth: 60,
  },
  tagChip: {
    height: 28,
    minWidth: 50,
  },
  chipText: {
    fontSize: 12,
    fontWeight: '500',
    lineHeight: 16,
  },
  moreTagsText: {
    fontSize: 10,
    opacity: 0.6,
    alignSelf: 'center',
    marginLeft: 4,
  },
  dueDateContainer: {
    alignItems: 'flex-end',
  },
  dueDate: {
    fontSize: 11,
    fontWeight: '500',
  },
  completedIndicator: {
    position: 'absolute',
    top: 8,
    right: 8,
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 12,
    backgroundColor: 'rgba(76, 175, 80, 0.1)',
  },
  completedText: {
    color: '#4caf50',
    fontSize: 10,
    fontWeight: '600',
  },
});

export default TodoItem;