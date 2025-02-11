const rspack = require("@rspack/core");
const refreshPlugin = require("@rspack/plugin-react-refresh");
const isDev = process.env.NODE_ENV === "development";

const path = require("path");
const deps = require("./package.json").dependencies;
console.log({ deps });
const { ModuleFederationPlugin } = require(
  "@module-federation/enhanced/rspack",
);

const name = "remote_demo";
const name1 = name + "1";
/**
 * @type {import('@rspack/cli').Configuration}
 */
module.exports = {
  entry: {
    main: "./src/index.tsx",
  },
  resolve: {
    extensions: ["...", ".ts", ".tsx", ".jsx"],
  },

  // devtool: "source-map",
  devServer: {
    port: 3002,
    hot: true,
    static: {
      directory: path.join(__dirname, "build"),
    },
    liveReload: false,
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, PATCH, OPTIONS",
      "Access-Control-Allow-Headers":
        "X-Requested-With, content-type, Authorization",
    },
  },
  optimization: { minimize: false },
  output: {
    path: __dirname + "/dist",
    uniqueName: name1,
    publicPath: "http://localhost:3002/",
    filename: "[name].js",
  },
  watch: true,
  module: {
    rules: [
      {
        test: /\.svg$/,
        type: "asset",
      },

      {
        test: /\.(ts|tsx)$/,
        exclude: /(node_modules|\.webpack)/,
        use: [
          {
            loader: "builtin:swc-loader",
            options: {
              sourceMap: true,
              jsc: {
                parser: {
                  syntax: "typescript",
                  tsx: true,
                },

                transform: {
                  react: {
                    runtime: "automatic",
                    development: isDev,
                    refresh: isDev,
                  },
                },
              },
              env: {
                targets: [
                  "chrome >= 87",
                  "edge >= 88",
                  "firefox >= 78",
                  "safari >= 14",
                ],
              },
            },
          },
        ],
      },
      {
        test: /\.css$/,
        use: [
          // Creates `style` nodes from JS strings
          "style-loader",
          // Translates CSS into CommonJS
          "css-loader",
          // Compiles Sass to CSS
          "sass-loader",
        ],
      },
    ],
  },
  // experiments: {
  //   lazyCompilation: {
  //     entries: true
  //   }
  // },
  plugins: [
    new rspack.DefinePlugin({
      "process.env.NODE_ENV": JSON.stringify(process.env.NODE_ENV),
    }),
    new rspack.ProgressPlugin({}),
    new rspack.CssExtractRspackPlugin({}),
    isDev && new rspack.HotModuleReplacementPlugin(),

    new rspack.HtmlRspackPlugin({
      template: "./index.html",
      excludedChunks: [name],
      filename: "index.html",
      inject: true,
      publicPath: "/",
    }),
    new ModuleFederationPlugin({
      name: name,
      filename: "remoteEntry.js",
      exposes: {
        "./Example": "./src/Example.tsx",
      },
      manifest: true,
      dev: {
        disableLiveReload: false,
      },
      shared: {
        "react": {
          singleton: true,
          requiredVersion: deps.react,
        },
        "react-dom": {
          singleton: true,

          requiredVersion: deps["react-dom"],
        },
        "@mantine/core": {
          singleton: true,
          requiredVersion: deps["@mantine/core"],
        },
        "@mantine/hooks": {
          singleton: true,
          requiredVersion: deps["@mantine/hooks"],
        },
      },
    }),
    isDev ? new refreshPlugin() : null,
  ].filter(Boolean),
};
