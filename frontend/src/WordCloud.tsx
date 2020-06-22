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
    strongestFeatures: number[]
}> {
    private timeout: number = 0

    render() {
        const {strongestLabels, strongestFeatures, allLabels} = this.props


        return <svg style={{width: '40%', height: '40%'}} transform='scale(2)'>
            {
                allLabels.map((value, index) => {
                    const sortedIndex = strongestLabels.indexOf(value)
                    if (sortedIndex === -1 || sortedIndex > 3) {
                        return <text key={value}
                                     fontSize={15}
                                     fill={CHART_COLOR_PALETTE[index]}
                                     style={{transform: 'scale(0)', opacity: 0, transition: '0.5s'}}>{value}</text>
                    } else if (sortedIndex === 0) {
                        return <text key={value}
                                     fontSize={30}
                                     fill={CHART_COLOR_PALETTE[index]}
                                     style={{transform: 'translate(40px, 50px)', fontWeight: 800, transition: '0.5s'}}
                        >{value}</text>
                    } else if (sortedIndex === 1) {
                        return <text key={value}
                                     fontSize={20}
                                     fill={CHART_COLOR_PALETTE[index]}
                                     style={{transform: 'translate(80px, 20px)', fontWeight: 300, transition: '0.5s'}}
                        >{value}</text>
                    } else if (sortedIndex === 2) {
                        return <text key={value}
                                     fontSize={20}
                                     fill={CHART_COLOR_PALETTE[index]}
                                     style={{
                                         transform: 'rotate(90deg) translate(20px, 20px)',
                                         transformOrigin: '20px 20px', fontWeight: 300, transition: '0.5s'
                                     }}
                        >{value}</text>
                    }
                    return null
                })
            }
            {false && <>
                <text
                    textAnchor='start'
                    fontSize={30}
                    style={
                        {
                            transform: 'translate(40px, 50px)',
                            fontWeight: 800
                        }
                    }
                    fill='darkblue'> Gesticulation
                </ text>
                <text
                    textAnchor='start'
                    fontSize={20}
                    style={
                        {
                            transform: 'translate(80px, 20px)',
                            fontWeight: 300
                        }
                    }
                    fill='darkred'> Smiling
                </ text>
            <text
                fontSize={20}
                style={
                    {
                        transform: 'rotate(90deg) translate(20px, 20px)',
                        transition: '0.5s',
                        transformOrigin: '20px 20px'
                    }
                }
                fill='black'> Voice
                activity
            </ text>
            <text
                textAnchor='start'
                fontSize={15}
                style={
                    {
                        transform: 'translate(80px, 70px)',
                        fontWeight: 300
                    }
                }
                fill='darkgreen'> Arms
                Crossed
            </ text>
            <text
                textAnchor='start'
                x={50}
                y={85}
                fontSize={15}
                style={
                    {
                        fontWeight: 300
                    }
                }
                fill='darkgoldenrod'> Head
                Rotation
            </ text>
            </>}
        </ svg>
    }
}

export default WordCloud;
