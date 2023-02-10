import ToggleButton from "./ToggleButton";
import { useAppContext } from "../AppContext";
import LoadingAnimation from "./LoadingAnimation";
import { AlertDialog, useAlertDialog } from "./AlertDialog";

const OptionsPanel = () => {
    const { options, setOptions, setImageSrc, imageSrc,
        setOnGoingProcess, onGoingProcess, setResultImage } = useAppContext();

    const dialog = useAlertDialog();

    const update = (e) => {
        const { name, value, checked } = e.target;

        if (value === "on" && checked !== undefined)
            setOptions({ ...options, [name]: checked });
        else setOptions({ ...options, [name]: value });
    }

    const clear = () => !onGoingProcess.active && setImageSrc(null);

    const enhance = () => {
        if (onGoingProcess.active)
            return;

        if (!imageSrc) {
            dialog.display({ title: "Error", message: "Please Upload an image to process" });
            return;
        }

        // TODO: add control option to toggle aligned option
        setOnGoingProcess({ id: null, active: true });
        fetch("/api/enhance", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                bgEnhance: options.bgEnhance,
                faceUpsample: options.faceUpsample,
                scale: options.scale,
                weight: options.weight,
                image: imageSrc
            })
        }).then(async (res) => {
            return { json: await res.json(), status: res.status }
        }).then(({ json, status }) => {
            if (!json) throw new Error("Job initiation failed");
            if (status !== 201 && status !== 200 && status !== 204) {
                dialog.display({ title: "Error", message: json.reason });
            } else {
                setResultImage(json.image)
            }
            setOnGoingProcess({ id: json.id, active: false });
        }).catch(e => {
            console.log(e);
            dialog.display({ title: "Error", message: e })
            setOnGoingProcess({ id: null, active: false });
        });
    };

    return (
        <section className="w-3/4 lg:w-1/4 h-fit rounded-md border-2 border-slate-300 lg:self-end">
            {onGoingProcess.active && <LoadingAnimation action="Processing"/>}
            { dialog.open ?
                <AlertDialog handleClose={dialog.close} title={dialog.title} message={dialog.message}/> : <></> }
            <div className="border-b-2 border-slate-300 p-2 flex">
                <ToggleButton toggle={update} isToggled={options.bgEnhance} name="bgEnhance"/>
                <span className="ml-2">Background Enhance</span>
            </div>
            <div className="border-b-2 border-slate-300 p-2 flex">
                <ToggleButton toggle={update} isToggled={options.faceUpsample} name="faceUpsample"/>
                <span className="ml-2">Face Upsample</span>
            </div>
            <div className="border-b-2 border-slate-300 p-2">
                <span className="ml-2">Up scale</span>
                <div className="flex items-center justify-between">
                    <input type="range" min={1} max={4} step={1} value={options.scale}
                        onChange={update} name="scale" className="w-2/3"/>
                    <span className="text-blue-500">{options.scale}</span>
                </div>
            </div>
            <div className="p-2">
                <span>Codeformer_Fidelity (0 for better quality, 1 for better identity)</span>
                <div className="flex items-center justify-between">
                    <input type="range" min={0} max={1} step={0.01} value={options.weight}
                        onChange={update} name="weight" className="w-2/3"/>
                    <span className="text-blue-500">{options.weight}</span>
                </div>
            </div>
            <div className="flex justify-between">
                <button onClick={clear} className="rounded-bl-md px-4 py-2 w-2/5 font-medium
                    bg-red-500">Clear</button>
                <button onClick={enhance} className="rounded-br-md px-4 py-2 w-2/5 font-medium bg-green-600">Enhance</button>
            </div>
        </section>
    );
};

export default OptionsPanel;