import React from "react";
import {Colors} from "@blueprintjs/core";


const CHART_COLOR_PALETTE = [
    Colors.ROSE3,
    Colors.ROSE4,
    Colors.ROSE5,
    Colors.VIOLET3,
    Colors.VIOLET4,
    Colors.VIOLET5,
    Colors.INDIGO3,
    Colors.INDIGO4,
    Colors.INDIGO5,
    Colors.COBALT3,
    Colors.COBALT4,
    Colors.COBALT5,
    Colors.BLUE3,
    Colors.BLUE4,
    Colors.BLUE5,
    Colors.TURQUOISE3,
    Colors.TURQUOISE4,
    Colors.TURQUOISE5,
];

const engagement_labels = ["very unattentive", "slightly unattentive", "slightly engaged", "very engaged"];
const barChartOptions = (xAxesMax: number) => {
    return {
        legend: {
            display: false,
        },
        tooltips: {
            enabled: false,
        },
        scales: {
            xAxes: [
                {
                    ticks: {
                        min: 0,
                        max: xAxesMax,
                    },
                },
            ],
        },
    };
};

class WordCloud extends React.Component<{
    strongestLabels: string[],
    strongestFeatures: number[]
}> {
    private timeout: number = 0

    render() {
        const {strongestLabels, strongestFeatures} = this.props
        const TagStyle: any = {
            fontFamily: 'sans-serif',
            fontSize: 25,
            fontWeight: 'bold',
            fontStyle: 'italic',
            padding: 5,
            height: 100,
            width: '100%'
        }

        return <svg style={{ width:'40%', height:'40%' }} transform='scale(2)'>
            <text x={20} y={20} fontSize={20}
                  style={{
                      transform: 'rotate(90deg)',
                      transformOrigin: '20px 20px'
                  }} fill='black'>Voice activity</text>
            <text textAnchor='start' x={40} y={50} fontSize={30} style={{ fontWeight: 800 }} fill='darkblue'>Gesticulation</text>
            <text textAnchor='start' x={80} y={20} fontSize={20} style={{ fontWeight: 300 }} fill='darkred'>Smiling</text>
            <text textAnchor='start' x={80} y={70} fontSize={15} style={{ fontWeight: 300 }} fill='darkgreen'>Arms Crossed</text>
            <text textAnchor='start' x={50} y={85} fontSize={15} style={{ fontWeight: 300 }} fill='darkgray'>Head Rotation</text>
        </svg>
    }
}

export default WordCloud;
