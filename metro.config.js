const { getDefaultConfig } = require("expo/metro-config");
const { withNativeWind } = require("nativewind/metro");

/** @type {import('expo/metro-config').MetroConfig} */
const config = getDefaultConfig(__dirname);

// 1. Adiciona suporte a extensões de módulos mais recentes (Resolve o erro import.meta)
config.resolver.sourceExts.push("mjs", "cjs");

// 2. Intercepta bibliotecas conhecidas e as força para o formato compatível (CommonJS)
config.resolver.resolveRequest = (context, moduleName, platform) => {
  if (
    moduleName === "zustand" ||
    moduleName.startsWith("zustand/") ||
    moduleName === "jotai" ||
    moduleName.startsWith("jotai/")
  ) {
    return {
      filePath: require.resolve(moduleName),
      type: "sourceFile",
    };
  }

  // Para o resto das importações, usa o fluxo padrão do Metro
  return context.resolveRequest(context, moduleName, platform);
};

// 3. Aplica o wrapper do NativeWind no config modificado e exporta
module.exports = withNativeWind(config, { input: "./global.css" });
