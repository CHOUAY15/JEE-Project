import { Home, Profile, Tables, Notifications } from "@/pages/dashboard";
import SurveillancePage from "./pages/surveillance/SurveillancePage";
import ExamsPage from "./pages/ExamsPage";
import TeachersPage from "./pages/TeachersPage"

import DepartmentsPage from "./pages/DepartmentsPage";

import {
  HomeIcon,
  DocumentChartBarIcon,
  AcademicCapIcon,
  EyeIcon,
  BriefcaseIcon,
  CogIcon,
  BuildingOfficeIcon,
  MapIcon
} from "@heroicons/react/24/solid";
import LocauxPage from "./pages/LocauxPage";
import OptionsPage from "./pages/OptionsPage";
import ModulePages from "./pages/ModulePages";

const icon = {
  className: "w-5 h-5 text-inherit",
};

export const routes = [
  {
    layout: "dashboard",
    pages: [
      {
        icon: <HomeIcon {...icon} />, // Home remains the same
        name: "dashboard",
        path: "/home",
        element: <Home />,
      },
     
   //  {
      //  icon: <DocumentChartBarIcon {...icon} />, // More representative of tables/data
       // name: "tables",
        //path: "/tables",
        //element: <Tables />,
    //  },
     
      {
        icon: <AcademicCapIcon {...icon} />, // Graduation cap for exams
        name: "examens",
        path: "/Examens",
        element: <ExamsPage/>,
      },
      {
        icon: <EyeIcon {...icon} />, // Eye icon for surveillance
        name: "surveillance",
        path: "/surveillance",
        element: <SurveillancePage/>,
      },
 //     {
   //     icon: <BriefcaseIcon {...icon} />, // Briefcase for employment/job
     //   name: "emploi",
     //   path: "/emploi",
     //   element: <SurveillancePage/>,
     // },
      {
        icon: <CogIcon {...icon} />, // Gear icon for options/settings
        name: "options",
        path: "/options",
        element: <OptionsPage/>,
      },
      {
        icon: <BuildingOfficeIcon {...icon} />, // Building icon for departments
        name: "departements",
        path: "/departements",
        element: <DepartmentsPage/>,
      },
      {
        icon: <MapIcon {...icon} />, // Map icon for locaux/locations
        name: "locaux",
        path: "/locaux",
        element: <LocauxPage/>,
      },
      {
        icon: <BuildingOfficeIcon {...icon} />,
        name: "teachers",
        path: "/departements/:departmentId/teachers",  // Utiliser ID au lieu de name
        element: <TeachersPage />,
        hidden: true, // This will hide it from the sidebar
      },

      {
        name: "modules",
        path: "/modules/:optionId",
        element: <ModulePages />,
        hidden: true, // This will hide it from the sidebar
      },
    ],
    
  },
];


export default routes;