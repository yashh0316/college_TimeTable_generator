import React, { Component } from "react";
import { connect } from "react-redux";

class DisplayTimetable extends Component {
  constructor(props) {
    super(props);
    this.state = {
      days: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"],
      periodTimes: [
        "12:00-1:00 PM", "1:00-2:00 PM", "2:00-3:00 PM", "3:00-4:00 PM",
        "12:00-1:00 PM", "1:00-2:00 PM", "2:00-3:00 PM", "3:00-4:00 PM",
        "8:00-9:00 AM", "9:00-10:00 AM", "10:00-11:00 AM", "11:00-12:00 AM",
        "12:00-1:00 PM", "1:00-2:00 PM", "2:00-3:00 PM", "3:00-4:00 PM",
      ],
      splitAfter: 4, // Number of periods per table (vertical split)
    };
  }

  render() {
    const { timeTable } = this.props;

    if (!timeTable || !timeTable.timeTable || !Array.isArray(timeTable.timeTable)) {
      return <div>No timetable data available. Please check your input.</div>;
    }

    const { maxPeriods = 0, timeTable: tables } = timeTable;
    const periods = Math.min(maxPeriods, this.state.periodTimes.length);
    const { days, periodTimes } = this.state;

    // Limit to 7 semesters only for rendering the tables
    const maxSemesters = 7; 
    const semestersToRender = tables.slice(0, maxSemesters); // This line ensures only the first 7 semesters are rendered

    // Set the number of columns per table
    const columnsPerTable = 4;

    return (
      <div className="page display" style={{ marginTop: "100px" }}>
        <h2>1st - 4th Year</h2>
        
        {/* Render only tables for the first 7 semesters */}
        {semestersToRender.map((timetable, tableIndex) => (
          <div key={tableIndex} style={{ marginBottom: "50px" }}>
            {/* Render a single table for each semester */}
            <h3 style={{ textAlign: "center", margin: "20px 0" }}>
              Semester {2*tableIndex + 1}
            </h3>
            <table
              className="table table-bordered"
              style={{
                marginBottom: "30px",
                fontSize: "16px",
                textAlign: "center",
              }}
            >
              <thead>
                <tr>
                  <th>Days\Periods</th>
                  {periodTimes.slice(0, columnsPerTable).map((period, index) => (
                    <th key={index}>{period}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {days.map((day, dayIndex) => (
                  <tr key={dayIndex}>
                    <th>{day}</th>
                    {timetable[dayIndex]
                      ?.slice(0, columnsPerTable) // Limit to 4 periods for each day
                      ?.map((periodData, periodIndex) => (
                        <td key={periodIndex}>
                          {periodData === 0
                            ? "-"
                            : `${periodData.subject} (Faculty: ${periodData.teacher})`}
                        </td>
                      ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ))}
      </div>
    );
  }
}

// Map Redux state to component props
const mapStateToProps = (state) => ({
  timeTable: state.timeTable || {}, // Ensure safe default value
});

export default connect(mapStateToProps)(DisplayTimetable);
