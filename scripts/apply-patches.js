#!/usr/bin/env node
/*
  Apply necessary library patches after install to keep Android build working with RN 0.77.
  - react-native-maps: remove references to ViewManagerWithGeneratedInterface in generated interfaces
  - react-native-svg: adjust Yoga API from StyleSizeLength -> StyleLength
*/

const fs = require('fs');
const path = require('path');

function patchFile(filePath, transform) {
  if (!fs.existsSync(filePath)) return false;
  const original = fs.readFileSync(filePath, 'utf8');
  const updated = transform(original);
  if (updated !== original) {
    fs.writeFileSync(filePath, updated, 'utf8');
    return true;
  }
  return false;
}

function patchRNMaps(root) {
  const base = path.join(root, 'node_modules', 'react-native-maps', 'android', 'src', 'main', 'java', 'com', 'facebook', 'react', 'viewmanagers');
  const targets = [
    'RNMapsMapViewManagerInterface.java',
    'RNMapsUrlTileManagerInterface.java',
    'RNMapsWMSTileManagerInterface.java',
    'RNMapsMarkerManagerInterface.java',
    'RNMapsGooglePolygonManagerInterface.java',
    'RNMapsOverlayManagerInterface.java',
    'RNMapsPolylineManagerInterface.java',
    'RNMapsCalloutManagerInterface.java',
    'RNMapsCircleManagerInterface.java',
  ];
  let changed = 0;
  for (const file of targets) {
    const full = path.join(base, file);
    const did = patchFile(full, (s) => {
      let t = s.replace(/\nimport\s+com\.facebook\.react\.uimanager\.ViewManagerWithGeneratedInterface;\n/, '\n');
      t = t.replace(/extends\s+ViewManagerWithGeneratedInterface\s*\{/, '{');
      return t;
    });
    if (did) changed++;
  }
  if (changed > 0) {
    console.log(`[postinstall] Patched react-native-maps interfaces (${changed} files).`);
  }
  // Patch CMakeLists to support RN < 0.80 where target_compile_reactnative_options is missing
  const cmakePath = path.join(root, 'node_modules', 'react-native-maps', 'android', 'src', 'main', 'jni', 'CMakeLists.txt');
  patchFile(cmakePath, (s) => {
    const needle = 'target_compile_reactnative_options(react_codegen_RNMapsSpecs PRIVATE)';
    if (s.includes(needle) && !s.includes('COMMAND target_compile_reactnative_options')) {
      return s.replace(
        needle,
        [
          '# Use React Native\'s helper macro when available (RN >= 0.80). Fallback to standard flags otherwise.',
          'if(COMMAND target_compile_reactnative_options)',
          '  target_compile_reactnative_options(react_codegen_RNMapsSpecs PRIVATE)',
          'else()',
          '  target_compile_options(',
          '    react_codegen_RNMapsSpecs',
          '    PRIVATE',
          '    -fexceptions',
          '    -frtti',
          '    -std=c++20',
          '    -Wall',
          '  )',
          'endif()',
        ].join('\n')
      );
    }
    return s;
  });
}

function patchRNSVG(root) {
  const cppFile = path.join(root, 'node_modules', 'react-native-svg', 'common', 'cpp', 'react', 'renderer', 'components', 'rnsvg', 'RNSVGLayoutableShadowNode.cpp');
  const did = patchFile(cppFile, (s) => s.replaceAll('StyleSizeLength', 'StyleLength'));
  if (did) {
    console.log('[postinstall] Patched react-native-svg Yoga API (StyleSizeLength -> StyleLength).');
  }
}

function main() {
  const root = process.cwd();
  try {
    patchRNMaps(root);
  } catch (e) {
    console.warn('[postinstall] Failed to patch react-native-maps:', e?.message || e);
  }
  try {
    patchRNSVG(root);
  } catch (e) {
    console.warn('[postinstall] Failed to patch react-native-svg:', e?.message || e);
  }
}

main();
