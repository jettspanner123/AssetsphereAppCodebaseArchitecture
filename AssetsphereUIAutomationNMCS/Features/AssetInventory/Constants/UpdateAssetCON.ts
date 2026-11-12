export default class UpdateAssetCON {
  // Element Locators (data-testid)
  public static readonly DETAIL_EDIT_BUTTON: string = 'asset-detail-edit-button';

  // Backend Endpoint Fragment (for network response matching)
  public static readonly UPDATE_ASSET_ENDPOINT_FRAGMENT: string = '/Api/V1/AssetInventory/';

  // Expected Text
  public static readonly SUBMIT_BUTTON_LOADING_LABEL: string = 'Saving Specs...';
  public static readonly SUCCESS_TOAST_TITLE: string = 'Asset Updated Successfully';
}
