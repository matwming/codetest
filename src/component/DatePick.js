import React from "react";
import { DateRangePicker } from "element-react";

const DatePick = props => {
 const handleDateRange = value => {
  if (value == null) {
   return;
  }
  //the following code is used to transform selected_time_array to this '2018-10-10,2018-10-25' format
  const dateRange = value;
  //console.log(dateRange);
  function formatDate(date) {
   var d = new Date(date),
    month = "" + (d.getMonth() + 1),
    day = "" + d.getDate(),
    year = d.getFullYear();
   if (month.length < 2) month = "0" + month;
   if (day.length < 2) day = "0" + day;
   return [year, month, day].join("-");
  }
  let mydate = [];
  if (dateRange) {
   if (dateRange.length > 0) {
    console.log("dateRange", dateRange);
    let myNewDate = dateRange.map(el => {
     return mydate.concat(formatDate(el));
    });
    // myNewDate was not used here
    props.onChange(value);
   } else {
    console.log("dateRange is empty", dateRange);
   }
  }
 };
 return (
  <DateRangePicker
   value={props.dateRange}
   placeholder="Select Date Range"
   align="right"
   onChange={value => {
    console.log("date_range", value);
    handleDateRange(value);
   }}
   shortcuts={[
    {
     text: "Last Week",
     onClick: () => {
      const end = new Date();
      const start = new Date();
      start.setTime(start.getTime() - 3600 * 1000 * 24 * 7);
      handleDateRange([start, end]);
     }
    },
    {
     text: "Last Month",
     onClick: () => {
      const end = new Date();
      const start = new Date();
      start.setTime(start.getTime() - 3600 * 1000 * 24 * 30);
      handleDateRange([start, end]);
     }
    },
    {
     text: "Last Three Month",
     onClick: () => {
      const end = new Date();
      const start = new Date();
      start.setTime(start.getTime() - 3600 * 1000 * 24 * 90);
      handleDateRange([start, end]);
     }
    }
   ]}
  />
 );
};

export default DatePick;
