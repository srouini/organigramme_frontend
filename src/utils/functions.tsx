import moment from "moment";
import { SelectModeType } from "../types/antdeing";
import dayjs from "dayjs";

export const renderText = (value: any) => {
  return (
    <span style={{ whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis", display: "block" }}>
      {value ? value : "-"}
    </span>
  );};

interface NestedObject {
  id: number | string;
  [key: string]: any;
}

type InitialValues = {
  [key: string]: any;
};

import utc from 'dayjs/plugin/utc';
import { Rubrique } from "@/types/bareme";
dayjs.extend(utc); 

export const renderDateTime = (date: any) => {

  let formatted_date = dayjs(date).utc();

  if (formatted_date.isValid()) return formatted_date.format("YYYY-MM-DD HH:mm:ss");

  return "-";
};

export const renderDate = (date: any) => {
  let formatted_date = moment(date);

  if (formatted_date.isValid()) return formatted_date.format("YYYY-MM-DD");

  return "-";
};


export const renderMoney = (value: any) => {
  return (
    <span style={{ whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis", display: "block" }}>
      {value ? value + " DA" : "-"}
    </span>
  );};




  export const mapInitialValues = (
    initialValues: InitialValues
  ): InitialValues => {
    const mappedValues: InitialValues = {};
    if (!initialValues) {
      return mappedValues; // Return an empty object if initialValues is null or undefined
    }
  
    for (const [key, value] of Object.entries(initialValues)) {
      // Handle date fields: if the value is a valid date string (YYYY-MM-DD)
      if (
        value &&
        typeof value === "string" &&
        dayjs(value, "YYYY-MM-DD", true).isValid()
      ) {
        mappedValues[key] = dayjs(value, "YYYY-MM-DD");
      }
      // Handle datetime fields: if the value is a valid datetime string (YYYY-MM-DDTHH:mm:ss)
      else if (
        value &&
        typeof value === "string" &&
        dayjs(value, "YYYY-MM-DDTHH:mm:ssZ", false).isValid()
      ) {
        mappedValues[key] = dayjs(value,"YYYY-MM-DDTHH:mm:ss"); // Use dayjs directly to parse the datetime
      }
      // Handle nested objects with an 'id' field
      else if (value && typeof value === "object" && "id" in value) {
        mappedValues[key] = (value as NestedObject).id;
      }
      // Default case: retain the original value
      else {
        mappedValues[key] = value;
      }
    }
  
    return mappedValues;
  };
  


export const transformRangeDateFilter = (name: string, value: any) => {
  if (Array.isArray(value) && value.length === 2) {
    return {
      [`${name}__gte`]: value[0],
      [`${name}__lte`]: value[1],
    };
  }
  return {};
};

export const transformSelectFilter = (
  mode: SelectModeType,
  name: string,
  value: any
) => {
  if (mode === "multiple" || mode === "tags") {
    return { [`${name}__in`]: value.join(",") };
  }
  return { [`${name}`]: value };
};


export function removeDuplicatedRubriques(prestations: Rubrique[]): Rubrique[] {
  let uniqueDesignations: { [key: string]: boolean } = {};
  return prestations?.filter(item => {
    if (!uniqueDesignations[item.designation]) {
      uniqueDesignations[item.designation] = true;
      return true;
    }
    return false;
  });
}


export const formatDate = (field:string, values: any) => {
  values[field] = values[field].format("YYYY-MM-DD");
  return values
}

export const formatDateTime = (field:string, values: any) => {
  values[field] = values[field].format("YYYY-MM-DDTHH:mm:ss");
  return values
}


export function formatStringDate(dateString:string) {
  return moment(dateString).format('YYYY-MM-DD HH:mm');
}

export function roundToDecimals(num:number, decimals:number) {
  let factor = Math.pow(10, decimals);
  return Math.round(num * factor) / factor;
}

export function ensureHashPrefix(str:string) {
  // Check if the string starts with '#'
  if (str.startsWith('#')) {
      return str; // Return the string as it is
  } else {
      return '#' + str; // Add '#' at the beginning and return
  }
}

export const normalizeClientName = (name: string): string => {
  return name
    .toLowerCase()
    .replace(/\s*(eurl|sarl|epe|spa|algeria|algerie)\s*/gi, ' ')
    .trim();
};


export const normalizeString = (value: any): string => {
  if (value === null || value === undefined) return '';
  const str = String(value);
  return str
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9\s]/g, '')
    .trim();
};

export const calculateSimilarity = (str1: string, str2: string): number => {
  const longer = str1.length > str2.length ? str1 : str2;
  const shorter = str1.length > str2.length ? str2 : str1;
  
  if (longer.length === 0) {
    return 1.0;
  }
  
  const costs = new Array();
  for (let i = 0; i <= longer.length; i++) {
    let lastValue = i;
    for (let j = 0; j <= shorter.length; j++) {
      if (i === 0) {
        costs[j] = j;
      } else {
        if (j > 0) {
          let newValue = costs[j - 1];
          if (longer.charAt(i - 1) !== shorter.charAt(j - 1)) {
            newValue = Math.min(Math.min(newValue, lastValue), costs[j]) + 1;
          }
          costs[j - 1] = lastValue;
          lastValue = newValue;
        }
      }
    }
    if (i > 0) {
      costs[shorter.length] = lastValue;
    }
  }
  return (1 - costs[shorter.length] / longer.length) * 100;
};


export const findMatchingContainerType = (containerType:any,typeName: any) => {
  if (!containerType?.results?.length || !typeName) return null;

  const normalizedSearchName = normalizeString(typeName);

  let bestMatch = null;
  let highestSimilarity = 0;

  containerType.results.forEach((existingType:any) => {
    const normalizedExistingName = normalizeString(existingType.designation);
    const similarity = calculateSimilarity(normalizedSearchName, normalizedExistingName);

    if (similarity > 90 && similarity > highestSimilarity) {
      highestSimilarity = similarity;
      bestMatch = existingType;
    }
  });

  return bestMatch;
};

export const findMatchingClient = (client: any, clientName: string) => {
  if (!client?.results?.length || !clientName) return null;

  const normalizedSearchName = normalizeClientName(clientName);
  let bestMatch = null;
  let highestSimilarity = 0;

  client.results.forEach((existingClient:any) => {
    const normalizedExistingName = normalizeClientName(existingClient.raison_sociale);
    const similarity = calculateSimilarity(normalizedSearchName, normalizedExistingName);

    if (similarity > 85 && similarity > highestSimilarity) {
      highestSimilarity = similarity;
      bestMatch = existingClient;
    }
  });

  return bestMatch;
};

export const processBooleanValue = (value: any): boolean => {
  if (typeof value === 'boolean') return value;
  if (typeof value === 'string') {
    const normalizedValue = value.toLowerCase().trim();
    return ['vrai', 'yes', 'y', 'o', 'oui', 'true', '1'].includes(normalizedValue);
  }
  if (typeof value === 'number') return value === 1;
  return false;
}; 


export function getStatusColor(status: string): string {
  switch (status?.toLowerCase()) {
    case 'draft':
      return '#FFA500';
    case 'final':
      return '#437057';
    case 'archived':
      return '#6C757D';
    default:
      return 'blue';
  }
}

