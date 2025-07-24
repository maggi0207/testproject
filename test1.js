// vehiclePrefillStore.test.ts

import useVehiclePrefillStore, { initialValues } from './vehiclePrefillStore';
import { renderHook, act } from '@testing-library/react-hooks';

describe('useVehiclePrefillStore', () => {
  beforeEach(() => {
    sessionStorage.clear();
  });

  it('should initialize with default values', () => {
    const { result } = renderHook(() => useVehiclePrefillStore());
    expect(result.current.vehiclePrefills).toEqual(initialValues.vehiclePrefills);
  });

  it('should update vehiclePrefills when setVehiclePrefills is called', () => {
    const { result } = renderHook(() => useVehiclePrefillStore());

    const testPrefills = [{ make: 'Toyota', model: 'Corolla' }];

    act(() => {
      result.current.setVehiclePrefills(testPrefills);
    });

    expect(result.current.vehiclePrefills).toEqual(testPrefills);
  });

  it('should persist state in sessionStorage', () => {
    const testPrefills = [{ make: 'Honda', model: 'Civic' }];

    const { result, rerender } = renderHook(() => useVehiclePrefillStore());

    act(() => {
      result.current.setVehiclePrefills(testPrefills);
    });

    rerender();

    const stored = JSON.parse(sessionStorage.getItem('vehicle-prefills-store') || '{}');
    expect(stored.state.vehiclePrefills).toEqual(testPrefills);
  });
});
