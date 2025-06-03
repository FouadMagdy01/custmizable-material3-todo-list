import React, {useState, useEffect, useMemo} from 'react';
import {
  PixelRatio,
  ScrollView,
  StyleSheet,
  useWindowDimensions,
  View,
} from 'react-native';
import {
  Button,
  Dialog,
  Portal,
  Text,
  Divider,
  SegmentedButtons,
} from 'react-native-paper';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming,
} from 'react-native-reanimated';
import ColorPicker, {
  HueSlider,
  OpacitySlider,
  Panel1,
  returnedResults,
  Swatches,
} from 'reanimated-color-picker';
import {useAppSelector} from '../../../hooks/reduxHooks';
import {
  createMaterial3Theme,
  Material3Theme,
} from '@pchmn/expo-material3-theme';
import {
  DarkTheme as NavigationDarkTheme,
  DefaultTheme as NavigationDefaultTheme,
} from '@react-navigation/native';
import {
  MD3DarkTheme,
  MD3LightTheme,
  adaptNavigationTheme,
} from 'react-native-paper';

type Props = {
  visible: boolean;
  onClose: () => void;
  onApply?: (initialColor: string, finalColor: string) => void;
};

type TabType = 'swatches' | 'picker';

const MATERIAL_SWATCHES = [
  '#6750A4',
  '#625B71',
  '#7D5260',
  '#B3261E',
  '#006A6B',
  '#00629E',
  '#8E4585',
  '#D2691E',
  '#228B22',
  '#4682B4',
  '#9932CC',
  '#FF6347',
  '#32CD32',
  '#1E90FF',
  '#FF1493',
  '#FFD700',
  '#FF69B4',
  '#00CED1',
  '#8A2BE2',
  '#FF4500',
  '#2E8B57',
  '#4169E1',
  '#DC143C',
  '#FF8C00',
];

const ColorSelectionDialog: React.FC<Props> = ({onClose, visible, onApply}) => {
  const prefsState = useAppSelector(state => state.preferences);
  const {height} = useWindowDimensions();

  const [intermediateTheme, setIntermediateTheme] =
    useState<Material3Theme | null>(null);
  const [selectedTab, setSelectedTab] = useState<TabType>('swatches');

  const initialColor = useMemo(() => {
    return prefsState.dark
      ? prefsState.theme.dark.primary
      : prefsState.theme.light.primary;
  }, []);

  const selectedColor = useSharedValue(initialColor);
  const previewScale = useSharedValue(1);

  const animatedPreviewStyle = useAnimatedStyle(() => ({
    backgroundColor: selectedColor.value,
    transform: [{scale: withSpring(previewScale.value)}],
  }));

  useEffect(() => {
    if (visible) {
      animatePreview();
    }
  }, [visible]);

  const animatePreview = () => {
    previewScale.value = withSpring(1.1, {}, () => {
      previewScale.value = withSpring(1);
    });
  };

  const handleColorChange = async (color: returnedResults) => {
    selectedColor.value = color.hex;
  };

  const handleColorComplete = async (color: returnedResults) => {
    const updatedTheme = createMaterial3Theme(color.hex);
    setIntermediateTheme(updatedTheme);
    selectedColor.value = color.hex;
    animatePreview();
  };

  const handleApply = () => {
    if (intermediateTheme && onApply) {
      onApply(initialColor, selectedColor.value);
    }
    onClose();
  };

  const handleReset = () => {
    setIntermediateTheme(null);
    selectedColor.value = MATERIAL_SWATCHES[0];
  };

  const getCombinedTheme = () => {
    const {LightTheme, DarkTheme} = adaptNavigationTheme({
      reactNavigationLight: NavigationDefaultTheme,
      reactNavigationDark: NavigationDarkTheme,
      materialLight: {
        ...MD3LightTheme,
        colors: intermediateTheme?.light ?? prefsState.theme.light,
      },
      materialDark: {
        ...MD3DarkTheme,
        colors: intermediateTheme?.dark ?? prefsState.theme.dark,
      },
    });

    const CombinedDefaultTheme = {
      ...MD3LightTheme,
      ...LightTheme,
      colors: {
        ...(intermediateTheme?.light ?? prefsState.theme.light),
        ...LightTheme.colors,
      },
    };

    const CombinedDarkTheme = {
      ...MD3DarkTheme,
      ...DarkTheme,
      colors: {
        ...(intermediateTheme?.dark ?? prefsState.theme.dark),
        ...DarkTheme.colors,
      },
    };

    return prefsState.dark ? CombinedDarkTheme : CombinedDefaultTheme;
  };

  const combinedTheme = getCombinedTheme();

  const renderColorPreview = () => (
    <View style={styles.previewSection}>
      <Text variant="labelLarge" style={styles.sectionLabel}>
        Preview
      </Text>
      <View style={styles.colorPreviewContainer}>
        <Animated.View
          style={[
            styles.largePreviewColor,
            {
              borderColor: combinedTheme.colors.outline,
              borderWidth: 2,
            },
            animatedPreviewStyle,
          ]}
        />
        <View style={styles.colorInfo}>
          <Text variant="bodyLarge" style={styles.colorHex}>
            {selectedColor.value.toUpperCase()}
          </Text>
          <Text variant="bodySmall" style={styles.colorDesc}>
            Primary Color
          </Text>
        </View>
      </View>
    </View>
  );

  const renderTabNavigation = () => (
    <View style={styles.tabContainer}>
      <SegmentedButtons
        value={selectedTab}
        onValueChange={value => setSelectedTab(value as TabType)}
        buttons={[
          {
            value: 'swatches',
            label: 'Quick Colors',
            icon: 'palette',
          },
          {
            value: 'picker',
            label: 'Custom Picker',
            icon: 'eyedropper-variant',
          },
        ]}
        style={styles.segmentedButtons}
      />
    </View>
  );

  const renderSwatchesTab = () => (
    <View style={styles.swatchesTab}>
      <Text variant="bodyMedium" style={styles.tabDescription}>
        Tap any color below to apply it instantly
      </Text>
      <ColorPicker
        value={selectedColor.value}
        sliderThickness={25}
        onComplete={handleColorComplete}
        onChange={handleColorChange}
        thumbSize={24}
        thumbShape="circle"
        boundedThumb>
        <Swatches
          style={styles.swatchesContainer}
          swatchStyle={styles.swatchStyle}
          colors={MATERIAL_SWATCHES}
        />
      </ColorPicker>
    </View>
  );

  const renderPickerTab = () => (
    <View style={styles.pickerTab}>
      <Text variant="bodyMedium" style={styles.tabDescription}>
        Use the color picker below for precise color selection
      </Text>
      <ColorPicker
        style={styles.colorPicker}
        value={selectedColor.value}
        sliderThickness={25}
        onComplete={handleColorComplete}
        onChange={handleColorChange}
        thumbSize={24}
        thumbShape="circle"
        boundedThumb>
        <Panel1 style={styles.panelStyle} />
        <HueSlider style={styles.sliderStyle} />
        <OpacitySlider style={styles.sliderStyle} />
      </ColorPicker>
    </View>
  );

  return (
    <Portal theme={combinedTheme}>
      <Dialog
        dismissable={false}
        visible={visible}
        onDismiss={onClose}
        style={[styles.dialog, {height: height * 0.9}]}>
        <Dialog.Title>Customize Colors</Dialog.Title>
        <Divider />

        {renderColorPreview()}
        <Divider />

        {renderTabNavigation()}

        <Dialog.ScrollArea style={styles.scrollArea}>
          <ScrollView showsVerticalScrollIndicator={false}>
            {selectedTab === 'swatches'
              ? renderSwatchesTab()
              : renderPickerTab()}
          </ScrollView>
        </Dialog.ScrollArea>

        <Dialog.Actions style={styles.dialogActions}>
          <Button
            onPress={handleReset}
            style={styles.resetButton}
            icon="refresh">
            Reset
          </Button>
          <Button onPress={onClose}>Cancel</Button>
          <Button mode="contained" onPress={handleApply} icon="check">
            Apply
          </Button>
        </Dialog.Actions>
      </Dialog>
    </Portal>
  );
};

const styles = StyleSheet.create({
  dialog: {
    borderRadius: 24,
    margin: 16,
  },
  previewSection: {
    padding: 24,
    paddingVertical: 16,
  },
  sectionLabel: {
    marginBottom: 12,
    fontWeight: '500',
  },
  colorPreviewContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  largePreviewColor: {
    width: 48,
    height: 48,
    borderRadius: 24,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  colorInfo: {
    flex: 1,
  },
  colorHex: {
    fontWeight: '600',
    fontFamily: 'monospace',
  },
  colorDesc: {
    opacity: 0.7,
    marginTop: 2,
  },
  tabContainer: {
    paddingHorizontal: 24,
    paddingVertical: 16,
  },
  segmentedButtons: {
    // No additional styling needed, SegmentedButtons handles its own styling
  },
  scrollArea: {
    flex: 1,
    paddingHorizontal: 0,
  },
  swatchesTab: {
    padding: 24,
    paddingTop: 8,
  },
  pickerTab: {
    padding: 24,
    paddingTop: 8,
  },
  tabDescription: {
    textAlign: 'center',
    opacity: 0.7,
    marginBottom: 24,
  },
  swatchesContainer: {
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: 12,
    justifyContent: 'center',
  },
  swatchStyle: {
    borderRadius: 16,
    height: 44,
    width: 44,
    margin: 0,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  colorPicker: {
    paddingHorizontal: 0,
  },
  panelStyle: {
    borderRadius: 20,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 4},
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 6,
  },
  sliderStyle: {
    borderRadius: 25,
    marginTop: 24,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  dialogActions: {
    flexGrow: 0,
  },
  resetButton: {
    borderRadius: 20,
  },
});

export default ColorSelectionDialog;
