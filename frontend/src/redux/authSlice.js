import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  user: null,
  token: "",
  onlineUser:[],
  socketConnection:null
};

export const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setUser: (state, action) => {
      state.user = action.payload;
    },
    setToken: (state, action) => {
      state.token = action.payload;
    },
    logout: (state) => {
      (state.user = null), (state.token = "")
      state.socketConnection = null;
    },
    setOnlineUser: (state,action)=>{
      // console.log(action.payload)
      state.onlineUser = action.payload;
    },
    setSocketConnection : (state,action)=>{
      state.socketConnection = action.payload
    }
  },
});

// Action creators are generated for each case reducer function
export const { setUser, setToken, logout,setOnlineUser,setSocketConnection } = authSlice.actions;

export const userDetails = (state) =>{
  return state?.user
};

export default authSlice.reducer;
