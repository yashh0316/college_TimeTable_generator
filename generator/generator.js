const generateMergedTimetables = async (
    instances,
    givenSlots,
    teachers,
    sections,
    numTimetables
  ) => {
    let allTimetables = [];
    let occupiedSlots = [];
  
    const initializeSlots = () =>
      givenSlots.map((slots) => Array(slots).fill(0).map((_, i) => i));
  
    for (let t = 0; t < numTimetables; t++) {
      console.log(`Generating timetable ${t + 1}...`);
  
      let tempInstances = JSON.parse(JSON.stringify(instances));
      let tempTeachers = JSON.parse(JSON.stringify(teachers));
      let tempSections = JSON.parse(JSON.stringify(sections));
      let tempSlots = initializeSlots();
  
      occupiedSlots.forEach(({ day, slot }) => {
        tempSlots[day] = tempSlots[day].filter((s) => !slot.includes(s));
      });
  
      try {
        let timetable = await generate(tempInstances, tempSlots, tempTeachers, tempSections);
        allTimetables.push(timetable);
  
        timetable.forEach((sectionTT, sectionIndex) => {
          sectionTT.forEach((daySlots, day) => {
            daySlots.forEach((entry, slot) => {
              if (entry !== 0) {
                occupiedSlots.push({ day, slot: [slot] });
              }
            });
          });
        });
      } catch (error) {
        console.error(`Error generating timetable ${t + 1}:`, error);
        allTimetables.push(null);
      }
    }
  
    console.log("All generated timetables:", allTimetables);
  
    // Merge days logic
    const mergedTimetables = allTimetables.map((timetable) => {
      return timetable.map((sectionTT) => {
        let merged = [];
        // Merging Mon-Tue, Wed-Thu, and including Fri-Sat
        for (let i = 0; i < sectionTT.length; i += 2) {
          let mergedRow = [];
          for (let j = 0; j < givenSlots[i]; j++) {
            const firstDay = sectionTT[i] ? sectionTT[i][j] || 0 : 0;
            const secondDay = sectionTT[i + 1] ? sectionTT[i + 1][j] || 0 : 0;
            mergedRow.push(firstDay || secondDay);
          }
          merged.push(mergedRow);
        }
        if (sectionTT.length % 2 !== 0) {
          merged.push(sectionTT[sectionTT.length - 1]); // Saturday
        }
        return merged;
      });
    });
  
    console.log("Merged timetables:", mergedTimetables);
    return mergedTimetables;
  };
  
  // Example usage
  generateMergedTimetables(
    [
      { teacher: "T1", sections: ["12A"], subject: "English", numLectures: 12, numLabs: null },
      { teacher: "T2", sections: ["12A"], subject: "Hindi", numLectures: 11, numLabs: null },
      { teacher: "T3", sections: ["12A"], subject: "Maths", numLectures: 11, numLabs: null },
    
    ],
    [16, 16, 8], // Merged days Mon-Tue, Wed-Thu, and separate Fri-Sat
    ["T1", "T2", "T3", "T4", "T5", "T6"],
    ["12A", "12B"],
    3
  ).then((results) => {
    console.log("Merged timetables:", results);
  });
  