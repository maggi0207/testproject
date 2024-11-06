import { fireEvent, render, screen } from '../../../modules/test-utils/renderHelper';
import Footer from '../Footer';
import rootReducer from '../../../modules/store/reducer';
import { rootSaga } from '../../../modules/store/saga';

jest.mock(
  'onevzsoemfeframework/AssistedCradleService',
  () => ({
    __esModule: true,
    default: jest.fn(() => ({})),
    getAssistedCradleProperty: () => ['TRUE'],
  }),
  { virtual: true },
);

let renderComponent;

describe('<Footer/>', () => {
  beforeAll(() => {
    window.mfe = { scmDeviceMfeEnable: true , isDark : true, acssThemeProps: {background: "#00000"}};
   renderComponent = (
      buttonLabel,
      callDeviceAddToCart,
      isCartBtnEnable,
      deviceFromCart,
      isDWOS,
      disableUpdateBtn,
      removeLines,
      isPromoEligible,
      enableBYODbtn,
    ) => {
      render(
        <Footer
          btnLabel={buttonLabel}
          callDeviceAddToCart={callDeviceAddToCart}
          isCartBtnEnable={isCartBtnEnable}
          deviceFromCart={deviceFromCart}
          isDWOS={isDWOS}
          disableUpdateBtn={disableUpdateBtn}
          removeLines={removeLines}
          isPromoEligible={isPromoEligible}
          enableBYODbtn={enableBYODbtn}
        />,
        {
          reducers: rootReducer,
          sagas: rootSaga,
        },
      );
    };
  });
  describe('button should be disabled if isCartBtnEnable is false', () => {
   
    const mockCallDeviceAddToCart = jest.fn();
    const mockCallRemoveLines = jest.fn();
    it("should test 'Add to Cart' button should be disabled", () => {
      renderComponent('Add to Cart', mockCallDeviceAddToCart, false, false, true, false, mockCallRemoveLines, false);
      expect(
        screen.getByRole('button', {
          name: /add to cart/i,
        }),
      ).toBeDisabled();
    });

    it("should test 'Ship It' button should be disabled", () => {
      renderComponent('Ship It', mockCallDeviceAddToCart, false, false, true, false, mockCallRemoveLines, false);
      expect(
        screen.getByRole('button', {
          name: /Ship It/i,
        }),
      ).toBeDisabled();
    });

    it("should test 'Find Stores' button should be disabled", () => {
      renderComponent('Find Stores', mockCallDeviceAddToCart, false, false, true, false, mockCallRemoveLines, false);
      expect(
        screen.getByRole('button', {
          name: /Find Stores/i,
        }),
      ).toBeDisabled();
    });
  });
  describe('button click should call the function', () => {
    beforeAll(() => {
      window.mfe = { scmDeviceMfeEnable: false , isDark : true, acssThemeProps: {background: "#00000"}};
    });
    it("should test function should be called on clicking the 'Add to Cart' button", () => {
      const mockCallDeviceAddToCart = jest.fn();
      const mockCallRemoveLines = jest.fn();
      renderComponent('Add to Cart', mockCallDeviceAddToCart, true, false, true, false, mockCallRemoveLines, true);
      fireEvent.click(
        screen.getByRole('button', {
          name: /add to cart/i,
        }),
      );
      expect(mockCallDeviceAddToCart).toBeCalled();
    });

    it("should test function should be called on clicking the 'Ship It' button", () => {
      const mockCallDeviceAddToCart = jest.fn();
      const mockCallRemoveLines = jest.fn();
      renderComponent('Ship It', mockCallDeviceAddToCart, true, false, true, false, mockCallRemoveLines, false);
      fireEvent.click(
        screen.getByRole('button', {
          name: /Ship It/i,
        }),
      );
      expect(mockCallDeviceAddToCart).toBeCalledTimes(0);
    });

    it("should test function should be called on clicking the 'BYOD' button", () => {
      const mockCallDeviceAddToCart = jest.fn();
      const mockCallRemoveLines = jest.fn();
      renderComponent('BYOD', mockCallDeviceAddToCart, true, false, true, false, true, mockCallRemoveLines);
      fireEvent.click(
        screen.getByRole('button', {
          name: /BYOD/i,
        }),
      );
      expect(mockCallDeviceAddToCart).toBeCalledTimes(0);
    });
    describe('button click should call the function', () => {
      it("should test function should be called on clicking the 'Remove' button", () => {
        const mockCallDeviceAddToCart = jest.fn();
        const mockCallRemoveLines = jest.fn();
        renderComponent('Add to Cart', mockCallDeviceAddToCart, true, true, false, mockCallRemoveLines, false);
        fireEvent.click(
          screen.getByRole('button', {
            name: /Remove/i,
          }),
        );
      });
    });
  });
  describe('test second number dfill', () => {
    beforeEach(() => {
      sessionStorage.setItem("isSecondNumDfill", true);
    })
    const mockCallDeviceAddToCart = jest.fn();
    const mockCallRemoveLines = jest.fn();

    it("should test 'Find Stores' button should be disabled", () => {
      renderComponent('Find Stores', mockCallDeviceAddToCart, false, false, true, false, mockCallRemoveLines, false);
      expect(
        screen.getByRole('button', {
          name: /Find Stores/i,
        }),
      ).toBeDisabled();
    });
  });
  
});

