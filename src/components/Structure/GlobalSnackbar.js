// src/components/GlobalSnackbar.js
import React from 'react';
import {useSelector, useDispatch} from 'react-redux';
import {Snackbar} from 'react-native-paper';
import {hideSnackbar} from '../../redux/slices/snackbarSlice';

const GlobalSnackbar = () => {
  const {visible, message} = useSelector(state => state.snackbar);
  const dispatch = useDispatch();

  const onDismiss = () => {
    dispatch(hideSnackbar());
  };

  return (
    <Snackbar
      visible={visible}
      onDismiss={onDismiss}
      duration={3000}
      style={{position: 'absolute', bottom: 20, left: 0, right: 0}}
      contentStyle={{justifyContent: 'center', alignItems: 'center'}}
      textStyle={{textAlign: 'center'}}>
      {message}
    </Snackbar>
  );
};

export default GlobalSnackbar;
