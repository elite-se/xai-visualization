import {reduce} from "lodash"

const createInterpolator = (label: string, numberPoints: number) => {
    // quadratic bezier based on label
    let seed = reduce(label.split(''), (acc: number, char: string) => acc + char.charCodeAt(0), 0)
    const random = () => {
        const x = Math.sin(seed++) * 10000;
        return x - Math.floor(x);
    }
    const y = Array.from(Array(numberPoints).keys()).map(random)

    return (t: number) => {
        const firstPoint = Math.floor(t * numberPoints / 2) * 2
        const y0 = y[firstPoint]
        const y1 = y[firstPoint + 1]
        const y2 = y[firstPoint + 2]

        const t1 = (t - firstPoint / numberPoints) * numberPoints / 2
        return (y0 - 2 * y1 + y2) * t1 * t1 + (-2 * y0 + 2 * y1) * t1 + y0
    }
}

const loadEngagementData = () => {
    const sampleRate = 25
    const videoDuration = 596.503219 // BigBuckBunny
    const labels = [
        '0 Valence from Face (emax)',
        '1 face horizontal movement (emax)',
        '2 face vertical movement (emax)',
        '3 armscrossed',
        '4 headtouch',
        '5 distance left hand left hip',
        '6 distance right hand right hip',
        '7 left elbow y rotation',
        '8 right elbow y rotation',
        '9 hand in front of left hip',
        '10 hand in front of right hip',
        '11 left elbow x rotation',
        '12 right elbow x rotation',
        '13 standard deviation head x position',
        '14 standard deviation head x rotation',
        '15 voice activity',
        '16 Skeleton overall activation',
        '17 Skeleton energy global max'
    ]

    const numberSamples = Math.ceil(videoDuration * sampleRate)
    const numberPoints = Math.max(Math.floor(videoDuration / 5) * 2, 2) + 1 // Ca. alle 20 Sekunden neue Bezier Kurve

    const data: { input: number[], output: number[], explanations: number[] }[] = []

    const inputInterpolators = labels.map(label => createInterpolator('i' + label, numberPoints))
    const outputInterpolators = ['o0', 'o1', 'o2', 'o3'].map(label => createInterpolator(label, numberPoints))
    const explanationInterpolators = labels.map(label => createInterpolator('e' + label, numberPoints))

    for (let i = 0; i < numberSamples; i++) {
        const t = i / numberSamples
        const input = inputInterpolators.map(interpolate => interpolate(t))
        const output = outputInterpolators.map(interpolate => interpolate(t))
        const outputSum = output.reduce((acc, value) => acc + value, 0)
        const normalizedOutput = output.map(value => value / outputSum)
        const explanations = explanationInterpolators.map(interpolate => interpolate(t))

        data.push({input, output: normalizedOutput, explanations})
    }
    return {sampleRate, labels, data}
}

export default loadEngagementData;
