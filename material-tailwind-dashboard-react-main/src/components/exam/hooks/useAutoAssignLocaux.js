import { useMemo } from 'react';

export const useAutoAssignLocaux = (locaux, existingExams, examToEdit) => {
  const getAvailableLocaux = () => {
    const usedLocauxIds = existingExams
      .filter(exam => exam.id !== examToEdit?.id)
      .flatMap(exam => exam.locaux || []);

    return locaux.filter(local => !usedLocauxIds.includes(local.id));
  };

  const autoAssignLocaux = (studentCount) => {
    const count = parseInt(studentCount);
    if (!count) return [];

    const availableLocaux = getAvailableLocaux();

    // Separate available locaux by type and sort by capacity
    const amphis = availableLocaux
      .filter(local => local.type === 'amphi')
      .sort((a, b) => b.capacite - a.capacite);

    const salles = availableLocaux
      .filter(local => local.type === 'salle')
      .sort((a, b) => b.capacite - a.capacite);

    const assigned = [];
    let remainingStudents = count;

    // First try to allocate large groups to amphitheatres
    for (const amphi of amphis) {
      if (remainingStudents <= 0) break;
      // Only use amphi if it will be filled to at least 70% capacity
      if (remainingStudents >= amphi.capacite * 0.7) {
        assigned.push(amphi.id);
        remainingStudents -= amphi.capacite;
      }
    }

    // Then fill remaining students into classrooms
    if (remainingStudents > 0) {
      for (const salle of salles) {
        if (remainingStudents <= 0) break;
        // For small remaining groups, don't use rooms that are too large
        if (remainingStudents <= salle.capacite * 1.5) {
          assigned.push(salle.id);
          remainingStudents -= salle.capacite;
        }
      }
    }

    // If we still haven't found enough capacity, add any remaining suitable rooms
    if (remainingStudents > 0) {
      const unusedLocaux = availableLocaux
        .filter(local => !assigned.includes(local.id))
        .sort((a, b) => b.capacite - a.capacite);

      for (const local of unusedLocaux) {
        if (remainingStudents <= 0) break;
        assigned.push(local.id);
        remainingStudents -= local.capacite;
      }
    }

    return assigned;
  };

  return {
    autoAssignLocaux,
    getAvailableLocaux: useMemo(getAvailableLocaux, [locaux, existingExams, examToEdit])
  };
};