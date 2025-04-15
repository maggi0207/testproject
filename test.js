jest.mock('@vz-soe-utils/SigPad', () => {
  const b64 = 'data:image/png;base64,' + 'iVBORw0KGgoAAAANSUhEUgAAA7gAAACWCAYAAAD0dySAAA'.padEnd(6000, 'A');

  return {
    __esModule: true,
    default: ({ signatureHandler }) => (
      <div>
        <button
          type="button"
          data-testid="mocked-sigpad"
          onClick={() => signatureHandler(b64, true)}
        >
          sigpadMockBtn
        </button>
      </div>
    ),
  };
});
