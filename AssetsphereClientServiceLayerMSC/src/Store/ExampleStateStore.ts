import { create } from "zustand";
import ExampleStateStoreInterface from "@/src/Store/Interface/ExampleStateStoreInterface.ts";


const useExampleStateStore = create<ExampleStateStoreInterface>((set) => ({
    message: "Hello, World!",
    setMessage: (message: string) => set({ message: message })
}))

export default useExampleStateStore;