import React from 'react';
import {
  StyleProp,
  StyleSheet,
  useWindowDimensions,
  ViewProps,
  ViewStyle,
} from 'react-native';
import Animated, {
  AnimatedProps,
  AnimatedScrollViewProps,
  AnimatedStyle,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  WithSpringConfig,
} from 'react-native-reanimated';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {useKeyboardHeight} from '../hooks/useKeyboard';
import {useHeaderHeight} from '@react-navigation/elements';

interface BaseProps {
  withScrollView: boolean;
  style?: StyleProp<AnimatedStyle<StyleProp<ViewStyle>>>;
  children: React.ReactNode;
}

type Props = BaseProps &
  (
    | (AnimatedProps<ViewProps> & {withScrollView: false})
    | (AnimatedScrollViewProps & {withScrollView: true})
  );

const SPRING_CONFIG: WithSpringConfig = {
  damping: 15,
  mass: 0.8,
  stiffness: 150,
  overshootClamping: false,
  restDisplacementThreshold: 0.01,
  restSpeedThreshold: 0.01,
};

const ScreenWrapper: React.FC<Props> = ({
  withScrollView,
  style,
  children,
  ...rest
}) => {
  const insets = useSafeAreaInsets();
  const dimensions = useWindowDimensions();
  const keyboardHeight = useKeyboardHeight();
  const containerHeight = useSharedValue(dimensions.height);
  const headerHeight = useHeaderHeight();
  React.useEffect(() => {
    containerHeight.value = withSpring(
      dimensions.height -
        (keyboardHeight + headerHeight - insets.top + insets.bottom),
      SPRING_CONFIG,
    );
  }, [keyboardHeight, dimensions.height, headerHeight]);

  const animatedStyle = useAnimatedStyle(() => ({
    maxHeight: containerHeight.value,
    marginTop: headerHeight === 0 ? insets.top : 0,
  }));

  return withScrollView ? (
    <Animated.ScrollView
      {...rest}
      keyboardShouldPersistTaps="always"
      style={[
        styles.container,
        {
          marginBottom: insets.bottom,
        },
        animatedStyle,
        style,
      ]}>
      {children}
    </Animated.ScrollView>
  ) : (
    <Animated.View
      {...rest}
      style={[
        styles.container,
        {
          marginTop: insets.top,
          marginBottom: insets.bottom,
        },
        animatedStyle,
        style,
      ]}>
      {children}
    </Animated.View>
  );
};

export default ScreenWrapper;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
