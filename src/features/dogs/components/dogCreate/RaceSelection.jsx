import React, {useState} from 'react';
import {StyleSheet} from 'react-native';
import {useTheme} from 'react-native-paper';
import DropDownPicker from 'react-native-dropdown-picker';

const raceOptions = [
  {label: 'Labrador', value: 'Labrador'},
  {label: 'Berger Allemand', value: 'German Shepherd'},
  {label: 'Golden Retriever', value: 'Golden Retriever'},
  {label: 'Bouledogue', value: 'Bulldog'},
  {label: 'Caniche', value: 'Poodle'},
  {label: 'Beagle', value: 'Beagle'},
  {label: 'Autre', value: 'Other'},
];

const RaceSelection = ({value, onValueChange}) => {
  const [open, setOpen] = useState(false);
  const theme = useTheme();

  const customDropdownTheme = {
    backgroundColor: theme.colors.surface,
    borderColor: theme.colors.primary,
    borderRadius: 8,
    borderWidth: 1,
    color: theme.colors.text,
  };

  return (
    <DropDownPicker
      open={open}
      value={value}
      items={raceOptions}
      setOpen={setOpen}
      setValue={onValueChange}
      placeholder="Sélectionnez une race"
      style={[styles.dropdown, customDropdownTheme]}
      dropDownContainerStyle={[styles.dropdownContainer, customDropdownTheme]}
      textStyle={{color: theme.colors.text}}
      labelStyle={{color: theme.colors.primary}}
      placeholderStyle={{color: theme.colors.placeholder}}
      listItemLabelStyle={{color: theme.colors.text}}
      selectedItemLabelStyle={{color: theme.colors.primary, fontWeight: 'bold'}}
      arrowColor={theme.colors.primary}
      listMode="SCROLLVIEW"
      scrollViewProps={{nestedScrollEnabled: true}}
    />
  );
};

const styles = StyleSheet.create({
  dropdown: {
    marginBottom: 16,
    height: 50,
  },
  dropdownContainer: {
    maxHeight: 200,
  },
});

export default RaceSelection;
