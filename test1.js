import useVehiclePrefillStore from './vehiclePrefillStore';
import { renderHook, act } from '@testing-library/react-hooks';

describe('Zustand vehiclePrefillStore', () => {
  beforeEach(() => {
    sessionStorage.clear();
    useVehiclePrefillStore.getState().reset(); // force store reset
  });

  it('should initialize with empty vehiclePrefills', () => {
    const { result } = renderHook(() => useVehiclePrefillStore());
    expect(result.current.vehiclePrefills).toEqual([]);
  });

  it('should update vehiclePrefills using setVehiclePrefills', () => {
    const { result } = renderHook(() => useVehiclePrefillStore());

    const testPrefills = [{ make: 'Tata', model: 'Nexon' }];

    act(() => {
      result.current.setVehiclePrefills(testPrefills);
    });

    expect(result.current.vehiclePrefills).toEqual(testPrefills);
  });

  it('should persist vehiclePrefills to sessionStorage', () => {
    const { result } = renderHook(() => useVehiclePrefillStore());

    const testPrefills = [{ make: 'Hyundai', model: 'i20' }];

    act(() => {
      result.current.setVehiclePrefills(testPrefills);
    });

    const persisted = JSON.parse(sessionStorage.getItem('vehicle-prefills-store'));
    expect(persisted?.state?.vehiclePrefills).toEqual(testPrefills);
  });
});
