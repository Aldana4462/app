import { create } from 'zustand'

const useStore = create((set) => ({
  brushColor: '#D7091A',
  brushSize: 5,
  setBrushColor: (color) => set({ brushColor: color }),
  setBrushSize: (size) => set({ brushSize: size }),
}))

export default useStore
