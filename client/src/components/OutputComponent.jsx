import { useRef } from "react";
import { useAppContext } from "../AppContext";

const OutputComponent = () => {
    const imageElement = useRef();

    const { resultImage } = useAppContext();

    return (
        <>
            { !resultImage &&
                <section className="rounded-md border-2 border-slate-300 p-2 flex justify-center
                    items-center hover:pointer h-96 w-full lg:w-1/3">
                </section>
            }
            { resultImage && (
                <a href={"/assets/" + resultImage} download="result.png" className="h-96 w-full lg:w-1/3">
                    <img src={"/assets/" + resultImage} ref={imageElement} title="download"
                        className="h-96 w-full rounded-md border-2 border-slate-300 cursor-pointer" />
                </a>
            )}
        </>
    )
};

export default OutputComponent;