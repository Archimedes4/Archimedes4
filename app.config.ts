import withAppleSettings, {
  Group,
  Switch,
  Title,
} from "@config-plugins/apple-settings";
import { ConfigContext, ExpoConfig } from "expo/config";

module.exports = ({ config }: ConfigContext): Partial<ExpoConfig> => {
  if (!config.plugins) config.plugins = [];

  config = withAppleSettings(config as ExpoConfig, {
    // The name of the .plist file to generate. Root is the default and must be provided.
    Root: {
      // The page object is required. It will be used to generate the .plist file.
      // The contents will be converted directly to plist.
      page: {
        // The `PreferenceSpecifiers` defines the UI elements to generate.
        PreferenceSpecifiers: [
          // Child panes can be used to create nested pages.
          Switch({
            title: "Show Login",
            key: "showing_login",
            value: false
          }),

          Group({
            title: "About",
            footerText: "Built by Andrew Mainella \nPowered by Expo 𝝠",
          }),
          Title({
            title: "Version",
            value: "",
            key: "p_app_version",
          })
        ],
      },
    } 
  });

  return config;
};