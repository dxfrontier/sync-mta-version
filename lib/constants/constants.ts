export const constants = {
  UTF_8: 'utf8' as const,
  PACKAGE: 'package.json' as const,

  MESSAGES: {
    SUCCESS: "The version in 'mta.yaml' has been successfully updated.",
    SUCCESS_EXTENSIONS: 'The extensions have been updated successfully.',
    FAIL: "Failed to update the version in 'mta.yaml'. Please check the file and try again.",
  },
};
