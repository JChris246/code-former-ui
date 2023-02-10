import React, { useContext, useState } from "react";

const AppContext = React.createContext();
export const useAppContext = () => useContext(AppContext);

export const AppProvider = ({ children }) => {
    const [options, setOptions] = useState({ weight: 0.5, scale: 1, bgEnhance: false, faceUpsample: false });
    const [imageSrc, setImageSrc] = useState(null);
    const [resultImage, setResultImage] = useState(null);
    const [onGoingProcess, setOnGoingProcess] = useState({ id: null, active: false });

    return (
        <AppContext.Provider value={{ options, setOptions, imageSrc, setImageSrc,
            resultImage, setResultImage, onGoingProcess, setOnGoingProcess }}>
            { children }
        </AppContext.Provider>
    );
};