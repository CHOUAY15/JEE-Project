export const examAPI = {
    getExams: async () => {
      // Simuler un appel API
      return new Promise((resolve) => {
        setTimeout(() => {
          resolve([
            { id: 1, name: 'Examen 1', date: '2024-11-06', time: '08:30-10:00' },
            { id: 2, name: 'Examen 2', date: '2024-11-07', time: '10:15-11:45' },
          ]);
        }, 1000);
      });
    },
    
    createExam: async (examData) => {
      // Simuler un appel API POST
      return new Promise((resolve) => {
        setTimeout(() => {
          resolve({ id: Date.now(), ...examData });
        }, 1000);
      });
    },
  };