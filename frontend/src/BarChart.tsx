import React from "react";
import {HorizontalBar} from "react-chartjs-2";
import {ENGAGEMENT_NEGATIVE_COLOR_PALETTE, ENGAGEMENT_POSITIVE_COLOR_PALETTE,} from "./EngagementDefinitions";
import createBarChartOptions from "./createBarChartOptions";
import {ResizeSensor} from "@blueprintjs/core";
import styled from "styled-components";
import {StrongestOutputExplanationsType} from "./sortAndSelectTopmostFeatures";

type PropsType = {
    strongestOutputExplanations: StrongestOutputExplanationsType,
    strongestOutputIdx: number,
    maxExplanationValue: number
}

const StyledChart = styled(HorizontalBar)`
  position: absolute;
  top: 0;
  left: 0;
`

class BarChart extends React.Component<PropsType, { width: number, height: number }> {

    state = {width: 0, height: 0}

    handleResize = (entries: any) => this.setState({
        width: entries[0].contentRect.width,
        height: entries[0].contentRect.height
    })

    render() {
        const {strongestOutputIdx, strongestOutputExplanations, maxExplanationValue} = this.props
        const {width, height} = this.state
        const colorPalette = strongestOutputIdx < 2 ? ENGAGEMENT_NEGATIVE_COLOR_PALETTE : ENGAGEMENT_POSITIVE_COLOR_PALETTE;

        return <ResizeSensor onResize={this.handleResize}>
            <div style={{width: '100%', height: '100%', position: 'relative'}}>
                <StyledChart
                    width={width}
                    height={height}
                    data={{
                        labels: strongestOutputExplanations.topMostLabels,
                        datasets: [
                            {
                                label: "Testing Explanations",
                                backgroundColor: colorPalette,
                                data: strongestOutputExplanations.topMostExplanations,
                            },
                        ],
                    }}
                    options={createBarChartOptions(maxExplanationValue)}/>
            </div>
        </ResizeSensor>
    }
}

export default BarChart
