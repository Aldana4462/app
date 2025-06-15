import Canvas from '../components/Canvas'
import Toolbar from '../components/Toolbar'
import DownloadButton from '../components/DownloadButton'
import { useRef } from 'react'

const Editor = () => {
  const stageRef = useRef(null)
  return (
    <div className="min-h-screen flex flex-col items-center bg-neutral-900 text-white p-4 gap-4">
      <h1 className="text-2xl">Photoshop Lite</h1>
      <Toolbar />
      <Canvas ref={stageRef} />
      <DownloadButton stageRef={stageRef} />
      <p className="text-sm opacity-75">Arrastra una imagen sobre el lienzo para comenzar.</p>
    </div>
  )
}

export default Editor
