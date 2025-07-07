
import { create } from "zustand";


// Define your store's state and actions here
interface State {
  count: number;
  increase: () => void;
  decrease: () => void;
}

const useStore = create<State>((set) => ({
  count: 0,  // Initial state
  increase: () => set((state) => ({ count: state.count + 1 })),
  decrease: () => set((state) => ({ count: state.count - 1 })),
}));

export default useStore;
