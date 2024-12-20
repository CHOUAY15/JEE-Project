import React, { useEffect, useState } from "react";
import { Typography } from "@material-tailwind/react";
import { StatisticsChart } from "@/widgets/charts";
import { ClockIcon } from "@heroicons/react/24/solid";

import { useSelector } from "react-redux";

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
} from "@/data";

export function Home() {
  const selectedSession = useSelector((state) => state.exams.selectedSession);
  const sessionId = selectedSession?.sessionId;
  
  const [examCount, setExamCount] = useState(null);
  const [teacherCount, setTeacherCount] = useState(null);
  const [departmentCount, setDepartmentCount] = useState(null);
  const [departments, setDepartments] = useState([]);
  const [chartData, setChartData] = useState({
    categories: [],
    data: []
  });

  // Fetch department data and chart data
  useEffect(() => {
    const fetchDepartmentData = async () => {
      try {
        const response = await fetch("http://localhost:8888/SERVICE-DEPARTEMENT/departements");
        const data = await response.json();
        setDepartments(data);

        // Prepare chart data
        const categories = data.map(department => department.nom);
        const dataCounts = data.map(department => department.enseignants.length);
        setChartData({
          categories,
          data: dataCounts
        });
        setDepartmentCount(data.length);
      } catch (error) {
        console.error("Error fetching department data:", error);
      }
    };

    fetchDepartmentData();
  }, []);

  // Fetch exam count filtered by sessionId
  useEffect(() => {
    const fetchExamCount = async () => {
      if (!sessionId) return;
      try {
        const response = await fetch("http://localhost:8888/SERVICE-EXAMEN/api/examens");
        const data = await response.json();
        
        const filteredExams = data.filter((exam) => {
          console.log(exam); // Log each exam
          return exam.session.id === sessionId; // Return the filtering condition
        });
        
        setExamCount(filteredExams.length);
      } catch (error) {
        console.error("Error fetching exam data:", error);
      }
    };

    fetchExamCount();
  }, [sessionId]);

  // Fetch teacher count
  useEffect(() => {
    const fetchTeacherCount = async () => {
      try {
        const response = await fetch("http://localhost:8888/SERVICE-DEPARTEMENT/enseignants");
        const data = await response.json();
        setTeacherCount(data.length);
      } catch (error) {
        console.error("Error fetching teacher data:", error);
      }
    };

    fetchTeacherCount();
  }, []);

  // Update the cards dynamically based on fetched data
  const updatedStatisticsCardsData = statisticsCardsData.map((card) => {
    if (card.title === "Exams" && examCount !== null) {
      return {
        ...card,
        value: examCount.toString(),
      };
    }
    if (card.title === "Enseignants" && teacherCount !== null) {
      return {
        ...card,
        value: teacherCount.toString(),
      };
    }
    if (card.title === "Nombre total de départements" && departmentCount !== null) {
      return {
        ...card,
        value: departmentCount.toString(),
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
        background: '#f7fafc',
        toolbar: { show: false },
      },
      colors: ["#FF6347"],
      plotOptions: {
        bar: { columnWidth: "40%", borderRadius: 8 },
      },
      grid: {
        show: true,
        borderColor: "#e0e0e0",
        strokeDashArray: 4,
        xaxis: { lines: { show: true } },
        yaxis: { lines: { show: true } },
      },
      xaxis: {
        categories: chartData.categories,
        title: { text: "Départements", style: { color: "#757575", fontSize: "14px" } },
        labels: { style: { colors: "#9e9e9e" } },
      },
      yaxis: {
        title: { text: "Nombre d'enseignants", style: { color: "#757575", fontSize: "14px" } },
        labels: { style: { colors: "#9e9e9e" } },
      },
      tooltip: {
        enabled: true,
        theme: "dark",
        y: { formatter: (value) => `${value} enseignants` },
      },
      legend: {
        position: "top",
        horizontalAlign: "center",
        floating: true,
        fontSize: "14px",
        labels: { colors: "#757575" },
      },
    },
  };

  return (
    <div className="mt-12">
      <div className="mb-12 grid gap-y-10 gap-x-6 md:grid-cols-2 xl:grid-cols-4">
        {updatedStatisticsCardsData.map(({ icon, title, footer, ...rest }) => (
          <StatisticsCard
            key={title}
            {...rest}
            title={title}
            icon={React.createElement(icon, { className: "w-6 h-6 text-white" })}
            footer={
              <Typography className="font-normal text-blue-gray-600">
                <strong className={footer.color}>{footer.value}</strong>
                &nbsp;{footer.label}
              </Typography>
            }
          />
        ))}
      </div>

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
