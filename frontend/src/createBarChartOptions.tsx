const createBarChartOptions = (xAxesMax: number) => {
    return {
        layout: {
            padding: {
                left: 220,
            },
        },
        legend: {
            display: false,
        },
        tooltips: {
            enabled: false,
        },
        scales: {
            xAxes: [
                {
                    position: "top",
                    ticks: {
                        min: 0,
                        max: xAxesMax,
                        minRotation: 0,
                        stepSize: xAxesMax,
                        maxRotation: 0,
                        callback: function (value: number) {
                            if (value === 0) {
                                return "Not important";
                            } else if (value === xAxesMax ) {
                                return "Important";
                            }
                            return undefined;
                        },
                        fontSize: 16,
                    },
                },
            ],
            yAxes: [
                {
                    ticks: {
                        mirror: true,
                        padding: 220,
                        fontSize: 16,
                        fontStyle: "bold",
                    },
                },
            ],
        },
    };
};

export default createBarChartOptions
