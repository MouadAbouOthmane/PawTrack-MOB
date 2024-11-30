import React, {useEffect, useState} from 'react';
import {View, StyleSheet, ScrollView} from 'react-native';
import {TextInput, Text, useTheme} from 'react-native-paper';
import DropDownPicker from 'react-native-dropdown-picker';
import {useCreateInfraction} from '../CreateInfractionContext';
import {useInfractionTypes} from '../../../hooks/useInfractionTypes';

export default function Component() {
  const {formData, handleInputChange, errors} = useCreateInfraction();
  const {infractionTypes} = useInfractionTypes();
  const theme = useTheme();

  const [open, setOpen] = useState(false);
  const [value, setValue] = useState(formData.id_type_infraction);
  const [items, setItems] = useState(
    infractionTypes.map(type => ({
      label: type.name,
      value: type.id_type_infraction,
    })),
  );

  useEffect(() => {
    setItems(
      infractionTypes.map(type => ({
        label: type.name,
        value: type.id_type_infraction,
      })),
    );
  }, [infractionTypes]);

  const handleTypeSelection = itemValue => {
    const selectedType = infractionTypes.find(
      type => type.id_type_infraction === itemValue,
    );
    handleInputChange('id_type_infraction', itemValue);
    handleInputChange(
      'amount',
      selectedType ? selectedType.amount.toString() : '',
    );
    setValue(itemValue);
  };

  const customDropdownTheme = {
    backgroundColor: theme.colors.surface,
    borderColor: theme.colors.primary,
    borderRadius: 8,
    borderWidth: 1,
    color: theme.colors.text,
  };

  return (
    <ScrollView contentContainerStyle={styles.scrollViewContent}>
      <View style={styles.container}>
        <Text style={[styles.stepTitle, {color: theme.colors.primary}]}>
          Sélectionner le type d'infraction.
        </Text>
        <DropDownPicker
          open={open}
          value={value}
          items={items}
          setOpen={setOpen}
          setValue={setValue}
          setItems={setItems}
          placeholder="  Sélectionner le type d'infraction."
          onChangeValue={handleTypeSelection}
          style={[styles.dropdown, customDropdownTheme]}
          dropDownContainerStyle={[
            styles.dropdownContainer,
            customDropdownTheme,
          ]}
          textStyle={{color: theme.colors.text}}
          labelStyle={{color: theme.colors.primary}}
          placeholderStyle={{color: theme.colors.placeholder}}
          listItemLabelStyle={{color: theme.colors.text}}
          selectedItemLabelStyle={{
            color: theme.colors.primary,
            fontWeight: 'bold',
          }}
          arrowColor={theme.colors.primary}
          listMode="SCROLLVIEW"
          scrollViewProps={{
            nestedScrollEnabled: true,
          }}
        />
        {errors.id_type_infraction && (
          <Text style={[styles.errorText, {color: theme.colors.error}]}>
            {errors.id_type_infraction}
          </Text>
        )}
        <TextInput
          label="Montant"
          value={formData.amount}
          onChangeText={text => handleInputChange('amount', text)}
          keyboardType="numeric"
          disabled
          style={styles.input}
          theme={{colors: {primary: theme.colors.primary}}}
        />
        {errors.amount && (
          <Text style={[styles.errorText, {color: theme.colors.error}]}>
            {errors.amount}
          </Text>
        )}
        <TextInput
          label="Description (facultatif)"
          value={formData.description}
          onChangeText={text => handleInputChange('description', text)}
          multiline
          style={styles.input}
          theme={{colors: {primary: theme.colors.primary}}}
        />
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scrollViewContent: {
    flexGrow: 1,
  },
  container: {
    flex: 1,
    padding: 16,
  },
  stepTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  dropdown: {
    marginBottom: 16,
    height: 50,
  },
  dropdownContainer: {
    maxHeight: 200,
  },
  input: {
    marginBottom: 16,
  },
  errorText: {
    fontSize: 12,
    marginBottom: 8,
  },
});
