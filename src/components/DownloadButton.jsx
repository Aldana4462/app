
const DownloadButton = ({ stageRef }) => {
  const handleClick = () => {
    if (!stageRef.current) return
    const uri = stageRef.current.toDataURL({ pixelRatio: 1 })
    const link = document.createElement('a')
    link.download = 'image.png'
    link.href = uri
    link.click()
  }

  return (
    <button className="p-2 bg-red-600 text-white" onClick={handleClick}>
      Descargar
    </button>
  )
}

export default DownloadButton
