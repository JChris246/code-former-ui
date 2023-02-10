import UploadComponent from "./components/UploadComponent";
import OptionsPanel from "./components/OptionsPanel";
import OutputComponent from "./components/OutputComponent";

import { AppProvider } from "./AppContext";

function App() {
    return (
        <div className="w-screen flex flex-col lg:flex-row justify-between items-center space-y-2">
            <AppProvider>
                <UploadComponent/>
                <OptionsPanel/>
                <OutputComponent/>
            </AppProvider>
        </div>
    )
}

export default App
