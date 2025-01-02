import {
  DocumentCheckIcon,
  UserGroupIcon,
  BuildingOfficeIcon,
  EyeIcon
} from "@heroicons/react/24/solid";

export const statisticsCardsData = [
  {
    color: "gray",
    icon: DocumentCheckIcon,
    title: "Exams",
    value: "$53k",
    footer: {
      color: "text-green-500",
     
      label: "Nombre total d'exams de la session",
    },
  },
  {
    color: "gray",
    icon: UserGroupIcon,
    title: "Enseignants",
    value: "2,300",
    footer: {
      color: "text-green-500",
    
      label: "Nombre total d'enseignats",
    },
  },
  {
    color: "gray",
    icon: BuildingOfficeIcon,
    title: "Départements",
    value: "3,462",
    footer: {
      color: "text-red-500",
      
      label: "Nombre total de départements",
    },
  },
  {
    color: "gray",
    icon: EyeIcon,
    title: "Options",
    value: "0",
    footer: {
     
      label: "Nombre total d'Options",
    },
  },
];

export default statisticsCardsData;