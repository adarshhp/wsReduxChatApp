import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface REsp {
  group_name: string;
  created_by: number;
  group_ids: number;
  createdby_name?: string;
}

interface GroupState {
  value: REsp[];
}

const initialState: GroupState = {
  value: [],
};

const groupSlice = createSlice({
  name: "mygroup",
  initialState,
  reducers: {
    saveGroup: (state, action: PayloadAction<REsp[]>) => {
      state.value = action.payload;
    },
  },
});

export const { saveGroup } = groupSlice.actions;
export default groupSlice.reducer;
