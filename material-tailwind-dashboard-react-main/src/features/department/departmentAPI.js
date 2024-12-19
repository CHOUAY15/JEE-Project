export const departmentAPI = {
    getDepartments: async () => {
      // Simuler un appel API
      return new Promise((resolve) => {
        setTimeout(() => {
          resolve([
            { id: 1, name: 'Informatique' },
            { id: 2, name: 'Mathématiques' },
            { id: 3, name: 'Physique' },
          ]);
        }, 1000);
      });
    },
    
    createDepartment: async (departmentData) => {
      // Simuler un appel API POST
      return new Promise((resolve) => {
        setTimeout(() => {
          resolve({ id: Date.now(), ...departmentData });
        }, 1000);
      });
    },
    
    createTeacher: async (teacherData) => {
      // Simuler un appel API POST
      return new Promise((resolve) => {
        setTimeout(() => {
          resolve({ id: Date.now(), ...teacherData });
        }, 1000);
      });
    },
  };