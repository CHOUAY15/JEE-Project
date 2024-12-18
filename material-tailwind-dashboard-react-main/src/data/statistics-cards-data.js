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
    title: "Nombre total de départements",
    value: "3,462",
    footer: {
      color: "text-red-500",
      
      label: "par rapport au mois dernier",
    },
  },
  {
    color: "gray",
    icon: EyeIcon,
    title: "Surveillance actuelle",
    value: "0",
    footer: {
     
      label: "Moyenne de surveillance",
    },
  },
];

export default statisticsCardsData;