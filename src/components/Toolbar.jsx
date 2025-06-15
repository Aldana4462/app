import useStore from '../store/useStore'

const Toolbar = () => {
  const { brushColor, brushSize, setBrushColor, setBrushSize } = useStore()

  return (
    <div className="flex gap-2 p-2 bg-gray-800 text-white">
      <label className="flex items-center gap-1">
        Color
        <input
          type="color"
          value={brushColor}
          onChange={(e) => setBrushColor(e.target.value)}
        />
      </label>
      <label className="flex items-center gap-1">
        Size
        <input
          type="range"
          min="1"
          max="50"
          value={brushSize}
          onChange={(e) => setBrushSize(parseInt(e.target.value))}
        />
      </label>
    </div>
  )
}

export default Toolbar
