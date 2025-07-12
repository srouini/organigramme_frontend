// Determine the API endpoint based on environment
export const API_ENDPOINT = `http://${window.location.hostname}:8000`;

export const CONTAINER_NATURE_CHOICES = [
  {
    value: true,
    label: "Groupage",
  },
  {
    value: false,
    label: "Ordinaire",
  },
];

export const YES_NO_CHOICES = [
  {
    value: true,
    label: "Oui",
  },
  {
    value: false,
    label: "Non",
  }
];

export const STRUCTURE_STATES = [
  {
    value: "Draft",
    label: "Brouillon",
  },
  {
    value: "Final",
    label: "Final",
  },
  {
    value: "Archived",
    label: "Archivé",
  }
];

export const PAIEMENTS_METHODE = [
  {
    value: "Chèque",
    label: "Chèque",
  },
  {
    value: "Espèce",
    label: "Espèce",
  },
];
