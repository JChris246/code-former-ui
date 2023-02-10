import { React, useState } from "react";

import Modal from "./Modal";

const AlertDialog = ({ handleClose, title, message, closeMessage="Okay" }) => {
    return (
        <Modal onClose={handleClose} center>
            <div id="alert-dialog" className="w-1/3 rounded-lg">
                <header className="p-2 flex justify-between items-center bg-stone-800 rounded-t-lg">
                    <span>{title}</span>
                    <span className="text-neutral-700 text-2xl hover:text-red-500 cursor-pointer"
                        onClick={handleClose}>&times;</span>
                </header>
                <main className="pt-4 px-4 bg-stone-600">{message}</main>
                <footer className="p-2 flex justify-end bg-stone-600 rounded-b-lg">
                    <button autoFocus onClick={handleClose}
                        className="bg-sky-700 px-2 py-1 rounded-md outline-none border-0">{closeMessage}</button>
                </footer>
            </div>
        </Modal>
    );
};

const useAlertDialog = () => {
    const [messageDialog, setMessageDialog] = useState({
        open: false,
        title: "",
        message: ""
    });

    return {
        display: args => setMessageDialog({ ...args, open: true }),
        ...messageDialog,
        close: () => {
            setMessageDialog({
                title: "",
                message: "",
                open: false
            });
        }
    };
};

export {
    AlertDialog,
    useAlertDialog
};