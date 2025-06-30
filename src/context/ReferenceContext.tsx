import React, { createContext, useContext } from "react";
import useUser from "@/hooks/references/useUser";
import useGrade from "@/hooks/references/useGrade";
import useOrganigrams from "@/hooks/references/useOrganigramsRef";


const ReferenceContext = createContext<any>(null);

type ReferenceContextProps = {
  children: React.ReactNode;
};

type Retuentype = {

  user: any,

}

const ReferenceContextProvider = ({ children }: ReferenceContextProps) => {


  const user = useUser();
  const grades = useGrade();
  const organigrams = useOrganigrams();
  

  const contextValues = {
  
    user,
    grades,
    organigrams
  };

  return (
    <ReferenceContext.Provider value={contextValues}>
      {children}
    </ReferenceContext.Provider>
  );
};



export default ReferenceContextProvider;

export const useReferenceContext = () => {
  const Context = useContext(ReferenceContext);

  if (!Context) {
    throw new Error(
      "useReferenceContext must be used within a ReferenceContextProvider"
    );
  }
  return Context;
};
