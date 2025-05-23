import React from 'react';
import {View, StyleSheet, PixelRatio, ScrollView, Alert} from 'react-native';
import {
  Button,
  Card,
  Switch,
  Text,
  TextInput,
  TouchableRipple,
} from 'react-native-paper';
import {useAppDispatch, useAppSelector} from '../../hooks/reduxHooks';
import {toggleTheme, updateTheme} from '../../redux/preferences/reducers';
import ColorPicker, {
  returnedResults,
  colorKit,
  Panel1,
  HueSlider,
  OpacitySlider,
  Swatches,
  PreviewText,
} from 'reanimated-color-picker';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
} from 'react-native-reanimated';
import {createMaterial3Theme} from '@pchmn/expo-material3-theme';
import ScreenWrapper from '../../components/ScreenWrapper';
const Settings = () => {
  const prefsState = useAppSelector(state => state.preferences);
  const dispatch = useAppDispatch();
  const customSwatches = new Array(36)
    .fill('')
    .map(() => colorKit.randomRgbColor().hex());
  console.log(customSwatches);
  const selectedColor = useSharedValue(customSwatches[0]);
  const backgroundColorStyle = useAnimatedStyle(() => ({
    backgroundColor: selectedColor.value,
  }));

  const onChange = async (color: returnedResults) => {
    selectedColor.value = color.hex;
  };
  const onLiftThumb = async (color: returnedResults) => {
    const updatedTheme = createMaterial3Theme(color.hex);
    dispatch(
      updateTheme({
        dark: prefsState.dark,
        theme: updatedTheme,
      }),
    );
    selectedColor.value = color.hex;
  };

  return (
    <ScreenWrapper withScrollView contentContainerStyle={styles.container}>
      <TouchableRipple
        onPress={() => {
          dispatch(toggleTheme());
        }}>
        <View style={styles.row}>
          <Text>Dark Mode</Text>
          <Switch
            value={prefsState.dark}
            onValueChange={() => {
              dispatch(toggleTheme());
            }}
          />
        </View>
      </TouchableRipple>
      <ColorPicker
        style={{
          paddingHorizontal: 8 * PixelRatio.get(),
        }}
        value={selectedColor.value}
        sliderThickness={25}
        onComplete={onLiftThumb}
        onChange={onChange}
        thumbSize={24}
        thumbShape="circle"
        boundedThumb>
        <Swatches
          style={[
            styles.swatchesContainer,
            {
              marginBottom: 16,
            },
          ]}
          swatchStyle={styles.swatchStyle}
          colors={customSwatches}
        />
      </ColorPicker>
      <ColorPicker
        style={{
          paddingHorizontal: 8 * PixelRatio.get(),
        }}
        value={selectedColor.value}
        sliderThickness={25}
        onComplete={onLiftThumb}
        onChange={onChange}
        thumbSize={24}
        thumbShape="circle"
        boundedThumb>
        <Panel1 style={styles.panelStyle} />
        <HueSlider style={styles.sliderStyle} />
        <OpacitySlider style={styles.sliderStyle} />
        <View style={styles.previewTxtContainer}>
          <Animated.View
            style={[
              styles.previewColor,
              {
                borderColor: prefsState.dark
                  ? prefsState.theme.dark.elevation.level5
                  : prefsState.theme.light.elevation.level5,
                borderWidth: 2,
              },
              backgroundColorStyle,
            ]}
          />
          <PreviewText style={{color: '#707070'}} />
        </View>
      </ColorPicker>
    </ScreenWrapper>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8 * PixelRatio.get(),
    paddingHorizontal: 8 * PixelRatio.get(),
  },

  panelStyle: {
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  sliderStyle: {
    borderRadius: 20,
    marginTop: 20,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  previewTxtContainer: {
    paddingTop: 20,
    marginTop: 20,
    borderTopWidth: 1,
    borderColor: '#bebdbe',
    gap: 8 * PixelRatio.get(),
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
  },
  previewColor: {
    width: 16 * PixelRatio.get(),
    height: 16 * PixelRatio.get(),
    borderRadius: 8 * PixelRatio.get(),
  },
  swatchesContainer: {
    paddingTop: 20,
    marginTop: 20,
    borderTopWidth: 1,
    borderColor: '#bebdbe',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: 10,
  },
  swatchStyle: {
    borderRadius: 20,
    height: 30,
    width: 30,
    margin: 0,
    marginBottom: 0,
    marginHorizontal: 0,
    marginVertical: 0,
  },
  openButton: {
    width: '100%',
    borderRadius: 20,
    paddingHorizontal: 40,
    paddingVertical: 10,
    backgroundColor: '#fff',

    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,

    elevation: 5,
  },
  closeButton: {
    position: 'absolute',
    bottom: 20,
    borderRadius: 20,
    paddingHorizontal: 40,
    paddingVertical: 10,
    alignSelf: 'center',
    backgroundColor: '#fff',

    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,

    elevation: 5,
  },
});

export default Settings;
