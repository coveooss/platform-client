// TODO: Put this interface somewhere else
export interface IDiffOptions {
  /**
   * Specify which key to ignore during the Diff action. This is useful when a key always changes from one Org to the other.
   * For instance id, createdDate, versionId, ...
   */
  keysToIgnore?: string[];
  /**
   * Specify which key to use for the Diff action. When defined, this option override the "keysToIgnore" option
   */
  includeOnly?: string[];
  /**
   * Prevent the diff result to be opened in a file once the operation has complete
   */
  silent?: boolean;
  /**
   * Specify the sources from which to load the data
   */
  sources?: string[];
  /**
   * If specified the diff operation will grab the origin data from the specified upload file instead of the Coveo Cloud Platform.
   * This option is used to upload a resource to the platform.
   */
  originData?: Array<{}>;
}
