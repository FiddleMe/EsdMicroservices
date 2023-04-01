axios
  .get("http://127.0.0.1:5010/analytics/pos_neg_percent")
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
  .get("http://127.0.0.1:5010/analytics/mode_of_eating")
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
              y: parseInt(data.test),
              legendText: "Eat In",
              indexLabel: "Eat In ",
            },
            // {
            //   y: parseInt(data.negative_feedback),
            //   legendText: "Eat Out",
            //   indexLabel: "Eat Out",
            // },
          ],
        },
      ],
    });
    chart.render();
  });

  axios
  .get("http://127.0.0.1:5010/analytics/top_words")
  .then((response) => {
    const data = response.data.data;
    console.log(data);

    var chart = new CanvasJS.Chart("chartContainer3", {
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
              y: parseInt(data.test),
              legendText: "Eat In",
              indexLabel: "Eat In ",
            },
            // {
            //   y: parseInt(data.negative_feedback),
            //   legendText: "Eat Out",
            //   indexLabel: "Eat Out",
            // },
          ],
        },
      ],
    });
    chart.render();
  });




