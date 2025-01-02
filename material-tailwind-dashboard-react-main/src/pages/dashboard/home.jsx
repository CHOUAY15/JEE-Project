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
import { StatisticsCard } from "@/widgets/cards";
import { statisticsCardsData } from "@/data";

export function Home() {
  const selectedSession = useSelector((state) => state.exams.selectedSession);
  const sessionId = selectedSession?.sessionId;

  const [examCount, setExamCount] = useState(0);
  const [teacherCount, setTeacherCount] = useState(0);
  const [departmentCount, setDepartmentCount] = useState(0);
  const [optiontCount, setOptionCount] = useState(0);
  const [departments, setDepartments] = useState([]);
  const [chartData, setChartData] = useState({
    categories: ['Chargement...'],
    data: [0]
  });

  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchDepartmentData = async () => {
      setIsLoading(true);
      try {
        const response = await fetch("http://localhost:8888/SERVICE-DEPARTEMENT/departements");
        const data = await response.json();
        
        if (Array.isArray(data)) {
          setDepartments(data);
          
          const categories = data.map(department => department.nom || 'Sans nom');
          const dataCounts = data.map(department => 
            Array.isArray(department.enseignants) ? 
            department.enseignants.filter(e => e !== null && e !== undefined).length : 0
          );
          
          setChartData({
            categories: categories.length > 0 ? categories : ['Aucune donnée'],
            data: dataCounts.length > 0 ? dataCounts : [0]
          });
          setDepartmentCount(data.length);
        } else {
          setChartData({
            categories: ['Aucune donnée'],
            data: [0]
          });
          setDepartments([]);
          setDepartmentCount(0);
        }
      } catch (error) {
        console.error("Erreur lors de la récupération des données des départements:", error);
        setChartData({
          categories: ['Erreur de chargement'],
          data: [0]
        });
        setDepartments([]);
        setDepartmentCount(0);
      } finally {
        setIsLoading(false);
      }
    };

    fetchDepartmentData();
  }, []);

  useEffect(() => {
    const fetchExamCount = async () => {
      if (!sessionId) {
        setExamCount(0);
        return;
      }
      try {
        const response = await fetch("http://localhost:8888/SERVICE-EXAMEN/api/examens");
        const data = await response.json();
        if (Array.isArray(data)) {
          const filteredExams = data.filter((exam) => exam.session?.id === sessionId);
          setExamCount(filteredExams.length);
        } else {
          setExamCount(0);
        }
      } catch (error) {
        console.error("Erreur lors de la récupération des données d'examen:", error);
        setExamCount(0);
      }
    };

    fetchExamCount();
  }, [sessionId]);
  useEffect(() => {
    const fetchOptionCount = async () => {
      if (!sessionId) {
        setOptionCount(0);
        return;
      }
      try {
        const response = await fetch("http://localhost:8888/SERVICE-EXAMEN/api/options");
        const data = await response.json();
        setOptionCount(data.length);
  
      } catch (error) {
        console.error("Erreur lors de la récupération des données d'options:", error);
        setExamCount(0);
      }
    };
  
    fetchOptionCount(); // Corrected function name
  }, [sessionId]);
  

  useEffect(() => {
    const fetchTeacherCount = async () => {
      try {
        const response = await fetch("http://localhost:8888/SERVICE-DEPARTEMENT/enseignants");
        const data = await response.json();
        if (Array.isArray(data)) {
          setTeacherCount(data.length);
        } else {
          setTeacherCount(0);
        }
      } catch (error) {
        console.error("Erreur lors de la récupération des données des enseignants:", error);
        setTeacherCount(0);
      }
    };

    fetchTeacherCount();
  }, []);

  const updatedStatisticsCardsData = statisticsCardsData.map((card) => {
    let value = "0";
    switch (card.title) {
      case "Exams":
        value = examCount.toString();
        break;
      case "Enseignants":
        value = teacherCount.toString();
        break;
      case "Départements":
        value = departmentCount.toString();
        break;
        case "Options":
          value = optiontCount.toString();
          break;
      default:
        value = card.value;
    }
    return {
      ...card,
      value
    };
  });

  const departmentTeacherChart = {
    type: "donut",
    height: 350,
    series: chartData?.data?.length ? chartData.data : [0],
    options: {
      chart: {
        background: '#f8fafc',
        type: 'donut',
        fontFamily: 'Inter, sans-serif',
        animations: {
          enabled: true,
          easing: 'easeinout',
          speed: 800,
          animateGradually: {
            enabled: true,
            delay: 150
          },
          dynamicAnimation: {
            enabled: true,
            speed: 350
          }
        }
      },
      colors: ['#3b82f6', '#60a5fa', '#93c5fd', '#2563eb', '#1d4ed8', '#2563eb', '#3b82f6', '#60a5fa'],
      labels: chartData?.categories?.length ? chartData.categories : ['Aucune donnée'],
      plotOptions: {
        pie: {
          donut: {
            size: '75%',
            labels: {
              show: true,
              total: {
                show: true,
                label: 'Total Enseignants',
                formatter: function (w) {
                  return (w.globals.seriesTotals || []).reduce((a, b) => a + b, 0);
                }
              }
            }
          },
          expandOnClick: true
        }
      },
      dataLabels: {
        enabled: true,
        formatter: function (val, opts) {
          const label = opts.w.globals.labels?.[opts.seriesIndex] || 'N/A';
          const value = opts.w.globals.series?.[opts.seriesIndex] || 0;
          return `${label}: ${value}`;
        }
      },
      legend: {
        position: 'bottom',
        horizontalAlign: 'center',
        fontSize: '14px',
        markers: {
          width: 12,
          height: 12,
          radius: 6
        },
        itemMargin: {
          horizontal: 10,
          vertical: 5
        }
      },
      tooltip: {
        enabled: true,
        theme: 'dark',
        y: {
          formatter: (value) => `${value} enseignants`
        },
        style: {
          fontSize: '14px'
        }
      },
      responsive: [{
        breakpoint: 480,
        options: {
          chart: {
            height: 300
          },
          legend: {
            position: 'bottom'
          }
        }
      }]
    }
  };

  return (
    <div className="mt-12">
      <div className="mb-12 grid gap-y-10 gap-x-6 md:grid-cols-2 xl:grid-cols-4">
        {updatedStatisticsCardsData.map(({ icon, title, footer, ...rest }) => (
          <StatisticsCard
            key={title}
            {...rest}
            title={title}
            icon={React.createElement(icon, {
              className: "w-6 h-6 text-white"
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

      <div className="grid grid-cols-1 gap-6 mb-6 lg:grid-cols-2">
        <Card className="h-full">
          <CardHeader variant="gradient" color="blue" className="p-4">
            <Typography variant="h6" color="white">
              Distribution des Enseignants
            </Typography>
          </CardHeader>
          <CardBody>
            {!isLoading ? (
              <StatisticsChart
                key={`Department-Teachers-Count-${departments.length}-${Date.now()}`}
                chart={departmentTeacherChart}
                description="Distribution des enseignants par département"
                footer={
                  <Typography variant="small" className="flex items-center justify-center font-normal text-blue-gray-600 mt-4">
                    <ClockIcon strokeWidth={2} className="h-4 w-4 text-blue-gray-400 mr-1" />
                    {`Mise à jour le ${new Date().toLocaleDateString()}`}
                  </Typography>
                }
              />
            ) : (
              <div className="flex items-center justify-center h-64">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500" />
              </div>
            )}
          </CardBody>
        </Card>

        <Card className="h-full">
          <CardHeader variant="gradient" color="blue" className="p-4">
            <Typography variant="h6" color="white">
              Détails des Départements
            </Typography>
          </CardHeader>
          <CardBody className="overflow-x-auto px-0">
            <table className="w-full min-w-[640px] table-auto">
              <thead>
                <tr>
                  {["Département", "Total Enseignants", "Enseignants Non Dispensés", "% Non Dispensés", "Status"].map((el) => (
                    <th key={el} className="border-b border-blue-gray-50 py-3 px-6 text-left">
                      <Typography
                        variant="small"
                        className="text-[11px] font-medium uppercase text-blue-gray-400"
                      >
                        {el || ''}
                      </Typography>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {departments.map(({ nom, enseignants }, key) => {
                  const className = `py-3 px-6 ${
                    key === departments.length - 1 ? "" : "border-b border-blue-gray-50"
                  }`;

                  const totalEnseignants = Array.isArray(enseignants) ? enseignants.length : 0;
                  
                  const nonDispensedCount = Array.isArray(enseignants) 
                    ? enseignants.filter(ens => ens?.estDispense === false).length 
                    : 0;

                  const departmentRatio = totalEnseignants > 0
                    ? ((nonDispensedCount / totalEnseignants) * 100).toFixed(2)
                    : "0.00";

                  const status = nonDispensedCount > 0 ? "Active" : "Inactive";

                  return (
                    <tr key={nom || 'département'}>
                      <td className={className}>
                        <Typography className="text-xs font-semibold text-blue-gray-600">
                          {nom || 'Sans nom'}
                        </Typography>
                      </td>
                      <td className={className}>
                        <Typography className="text-xs font-semibold text-blue-gray-600">
                          {`${totalEnseignants}`}
                        </Typography>
                      </td>
                      <td className={className}>
                        <Typography className="text-xs font-semibold text-blue-gray-600">
                          {nonDispensedCount > 0 ? (
                            <>
                              <span className="text-green-600">{`${nonDispensedCount}`}</span>
                              {nonDispensedCount < totalEnseignants && (
                                <span className="text-xs text-gray-500 ml-1">
                                  {`sur ${totalEnseignants}`}
                                </span>
                              )}
                            </>
                          ) : '0'}
                        </Typography>
                      </td>
                      <td className={className}>
                        <Typography 
                          className={`text-xs font-semibold ${
                            parseFloat(departmentRatio) > 50 ? 'text-green-600' : 'text-orange-600'
                          }`}
                        >
                          {`${departmentRatio}%`}
                        </Typography>
                      </td>
                      <td className={className}>
                        <Typography 
                          className={`text-xs font-semibold ${
                            nonDispensedCount > 0 ? 'text-green-600' : 'text-red-600'
                          }`}
                        >
                          {status}
                        </Typography>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </CardBody>
        </Card>
      </div>
    </div>
  );
}