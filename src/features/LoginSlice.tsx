import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface LoginStart{
    name:string,
    userId:string
}
const initialState:LoginStart={
name:"Initial",
userId:"Initial"
}

const loginSlice=createSlice({
    name:`login`,
    initialState,
    reducers:{
        setLogin:(state,action:PayloadAction<LoginStart>)=>{
            state.name=action.payload.name;
            state.userId=action.payload.userId;
        }
    }
})
export const {setLogin} = loginSlice.actions;
export default loginSlice.reducer;