import {FirebaseAuthTypes} from '@react-native-firebase/auth';
import {createSlice, PayloadAction} from '@reduxjs/toolkit';
import auth from '@react-native-firebase/auth';

type AuthStateTypes = {
  isLoggedInt: boolean;
};

const initialState: AuthStateTypes = {
  isLoggedInt: !!auth().currentUser,
};
const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    toggleLoginState: (state, action: PayloadAction<boolean>) => {
      console.log('4');
      state.isLoggedInt = action.payload;
    },
  },
});

export default authSlice.reducer;
export const {toggleLoginState} = authSlice.actions;
