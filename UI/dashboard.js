axios
  .get("http://localhost:5010/analytics/pos_neg_percent", {
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
  })
  .then((response) => {
    const data = response.data.data.feedback_percentages;

    var chart = new CanvasJS.Chart("feedbackChart", {
      animationEnabled: true,
      title: {
        text: "% of Positive and Negative Feedback",
      },
      data: [
        {
          type: "pie",
          showInLegend: true,
          percentFormatString: "#0.##",
          toolTipContent: "#percent%",
          dataPoints: [
            {
              y: parseInt(data.positive_feedback),
              legendText: "Positive Feedback",
              indexLabel: "Positive Feedback",
            },
            {
              y: parseInt(data.negative_feedback),
              legendText: "Negative Feedback",
              indexLabel: "Negative Feedback",
            },
          ],
        },
      ],
    });
    chart.render();
  });

  axios
  .get("http://localhost:5010/analytics/mode_of_eating",
  {
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
  })
  .then((response) => {
    const data = response.data.data;
    var chart = new CanvasJS.Chart("modeOfEatingChart", {
      animationEnabled: true,
      title: {
        text: "% of Top Menu Items",
      },
      data: [
        {
          type: "pie",
          showInLegend: true,
          percentFormatString: "#0.##",
          toolTipContent: "#percent%",
          dataPoints: [
            {
              y: parseInt(data.eatinghere),
              legendText: "Eat In",
              indexLabel: "Eat In ",
            },
            {
              y: parseInt(data.test),
              legendText: "Take Out",
              indexLabel: "Take Out ",
            },
          ],
        },
      ],
    });
    chart.render();
  });

  axios
  .get("http://localhost:5010/analytics/top_words", {
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
  }
  )
  .then((response) => {
    
    const data = response.data.data;
    console.log("result:")
    console.log(data);

    var chart = new CanvasJS.Chart("chartContainer3", {
      animationEnabled: true,
      title: {
        text: "Top Words",
      },
      data: [
        {
          type: "bar",
          showInLegend: true,
          dataPoints: [
            {
              y: parseInt(data.most_common_positive_words),
              legendText: "Most common positive words",
              indexLabel: "Most common positive words",
            },
            {
              y: parseInt(data.most_common_negative_words),
              legendText: "Most common negative words",
              indexLabel: "Most common negative words",
            },
          ],
        },
      ],
    });
    chart.render();
  });




