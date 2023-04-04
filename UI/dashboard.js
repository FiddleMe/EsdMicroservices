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

    let word_item = {}
    let words_array = []


    const positive = data.most_common_positive_words;
    const negative = data.most_common_negative_words;


    for (let i = 0; i < positive.length; i++) {
      word_item.y = positive[i][1];
      word_item.label = positive[i][0];
      words_array.push(word_item)
    }

    for (let i = 0; i < negative.length; i++) {
      word_item.y = negative[i][1];
      word_item.label = negative[i][0];
      words_array.push(word_item)
    }

    var chart = new CanvasJS.Chart("chartContainer3", {
      animationEnabled: true,
      title: {
        text: "Top Words",
      },
      data: [
        {
          type: "bar",
          showInLegend: true,
          dataPoints: words_array,
        },
      ],
    });
    chart.render();
  });




