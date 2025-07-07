import { createContext, useContext } from "react";

interface ANumber {
  pp: number;
}

const Fromm = createContext<ANumber | null>(null);

export const useFromm = () => {
  return useContext(Fromm);
};

export default Fromm;
