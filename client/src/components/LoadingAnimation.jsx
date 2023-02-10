import { useState, useEffect } from "react";

import Modal from "./Modal";

const LoadingAnimation = ({ action }) => {
    const [dots, setDots] = useState("");

    useEffect(() => {
        const i = setInterval(() => {
            setDots(prev => prev.length > 2 ? "" : prev + ".");
        }, 550);

        return () => clearInterval(i);
    }, []);

    return (
        <Modal center>
            <div className="w-fit lg:w-1/6 text-4xl font-bold bg-transparent whitespace-nowrap">
                {action} {dots}
            </div>
        </Modal>
    )
};

export default LoadingAnimation;