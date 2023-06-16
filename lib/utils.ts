export const rgba = (color: string, opacity: number) : string => {
    return color.replace('1)', opacity.toString() + ')');
}