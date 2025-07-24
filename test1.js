// vehiclePrefillStore.ts

import { create } from 'zustand';
import { devtools, persist, createJSONStorage } from 'zustand/middleware';

export const initialValues = {
  vehiclePrefills: [],
};

type VehiclePrefillStore = {
  vehiclePrefills: any[];
  setVehiclePrefills: (data: any[]) => void;
};

const useVehiclePrefillStore = create<VehiclePrefillStore>()(
  devtools(
    persist(
      (set) => ({
        ...initialValues,
        setVehiclePrefills: (vehiclePrefills) =>
          set({ vehiclePrefills }, false, 'setVehiclePrefills'),
      }),
      {
        name: 'vehicle-prefills-store',
        storage: createJSONStorage(() => sessionStorage),
      }
    )
  )
);

export default useVehiclePrefillStore;
