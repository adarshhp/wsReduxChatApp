import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface filtereduser {
  id: number;
  name: string;
}

interface GroupState {
  value: filtereduser[];
}
const initialState: GroupState = {
  value: [],
};
const groupUserSlice = createSlice({
  name: "groupusers",
  initialState,
  reducers: {
    AddUsers: (state, action: PayloadAction<filtereduser[]>) => {
        state.value=action.payload
    },
    clearGroup:(state)=>{
        state.value=[];
      }
  },
});

export const {AddUsers,clearGroup}=groupUserSlice.actions;
export default groupUserSlice.reducer;
