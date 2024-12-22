import {Card, Checkbox, RadioButton, Text} from 'react-native-paper';
import {TaskItem} from '../../../types/appTypes';
import {StyleProp, StyleSheet, ViewStyle} from 'react-native';
import {useAppDispatch} from '../../../hooks/reduxHooks';
import {toggleTaskState} from '../../../redux/tasks/tasksSlice';

type Props = {
  todo: TaskItem;
  style?: StyleProp<ViewStyle>;
};
const TodoItem: React.FC<Props> = ({todo, style}) => {
  const dispatch = useAppDispatch();
  return (
    <Card style={style}>
      <Card.Title
        title={todo.title}
        subtitle={todo.desc}
        left={props => (
          <Checkbox
            onPress={e => {
              dispatch(toggleTaskState(todo.id));
            }}
            status={todo.isCompleted ? 'checked' : 'unchecked'}
          />
        )}
      />
    </Card>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '90%',
  },
});
export default TodoItem;
