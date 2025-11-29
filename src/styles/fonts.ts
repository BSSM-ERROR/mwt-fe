import localFont from "next/font/local";

export const theJamsil = localFont({
    src: [
        {
            path: "../app/fonts/TheJamsil-Thin.otf",
            weight: "100",
            style: "normal",
        },
        {
            path: "../app/fonts/TheJamsil-Light.otf",
            weight: "300",
            style: "normal",
        },
        {
            path: "../app/fonts/TheJamsil-Regular.otf",
            weight: "400",
            style: "normal",
        },
        {
            path: "../app/fonts/TheJamsil-Medium.otf",
            weight: "500",
            style: "normal",
        },
        {
            path: "../app/fonts/TheJamsil-Bold.otf",
            weight: "700",
            style: "normal",
        },
        {
            path: "../app/fonts/TheJamsil-ExtraBold.otf",
            weight: "800",
            style: "normal",
        },
    ],
    variable: "--font-the-jamsil",
});
