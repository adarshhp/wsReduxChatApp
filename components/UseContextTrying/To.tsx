import React from "react";
import { useFromm } from "./FromContext";

const To = () => {
  const importedNum = useFromm();
  return (
    <div>
      {importedNum?.pp} {/* Use the importedNum variable here */}
    </div>
  );
};

export default To;
