export default class CreateAssetCON {
  // Element Locators (data-testid)
  public static readonly REGISTER_DEVICE_BUTTON: string = 'asset-inventory-register-device-button';
  public static readonly CREATE_FROM_SCRATCH_OPTION: string = 'asset-inventory-create-from-scratch-option';
  public static readonly DEVICE_NAME_INPUT: string = 'asset-form-device-name-input';
  public static readonly SERIAL_NUMBER_INPUT: string = 'asset-form-serial-number-input';
  public static readonly SUBMIT_BUTTON: string = 'asset-form-submit-button';

  // Backend Endpoint Fragment (for network response matching)
  public static readonly CREATE_ASSET_ENDPOINT_FRAGMENT: string = '/Api/V1/AssetInventory';

  // Expected Text
  public static readonly SUBMIT_BUTTON_LOADING_LABEL: string = 'Registering Device...';
  public static readonly SUCCESS_TOAST_TITLE: string = 'Device Registered Successfully';

  // The generated asset tag always follows this exact shape (AST-<number>) - see
  // AssetInventoryService.GenerateNextAssetTagAsync() on the backend.
  public static readonly ASSET_TAG_PATTERN: RegExp = /^AST-\d+$/;
}
