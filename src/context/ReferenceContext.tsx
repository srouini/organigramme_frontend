import React, { createContext, useContext } from "react";
import useUser from "@/hooks/references/useUser";
import useGrade from "@/hooks/references/useGrade";
import { useStructures } from '@/hooks/useStructure';
import usePositions from "@/hooks/references/usePositions";
import useStructuresRef from "@/hooks/references/useStructuresRef";
import useStructureType from "@/hooks/references/useStructureType";


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
  const structuresUnonnected = useStructuresRef({ unconnectedOnly: true });
  const structures = useStructuresRef();
  const positions = usePositions();
  const structureTypes = useStructureType();
  

  const contextValues = {
  
    user,
    grades,
    structures,
    structuresUnonnected,
    positions, 
    structureTypes
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
