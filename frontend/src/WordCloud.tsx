import React from "react";
import styled from "styled-components";
import {Colors} from "@blueprintjs/core";
import TagCloud from "react-tag-cloud";

const Container = styled.div`
    position: relative;
    flex-grow: 1;

    display: flex;
    flex-direction: column;
    align-items: center;

    box-sizing: border-box;
    padding: 12px 8px;
`;

const Heading = styled.h3`
    margin: 0 0 6px 0;
    text-transform: uppercase;
    transition: 0.2s filter linear, 0.2s -webkit-filter linear;
`;

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

const CustomTagCloud: any = styled(TagCloud)`
  transition: 0.5s;
`

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

        return <svg width='100%' height='100%'>
            <text textAnchor='start' x={40} y={50} fontSize={30} style={{ fontWeight: 800 }} fill='dark-blue'>Gesticulation</text>
            <text x={35} y={20} fontSize={20}
                  style={{
                      transform: 'rotate(90deg)',
                      transformOrigin: '20px 20px'
                  }}>Voice activity</text>
            <text textAnchor='start' x={80} y={20} fontSize={20} style={{ fontWeight: 300 }}>Smiling</text>
        </svg>
    }
}

export default WordCloud;
