import { createSlice } from "@reduxjs/toolkit";

interface Number{
    value:number;
}

const initialState:Number={
    value: 1,
}

const numberSlice = createSlice({
    name:`number`,
    initialState,
    reducers:{
        increase:(state)=>{
            state.value+=1;
        },
        decrease:(state)=>{
            state.value-=1;
        },
        add:(state)=>{
            state.value+=100;
        }
    }
})

export const {increase,decrease,add} = numberSlice.actions;
export default numberSlice.reducer;