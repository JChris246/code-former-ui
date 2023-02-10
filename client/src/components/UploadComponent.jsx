import { useState, useRef } from "react";

import LoadingAnimation from "./LoadingAnimation";
import { AlertDialog, useAlertDialog } from "./AlertDialog";
import { useAppContext } from "../AppContext";

const UploadComponent = () => {
    const input = useRef();
    const uploadBox = useRef();
    const imageElement = useRef();

    const dialog = useAlertDialog();

    const [uploading, setUploading] = useState(false);
    const { imageSrc, setImageSrc } = useAppContext();

    const upload = (image) => {
        const body = new FormData();
        body.append("image", image);

        setUploading(true);
        fetch("/api/transfer", { method: "POST", body })
            .then(async (res) => {
                return { json: await res.json(), status: res.status }
            }).then(({ json, status }) => {
                if (!json) throw new Error("Upload Failed");
                if (status !== 201 && status !== 200)
                    dialog.display({ title: "Error", message: json.msg });
                else
                    setImageSrc(json.id);
                setUploading(false);
            }).catch(e => {
                console.log(e);
                setUploading(false);
                dialog.display({ title: "Error", message: e })
            });
    }

    const selectFile = e => {
        const { target: { files } } = e;

        upload(files[0]);
    }

    const handleDragOver = (e) => {
        e.preventDefault();
        uploadBox?.current?.classList.add("border-sky-300");
    }

    const handleDragLeave = () => uploadBox?.current?.classList.remove("border-sky-300");
    const handleDrop = (e) => {
        e.preventDefault();

        const image = e.dataTransfer.files[0];
        const type = image.type;

        if (type.match(/image\//)) {
            upload(image);
        } else {
            uploadBox?.current?.classList.remove("border-sky-300")
            return false;
        }
    }

    return (
        <>
            {uploading && <LoadingAnimation action="Uploading"/>}
            { dialog.open ?
                <AlertDialog handleClose={dialog.close} title={dialog.title} message={dialog.message}/> : <></> }
            { !imageSrc &&
                <section onClick={() => input.current.click()} ref={uploadBox} onDragOver={handleDragOver}
                    onDragLeave={handleDragLeave} onDrop={handleDrop} className="rounded-md border-2 border-dashed
                    border-slate-300 p-2 flex justify-center items-center hover:cursor-pointer h-96 w-full lg:w-1/3">
                    <input type="file" accept="image/*" className="hidden" onChange={selectFile} ref={input} />
                    <div className="flex flex-col items-center space-y-2">
                        <span className="capitalize">Drop image here</span><br/>
                        <span className="text-slate-400">| or |</span><br/>
                        <span className="capitalize">Click to Upload</span><br/>
                    </div>
                </section>
            }
            { imageSrc && <img src={"/assets/" + imageSrc} ref={imageElement}
                className="h-96 w-full lg:w-1/3 rounded-md border-2 border-slate-300" /> }
        </>
    )
};

export default UploadComponent;