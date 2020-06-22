import React from "react";


const CHART_COLOR_PALETTE = [
    'darkblue',
    'darkgreen',
    'darkviolett',
    'darkcyan',
    'darkgoldenrod',
    'darkgreen',
    'darkred',
    'darkslategray'
];

class WordCloud extends React.Component<{
    allLabels: string[],
    strongestLabels: string[],
    strongestFeatures: number[],
    maxExplanationValue: number
}> {
    render() {
        const {strongestLabels, strongestFeatures, maxExplanationValue, allLabels} = this.props


        return <svg style={{width: '40%', height: '40%'}} transform='scale(2)'>
            {
                allLabels.map((value, index) => {
                    const sortedIndex = strongestLabels.indexOf(value)
                    const scalar = sortedIndex > -1 ? strongestFeatures[sortedIndex] / maxExplanationValue : 0
                    if (sortedIndex === -1 || sortedIndex > 4) {
                        return <text key={value}
                                     fill={CHART_COLOR_PALETTE[index]}
                                     style={{
                                         transform: 'scale(0)',
                                         fontSize: '15px',
                                         opacity: 0,
                                         transition: '0.5s'
                                     }}>{value}</text>
                    } else if (sortedIndex === 0) {
                        return <text key={value}
                                     fill={CHART_COLOR_PALETTE[index]}
                                     style={{
                                         transform: 'translate(40px, 50px)',
                                         fontSize: `${15 + 20 * scalar}px`,
                                         fontWeight: 300 + 600 * scalar, transition: '0.5s'
                                     }}
                        >{value}</text>
                    } else if (sortedIndex === 1) {
                        return <text key={value}
                                     fill={CHART_COLOR_PALETTE[index]}
                                     style={{
                                         transform: 'translate(80px, 20px)',
                                         fontWeight: 300 + 600 * scalar,
                                         fontSize: `${15 + 20 * scalar}px`,
                                         transition: '0.5s'
                                     }}
                        >{value}</text>
                    } else if (sortedIndex === 2) {
                        return <text key={value}
                                     fill={CHART_COLOR_PALETTE[index]}
                                     style={{
                                         transform: 'rotate(90deg) translate(20px, 20px)',
                                         transformOrigin: '20px 20px',
                                         fontSize: `${15 + 20 * scalar}px`,
                                         fontWeight: 300 + 600 * scalar,
                                         transition: '0.5s'
                                     }}
                        >{value}</text>
                    } else if (sortedIndex === 3) {
                        return <text key={value}
                                     fill={CHART_COLOR_PALETTE[index]}
                                     style={{
                                         transform: 'translate(80px, 70px)',
                                         fontSize: `${15 + 20 * scalar}px`,
                                         fontWeight: 300 + 600 * scalar, transition: '0.5s'
                                     }}
                        >{value}</text>
                    } else if (sortedIndex === 4) {
                        return <text key={value}
                                     fill={CHART_COLOR_PALETTE[index]}
                                     style={{
                                         transform: 'translate(50px, 85px)',
                                         fontSize: `${15 + 20 * scalar}px`,
                                         fontWeight: 300, transition: '0.5s'
                                     }}
                        >{value}</text>
                    } else return null
                })
            }
        </ svg>
    }
}

export default WordCloud;
