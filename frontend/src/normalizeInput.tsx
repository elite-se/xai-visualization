const normalizeInput = (inArr: number[], mins: number[], maxs: number[]) => {
    if (!(inArr.length === mins.length && inArr.length === maxs.length)) return inArr; //can't normalize with not equal length arrays
    const retArr = Array(inArr.length);
    for (let i = 0; i < inArr.length; i++) {
        retArr[i] = (inArr[i] - mins[i]) / (maxs[i] - mins[i]);
        if (retArr[i] < 0 || retArr[i] > 1)
            console.log(
                "Something went wrong during normalisation @index: " +
                i +
                ", value: " +
                inArr[i] +
                ", normalized: " +
                retArr[i]
            );
    }
    return retArr;
};


export default normalizeInput
