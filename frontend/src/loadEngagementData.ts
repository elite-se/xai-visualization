import { reduce } from "lodash"


const interpolate = (label: string, t: number) => {
    // quadratic bezier based on label
    let seed = reduce(label.split(''), (acc: number, char: string) => acc + char.charCodeAt(0), 0)
    const random = () => {
        const x = Math.sin(seed++) * 10000;
        return x - Math.floor(x);
    }
    const y0 = random()
    const y1 = random()
    const y2 = random()

    const y = (y0 - 2*y1 + y2) * t*t + (-2*y0 + 2*y1)*t + y0
    return y
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

    const data: { input: number[], output: number[], explanations: number[]}[] = []

    for(let i = 0; i < numberSamples; i++) {
        const t = i / numberSamples
        const input = labels.map(label => interpolate('i' + label, t))
        const output = ['o0', 'o1', 'o2', 'o3'].map(label => interpolate(label, t))
        const outputSum = output.reduce((acc, value) => acc + value, 0)
        const normalizedOutput = output.map(value => value / outputSum)
        const explanations = labels.map(label => interpolate('e' + label, t))

        data.push({ input, output: normalizedOutput, explanations })
    }
    return { sampleRate, labels, data }
}

export default loadEngagementData;
