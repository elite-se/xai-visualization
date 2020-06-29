export default () => {
    const hash = window.location.hash.substr(1);
    const params = hash.split('&').reduce((acc: any, item) => {
        const parts = item.split('=');
        acc[parts[0]] = parts[1];
        return acc;
    }, {});
    return params
}
