import "../styles/toggleButton.css"

const ToggleButton = ({ toggle, isToggled, name }) => {
    return (
        <label className="flex items-center cursor-pointer relative">
            <input type="checkbox" className="sr-only" onChange={toggle} name={name} checked={isToggled}/>
            <div className="toggle-bg bg-gray-400 border-2 border-gray-400 h-6 w-11 rounded-full"></div>
        </label>
    )
}

export default ToggleButton;