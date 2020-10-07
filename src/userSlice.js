const { createSlice } = require("@reduxjs/toolkit");

const User = createSlice({
  name: "user",
  initialState: { user: null, opponent: null },
  reducers: {
    login: (state, action) => {
      const user = action.payload;
      state.user = user;
      return state;
    },
    logout: (state) => {
      return null;
    },
    setOpponent: (state, action) => {
      const opp = action.payload;
      state.opponent = opp;
      return state;
    },
  },
});
const { reducer, actions } = User;
export const { login, logout, setOpponent } = actions;
export default reducer;
