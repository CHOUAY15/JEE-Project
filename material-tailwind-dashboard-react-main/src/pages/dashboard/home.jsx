import React, { useEffect, useState } from "react";
import { Typography } from "@material-tailwind/react";
import { StatisticsChart } from "@/widgets/charts";
import { ClockIcon } from "@heroicons/react/24/solid";
import {
  
  Card,
  CardHeader,
  CardBody,
} from "@material-tailwind/react";
import {
  ArrowUpIcon,
} from "@heroicons/react/24/outline";
import { StatisticsCard } from "@/widgets/cards";

import {
  statisticsCardsData,
  statisticsChartsData,
  ordersOverviewData,
} from "@/data";
import { BuildingOfficeIcon } from "@heroicons/react/24/solid"; // Import icon

export function Home() {
  const [examCount, setExamCount] = useState(null); // State for exams count
  const [teacherCount, setTeacherCount] = useState(null); // State for teachers count
  const [departmentCount, setDepartmentCount] = useState(null); // State for departments count

  const [departments, setDepartments] = useState([]);
  const [chartData, setChartData] = useState({
    categories: [],
    data: []
  });
  useEffect(() => {
    const fetchDepartmentData = async () => {
      try {
        const response = await fetch("http://localhost:8888/SERVICE-DEPARTEMENT/departements");
        const data = await response.json();
        setDepartments(data);

        // Préparer les données pour le graphique
        const categories = data.map(department => department.nom);
        const dataCounts = data.map(department => department.enseignants.length);
        setChartData({
          categories,
          data: dataCounts
        });
      } catch (error) {
        console.error("Error fetching department data:", error);
      }
    };

    fetchDepartmentData();
  }, []);
  useEffect(() => {
    const fetchDepartmentData = async () => {
      try {
        const response = await fetch("http://localhost:8888/SERVICE-DEPARTEMENT/departements");
        const data = await response.json();
        setDepartments(data); // Assuming data is an array of departments with a 'teachers' attribute
      } catch (error) {
        console.error("Error fetching department data:", error);
      }
    };

    fetchDepartmentData();
  }, []);

  // Fetch the number of exams from the API
  useEffect(() => {
    const fetchExamCount = async () => {
      try {
        const response = await fetch("http://localhost:8888/SERVICE-EXAMEN/api/examens");
        const data = await response.json();
        setExamCount(data.length); // Assuming the response contains an array of exams
      } catch (error) {
        console.error("Error fetching exam data:", error);
      }
    };

    // Fetch the number of teachers from the /enseignants API
    const fetchTeacherCount = async () => {
      try {
        const response = await fetch("http://localhost:8888/SERVICE-DEPARTEMENT/enseignants");
        const data = await response.json();
        setTeacherCount(data.length); // Assuming the response contains an array of teachers
      } catch (error) {
        console.error("Error fetching teacher data:", error);
      }
    };

    // Fetch the number of departments from the /departements API
    const fetchDepartmentCount = async () => {
      try {
        const response = await fetch("http://localhost:8888/SERVICE-DEPARTEMENT/departements");
        const data = await response.json();
        setDepartmentCount(data.length); // Assuming the response contains an array of departments
      } catch (error) {
        console.error("Error fetching department data:", error);
      }
    };

    fetchExamCount();
    fetchTeacherCount();
    fetchDepartmentCount();
  }, []);

  // Update the cards dynamically based on fetched data
  const updatedStatisticsCardsData = statisticsCardsData.map((card) => {
    if (card.title === "Exams" && examCount !== null) {
      return {
        ...card,
        value: examCount.toString(), // Set the value to the fetched exam count
      };
    }
    if (card.title === "Enseignants" && teacherCount !== null) {
      return {
        ...card,
        value: teacherCount.toString(), // Set the value to the fetched teacher count
      };
    }
    if (card.title === "Nombre total de départements" && departmentCount !== null) {
      return {
        ...card,
        value: departmentCount.toString(), // Set the value to the fetched department count
      };
    }
    return card;
  });
  const departmentTeacherChart = {
    type: "bar",
    height: 220,
    series: [
      {
        name: "Enseignants",
        data: chartData.data,
      },
    ],
    options: {
      chart: {
        background: '#f7fafc', // You can set a custom color here
        toolbar: {
          show: false,
        },
      },
      colors: ["#FF6347"], // Change this to your desired color (e.g., red instead of green)
      plotOptions: {
        bar: {
          columnWidth: "40%",
          borderRadius: 8,
        },
      },
      grid: {
        show: true,
        borderColor: "#e0e0e0", // Set grid line color
        strokeDashArray: 4,
        xaxis: {
          lines: {
            show: true,
          },
        },
        yaxis: {
          lines: {
            show: true,
          },
        },
      },
      xaxis: {
        categories: chartData.categories,
        title: {
          text: "Départements",
          style: {
            color: "#757575", // Custom color for the x-axis title
            fontSize: "14px",
          },
        },
        labels: {
          style: {
            colors: "#9e9e9e", // Custom color for the x-axis labels
          },
        },
      },
      yaxis: {
        title: {
          text: "Nombre d'enseignants",
          style: {
            color: "#757575", // Custom color for the y-axis title
            fontSize: "14px",
          },
        },
        labels: {
          style: {
            colors: "#9e9e9e", // Custom color for the y-axis labels
          },
        },
      },
      tooltip: {
        enabled: true,
        theme: "dark", // Tooltip theme (dark or light)
        y: {
          formatter: (value) => `${value} enseignants`, // Tooltip formatting
        },
      },
      legend: {
        position: "top",
        horizontalAlign: "center",
        floating: true,
        fontSize: "14px",
        labels: {
          colors: "#757575", // Custom color for the legend labels
        },
      },
    },
  };
  

  return (
    <div className="mt-12">
      {/* All statistical cards */}
      <div className="mb-12 grid gap-y-10 gap-x-6 md:grid-cols-2 xl:grid-cols-4">
        {updatedStatisticsCardsData.map(({ icon, title, footer, ...rest }) => (
          <StatisticsCard
            key={title}
            {...rest}
            title={title}
            icon={React.createElement(icon, {
              className: "w-6 h-6 text-white",
            })}
            footer={
              <Typography className="font-normal text-blue-gray-600">
                <strong className={footer.color}>{footer.value}</strong>
                &nbsp;{footer.label}
              </Typography>
            }
          />
        ))}
      </div>

  

      {/* Two statistical charts and Orders Overview */}
      
      <div className="mb-6 grid grid-cols-1 gap-y-12 gap-x-6 md:grid-cols-1">
        <StatisticsChart
          key="Department Teachers Count"
          title="Nombre d'enseignants par département"
          chart={departmentTeacherChart}
          footer={
            <Typography variant="small" className="flex items-center font-normal text-blue-gray-600">
              <ClockIcon strokeWidth={2} className="h-4 w-4 text-blue-gray-400" />
              &nbsp;Données mises à jour récemment
            </Typography>
          }
        />
      </div>

    </div>
  );
}

export default Home;
