import { useState, useRef } from "react";
import Router from "next/router";

import LoadingAnimation from "./LoadingAnimation";
import { AlertDialog, useAlertDialog } from "./AlertDialog";

const UploadButton = () => {
    const input = useRef();
    const [uploading, setUploading] = useState(false);
    const dialog = useAlertDialog();

    const selectFile = e => {
        const { target: { files } } = e

        const body = new FormData();
        body.append("video", files[0]);

        setUploading(true);
        fetch("/api/upload", { method: "POST", body })
        .then(async (res) => {
            setUploading(false);
            return { json: await res.json(), status: res.status }
        }).then(({ json, status }) => {
            if (!json) throw new Error("Upload Failed");
            if (status !== 201 && status !== 200)
                dialog.display({ title: "Error", message: json.msg });
            else Router.replace({ pathname: "/studio/" + json.id });
        }).catch(e => {
            console.log(e);
            dialog.display({ title: "Error", message: e })
        });
    }

    return (
        <>
            {uploading && <LoadingAnimation action="Uploading"/>}
            { dialog.open ?
                <AlertDialog handleClose={dialog.close} title={dialog.title} message={dialog.message}/> : <></> }
            <button onClick={() => input.current.click()} className="capitalize px-5 lg:px-10 py-3 lg:py-6 text-xl
                lg:text-2xl text-neutral-100 bg-sky-500 rounded-full hover:shadow-sm hover:shadow-sky-600
                hover:scale-[.98]">upload your video</button>
            <input type="file" accept="video/*" className="hidden" onChange={selectFile} ref={input} />
        </>
    )
};

export default UploadButton;