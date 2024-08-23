import { create } from "zustand";
import { persist , createJSONStorage} from "zustand/middleware";

export const useConfigurationStore = create(
  persist(
    (set) => ({
      configuration: null,
      setConfiguration: (newConfiguration) =>
        set({ configuration: newConfiguration }),
    }),
    {
      name: "configuration",
      storage: createJSONStorage(() => sessionStorage),
    }
  )
);