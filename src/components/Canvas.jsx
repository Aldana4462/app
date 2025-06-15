/* eslint-disable */
import { useRef, useState, forwardRef, useImperativeHandle } from 'react'
import { Stage, Layer, Image as KonvaImage, Line } from 'react-konva'
import useStore from '../store/useStore'

const Canvas = forwardRef((props, ref) => {
  const stageRef = useRef(null)
  const [image, setImage] = useState(null)
  const [lines, setLines] = useState([])
  const { brushColor, brushSize } = useStore()

  const handleDrop = (e) => {
    e.preventDefault()
    const file = e.dataTransfer.files[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = () => {
      const img = new window.Image()
      img.src = reader.result
      img.onload = () => setImage(img)
    }
    reader.readAsDataURL(file)
  }

  const handleMouseDown = (e) => {
    if (e.evt.button !== 0) return
    const pos = e.target.getStage().getPointerPosition()
    setLines([...lines, { points: [pos.x, pos.y], color: brushColor, size: brushSize }])
  }

  const handleMouseMove = (e) => {
    if (lines.length === 0 || e.evt.buttons === 0) return
    const stage = e.target.getStage()
    const point = stage.getPointerPosition()
    const lastLine = lines[lines.length - 1]
    lastLine.points = lastLine.points.concat([point.x, point.y])
    lines.splice(lines.length - 1, 1, lastLine)
    setLines([...lines])
  }

  const preventDefault = (e) => e.preventDefault()

  useImperativeHandle(ref, () => ({
    toDataURL: (opts) => stageRef.current?.toDataURL(opts),
  }))

  return (
    <div
      className="border border-gray-700"
      onDrop={handleDrop}
      onDragOver={preventDefault}
    >
      <Stage
        ref={stageRef}
        width={500}
        height={500}
        onMouseDown={handleMouseDown}
        onMousemove={handleMouseMove}
      >
        <Layer>
          {image && <KonvaImage image={image} />}
          {lines.map((line, idx) => (
            <Line
              key={idx}
              points={line.points}
              stroke={line.color}
              strokeWidth={line.size}
              tension={0.5}
              lineCap="round"
              lineJoin="round"
            />
          ))}
        </Layer>
      </Stage>
    </div>
  )
}

export default Canvas
