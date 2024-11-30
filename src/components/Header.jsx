import React, {useState} from 'react';
import {Appbar, Menu} from 'react-native-paper';
import {useDispatch} from 'react-redux';
import {logout} from '../redux/slices/agentSlice';
import {logoutAndReset, navigate} from '../services/NavigationService';

const Header = ({title}) => {
  const dispatch = useDispatch();
  const [menuVisible, setMenuVisible] = useState(false);

  const openMenu = () => setMenuVisible(true);
  const closeMenu = () => setMenuVisible(false);

  const onSettingsPress = () => {
    closeMenu();
    navigate('Settings');
  };

  const signOut = () => {
    closeMenu();
    dispatch(logout());
    logoutAndReset();
  };
  return (
    <Appbar.Header>
      <Appbar.Content title={title} />
      <Menu
        visible={menuVisible}
        onDismiss={closeMenu}
        anchor={
          <Appbar.Action
            icon="dots-vertical"
            color="purple"
            onPress={openMenu}
          />
        }>
        <Menu.Item onPress={onSettingsPress} title="Paramètres" />
        <Menu.Item onPress={signOut} title="Déconnexion" />
      </Menu>
      {/* <Appbar.Action icon="logout" onPress={signOut} /> */}
    </Appbar.Header>
  );
};

export default Header;
