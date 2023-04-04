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

    const positive = data.most_common_positive_words;
    const negative = data.most_common_negative_words;

    var chart = new CanvasJS.Chart("commonPositiveWords", {
      animationEnabled: true,
      title: {
        text: "Top Words",
      },
      axisX: {
        interval: 1
      },
      data: [
        {
          type: "bar",
          color: "#014D65",
          axisYType: "secondary",
          dataPoints: [{
            y: positive[0][1], label: positive[0][0]
          },
          {
            y: positive[1][1], label: positive[1][0]
          },
          {
            y: positive[2][1], label: positive[2][0]
          },
          {
            y: positive[3][1], label: positive[3][0]
          },
          {
            y: positive[4][1], label: positive[4][0]
          },

          ]
        },
      ],
    });



    var chart2 = new CanvasJS.Chart("commonNegativeWords", {
      animationEnabled: true,
      title: {
        text: "Top Words",
      },
      axisX: {
        interval: 1
      },
      data: [
        {
          type: "bar",
          color: "#014D65",
          axisYType: "secondary",
          dataPoints: [{
            y: negative[0][1], label: negative[0][0]
          },
          {
            y: negative[1][1], label: negative[1][0]
          },
          {
            y: negative[2][1], label: negative[2][0]
          },
          {
            y: negative[3][1], label: negative[3][0]
          },
          {
            y: negative[4][1], label: negative[4][0]
          },

          ]
        },
      ],
    });
    chart.render();
    chart2.render();
  });




