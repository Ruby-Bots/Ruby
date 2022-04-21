
export const NumberFormatter = (num: number) => {
    return Intl.NumberFormat().format(num);
}