/**
 * Copyright 2016 Google Inc. All rights reserved.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
*/

// DO NOT EDIT THIS GENERATED OUTPUT DIRECTLY!
// This file should be overwritten as part of your build process.
// If you need to extend the behavior of the generated service worker, the best approach is to write
// additional code and include it using the importScripts option:
//   https://github.com/GoogleChrome/sw-precache#importscripts-arraystring
//
// Alternatively, it's possible to make changes to the underlying template file and then use that as the
// new base for generating output, via the templateFilePath option:
//   https://github.com/GoogleChrome/sw-precache#templatefilepath-string
//
// If you go that route, make sure that whenever you update your sw-precache dependency, you reconcile any
// changes made to this original template file with your modified copy.

// This generated service worker JavaScript will precache your site's resources.
// The code needs to be saved in a .js file at the top-level of your site, and registered
// from your pages in order to be used. See
// https://github.com/googlechrome/sw-precache/blob/master/demo/app/js/service-worker-registration.js
// for an example of how you can register this script and handle various service worker events.

/* eslint-env worker, serviceworker */
/* eslint-disable indent, no-unused-vars, no-multiple-empty-lines, max-nested-callbacks, space-before-function-paren, quotes, comma-spacing */
'use strict';

var precacheConfig = [["bunfig.toml","4eb5415d0ae46d3b26f4df1a74c92175"],["components.json","9b2288181518d24505c3926ab97b5d00"],["dist/assets/about-CIToco-O.js","5504bea2406733493952035fb5e061a7"],["dist/assets/emails-Ct6ivJnv.js","1a34f31abfe2026dd2b2b0cab060a985"],["dist/assets/index-BQr293OH.js","12f19263fc319d35471a39ec954d3804"],["dist/assets/index-Cdq_J-Wl.js","22330e990a87d0f92e1b43a5f76335a1"],["dist/assets/login-Cn7M4C9J.js","d92c355a56a4375c8ca6951aaeeeccb6"],["dist/assets/register-Dni2UoOo.js","021d44470564de480281d90e22387a57"],["dist/assets/route-Bgu02YJe.js","7584effacbb38740b3a62ac4dbdbe8aa"],["dist/index.html","a93f04f44a6924c60db4e2f6f952bcc2"],["index.html","0f1a8a6678f14f08f107b36b17b53c42"],["manifest.json","279b9a6228ba8ef707d81f3912e85079"],["node_modules/@base-ui/react/CHANGELOG.md","d70fb34c1158758830e4a2ac46a84b37"],["node_modules/@base-ui/react/README.md","898c825b00480164afdeb2b9f05c4fda"],["node_modules/@base-ui/react/global.d.ts","1daea9f03f1c283f198ba37fae34557b"],["node_modules/@base-ui/react/index.d.ts","05d771423da073212ba5e5c54d4265a6"],["node_modules/@base-ui/react/index.js","2726a1ba4e379c8b436a793ef1f1b38e"],["node_modules/@base-ui/react/package.json","e91db871aee281b265eec0a0a17d2b43"],["node_modules/@elysiajs/eden/README.md","40a9d9180406e51545677d615b4616d3"],["node_modules/@elysiajs/eden/bun.lock","83eec5acd5a6bb84572756ec56e04f58"],["node_modules/@elysiajs/eden/bunfig.toml","d48c3513a044a34cb2d47cd0f648e4a4"],["node_modules/@elysiajs/eden/package.json","affafbd524a3db4ef3889fc29e2e724c"],["node_modules/@fontsource-variable/geist/CHANGELOG.md","debfbc0539e694e240a68192be06c254"],["node_modules/@fontsource-variable/geist/README.md","34b14ed96e39cc11e233a9192936d698"],["node_modules/@fontsource-variable/geist/index.css","b99b999430f6cd871ba5bacef9ed94ab"],["node_modules/@fontsource-variable/geist/metadata.json","2ebebe5e20c090e24e68828a2854337b"],["node_modules/@fontsource-variable/geist/package.json","1eed78c3f84d94ba142e0f3725729039"],["node_modules/@fontsource-variable/geist/unicode.json","973a4bd7667c71768c8220c35b2428cc"],["node_modules/@fontsource-variable/geist/wght.css","b99b999430f6cd871ba5bacef9ed94ab"],["node_modules/@passwordless-id/webauthn/README.md","d90d4ad4b7d1d832609b0a309e657a32"],["node_modules/@passwordless-id/webauthn/package.json","9db205e26c82312f152ee2d0a4cb068d"],["node_modules/@tailwindcss/vite/README.md","62992f3739ec677f183b109626b19161"],["node_modules/@tailwindcss/vite/package.json","20b3bad6c87714905a5d8bcbbc84a943"],["node_modules/@tanstack/react-query/README.md","8d2a83137714fc5d67ba0e8503cf01d3"],["node_modules/@tanstack/react-query/package.json","d582eaa9f953a36ea56b6bcfe1b1c631"],["node_modules/@tanstack/react-router-devtools/README.md","6ab89b217fd55eefd04bfd8dfb2a9922"],["node_modules/@tanstack/react-router-devtools/package.json","97332ad6d93c3a7299bf81d8df17d5b0"],["node_modules/@tanstack/react-router/README.md","a2d6ac6378cf171e971fbbc5f0bf8127"],["node_modules/@tanstack/react-router/package.json","2e8417b19dba5845003e869845c95e44"],["node_modules/@tanstack/router-plugin/README.md","f3fbdd378a045c454cc644f1d0e61000"],["node_modules/@tanstack/router-plugin/package.json","1ec4c0d38a46f8cfcf43a25dbe8abedc"],["node_modules/@types/bun/README.md","a2b0ec3683bc87934b58e3cd3fab5534"],["node_modules/@types/bun/index.d.ts","71c101ae9fdcae9a685889d46043b2b7"],["node_modules/@types/bun/package.json","7b2c832991f4615868131b74de406f73"],["node_modules/@types/react-dom/README.md","dadac90b583ae3b3aeb68b878da7b664"],["node_modules/@types/react-dom/canary.d.ts","d17b81bd653dfc2baaca24a38894454c"],["node_modules/@types/react-dom/client.d.ts","c07675f3db8e001ce71e8e866c3dbadc"],["node_modules/@types/react-dom/experimental.d.ts","cd70358e04fbd8d92fb25d3a553fd8d6"],["node_modules/@types/react-dom/index.d.ts","ec5be6d45de60103655f6d4ed326c0d4"],["node_modules/@types/react-dom/package.json","5d6a4d24d33ef8c655c9c359a93111a0"],["node_modules/@types/react-dom/server.browser.d.ts","a1bb17042905c70c51f2adb649e02190"],["node_modules/@types/react-dom/server.bun.d.ts","a1bb17042905c70c51f2adb649e02190"],["node_modules/@types/react-dom/server.d.ts","79163ef1878d340266912960bdbebf98"],["node_modules/@types/react-dom/server.edge.d.ts","b85e1b5c75832138920f3584d8b65e46"],["node_modules/@types/react-dom/server.node.d.ts","5f61f7c52e31d684afdf6efdb8ca1cd7"],["node_modules/@types/react-dom/static.browser.d.ts","44bc70e3ba0c9279ba7b66b7b51bc3ce"],["node_modules/@types/react-dom/static.d.ts","b2f520c51c29ae1956e2dceb0fe3336e"],["node_modules/@types/react-dom/static.edge.d.ts","7aeaa1a645aa87e5e396372401151e87"],["node_modules/@types/react-dom/static.node.d.ts","57ba1bf8391dd851537a0312c2b86dbb"],["node_modules/@types/react/README.md","379871e555b73e1c3f767be472b48a6c"],["node_modules/@types/react/canary.d.ts","911474462f360d799881c316ee73b41d"],["node_modules/@types/react/compiler-runtime.d.ts","6c140be154884d299aeabb12f457e1e8"],["node_modules/@types/react/experimental.d.ts","e77329d7dc7f378107e5993a9407bc88"],["node_modules/@types/react/global.d.ts","e975b2e8092a903167d3678272c115c2"],["node_modules/@types/react/index.d.ts","e3cdaa2b095c5b1cc0620dc1321a51ee"],["node_modules/@types/react/jsx-dev-runtime.d.ts","137a9ef2b4714cad78e24b81d57197ac"],["node_modules/@types/react/jsx-runtime.d.ts","cf6089761ba0fc65b82a0ae4f2c27807"],["node_modules/@types/react/package.json","5713d3febfb0cfece25cc2821bbe28ef"],["node_modules/@vitejs/plugin-react/README.md","9de7f2a22f7c0e5a7fef16e0780c871d"],["node_modules/@vitejs/plugin-react/package.json","42a94c4dc077c78227b6ea6e5c639bec"],["node_modules/class-variance-authority/README.md","2a25709da5bd3217d1965f383d86f952"],["node_modules/class-variance-authority/package.json","38424572b9cb56b024499be3d217b895"],["node_modules/clsx/clsx.d.mts","39488579e7722f5a56a239effb208d76"],["node_modules/clsx/clsx.d.ts","7a264dddd23a86489f48b4b9ecf61a28"],["node_modules/clsx/package.json","3eef1ff52390c520ce8024db2d856976"],["node_modules/clsx/readme.md","4011b56c596088db4be1b85268e93b95"],["node_modules/elysia/README.md","d707004328e0e2969c88b3183d27c130"],["node_modules/elysia/bunfig.toml","d48c3513a044a34cb2d47cd0f648e4a4"],["node_modules/elysia/knip.json","74aa413aa91351b326126f9e48332c6e"],["node_modules/elysia/package.json","2298b81982a7f7b6109423e49e7ab16e"],["node_modules/esbuild/LICENSE.md","46b907b175628fe6d2a5258b252970fa"],["node_modules/esbuild/README.md","4c83bfb5e79b2207a8ae09c3c0e72ac6"],["node_modules/esbuild/install.js","8ea4dbebe081ebb5d5eafac67c46f489"],["node_modules/esbuild/package.json","c0eba4c5bc265ed58a7d4e6be0d4d674"],["node_modules/fp-ts/CHANGELOG.md","cf33031575db4c94f9ad51aeccf04805"],["node_modules/fp-ts/HKT.d.ts","4d634a1010513f6cebcce574d8f83094"],["node_modules/fp-ts/README.md","9743cca3e5b8801816ac46452903838d"],["node_modules/fp-ts/package.json","b93e87eb0d03af0d2410cf5386c6d0c4"],["node_modules/lucide-react/README.md","4306e02585e55a5dc32e335c93698512"],["node_modules/lucide-react/dynamic.mjs","88561ff99c283db65bc0834f0a3fe6d6"],["node_modules/lucide-react/dynamicIconImports.mjs","3b4aebfea9821fff3e2fd1a3bb2bc705"],["node_modules/lucide-react/package.json","8b3e1a113cd3af03cb7fbdd364c2fc60"],["node_modules/playwright/README.md","5fdb639aae7a0eefcddc9e15fd248226"],["node_modules/playwright/ThirdPartyNotices.txt","fbd287e0a6cc20525dfc8203233c375a"],["node_modules/playwright/cli.js","73e0c66536804f3d101d1b252dbe7adf"],["node_modules/playwright/index.d.ts","79bf576dd0d96c1adf97c61b978eaf9d"],["node_modules/playwright/index.js","54274a8dfc001f9115e51b4f08378594"],["node_modules/playwright/index.mjs","748457b0fdd629defe49cb604bc634e2"],["node_modules/playwright/jsx-runtime.js","1a2024257ba7ccfcd2a0d3565ccb4d61"],["node_modules/playwright/jsx-runtime.mjs","51a6b01e8ff6d0b98e5bb3956c072c7b"],["node_modules/playwright/package.json","7ffaf1ee98a5a46ca987e2e18fbc0a30"],["node_modules/playwright/test.d.ts","46633d7cf25f3ea2f3c608415919a159"],["node_modules/playwright/test.js","c040114b14f8328a13adc33efc53be31"],["node_modules/playwright/test.mjs","63a5c27709dd3e866c28b51b076ef469"],["node_modules/react-dom/README.md","1fe1068674381170aca7393c6e415999"],["node_modules/react-dom/client.js","b5a63b01cd05b5cb18f1164bdbec0dce"],["node_modules/react-dom/client.react-server.js","b3061e52cfea62dc95181cf954a8ac84"],["node_modules/react-dom/index.js","e27dfb7c9921a1ef5148451c029f83d6"],["node_modules/react-dom/package.json","8b6e03247672b6ddbaf50c47b4d732db"],["node_modules/react-dom/profiling.js","39c750932599569c18fc5257658318e9"],["node_modules/react-dom/profiling.react-server.js","1e3292779671ab124c0ea358fe0d5e13"],["node_modules/react-dom/react-dom.react-server.js","cadbd02a910da58865897d4fe87a4c69"],["node_modules/react-dom/server.browser.js","1e5989c484d05ba5798f55756ae0eedb"],["node_modules/react-dom/server.bun.js","e4cba928dfd035b80b6cc960aafa7602"],["node_modules/react-dom/server.edge.js","81d1bd582523b9a249afc19fd3dcecfe"],["node_modules/react-dom/server.js","0cf749c95652f96a52685ef80339714a"],["node_modules/react-dom/server.node.js","54c8dacad4b63c0c96cd0421976d3b3d"],["node_modules/react-dom/server.react-server.js","f5de911bce5e8512739c384fe6d12ce2"],["node_modules/react-dom/static.browser.js","e8b0216e07432e30ef92e885df3439ae"],["node_modules/react-dom/static.edge.js","f537e70ae2d9a7635ff4da6f67f8143e"],["node_modules/react-dom/static.js","d364d4807c7c4772e744b516c3fa6fe9"],["node_modules/react-dom/static.node.js","1ae866a440b82dabc22cc79c3bf5acb5"],["node_modules/react-dom/static.react-server.js","e39c844ddcedd6f078772168597117e6"],["node_modules/react-dom/test-utils.js","57b2070a20bbc57697a3503a699d2f5e"],["node_modules/react/README.md","495d6f673af642bd34461e71d4ec6b13"],["node_modules/react/compiler-runtime.js","92bb40e60fd983ea36bbd6707fc611c9"],["node_modules/react/index.js","9f7b2b764b4ef21787ed1f4395e90cbe"],["node_modules/react/jsx-dev-runtime.js","f3106154b94cff81d09f5b7bc46cb4ae"],["node_modules/react/jsx-dev-runtime.react-server.js","a8344ccd6d1fc4d5c62fd1143760115a"],["node_modules/react/jsx-runtime.js","60b1b7ea8fb7e7f92947ec81fa527ca3"],["node_modules/react/jsx-runtime.react-server.js","a6555a8a4db57e31fe0546d2ec001c9a"],["node_modules/react/package.json","e05bd04ae5483aa50c3f2e073aeaac0e"],["node_modules/react/react.react-server.js","620fc3d1746bfda3b83dc8899823b300"],["node_modules/shadcn/LICENSE.md","9f105662f30667e1325f917cff4cfeb6"],["node_modules/shadcn/README.md","fedf59b3b7ffc95f1f2bcf8507ea0696"],["node_modules/shadcn/package.json","34f3c5292f066f13a37e9bdb57c0b0d7"],["node_modules/tailwind-merge/LICENSE.md","777b1252a1cc8d8673cfa951be0a22d8"],["node_modules/tailwind-merge/README.md","46ec1622321a5ed82e180bba52fc6857"],["node_modules/tailwind-merge/package.json","685690d7b6db5578e60d973f543024fb"],["node_modules/tailwindcss/README.md","75517e5585179f0caa41ec176d6a1ce2"],["node_modules/tailwindcss/index.css","ac1f6ba3587511e1835b6fcefe8cbc2a"],["node_modules/tailwindcss/package.json","7f995344b8e60bacf13a97c871356615"],["node_modules/tailwindcss/preflight.css","dc04f39bd40cb2260423900ba89063a6"],["node_modules/tailwindcss/theme.css","b6c9983c9d4d333f184583a300b2fcc9"],["node_modules/tailwindcss/utilities.css","6f59153df1de24ba3140c3b2c008a855"],["node_modules/ts-pattern/README.md","949f63f3f072ca80c3cd5ad21f3a2a36"],["node_modules/ts-pattern/package.json","aea213cf40a0d1fbda2b537383449cd0"],["node_modules/tw-animate-css/README.md","56908296dd8e3bedb67696e0d3d9466a"],["node_modules/tw-animate-css/package.json","46ef2f9d7e00e4d449de3d6dff81370c"],["node_modules/typescript/LICENSE.txt","55a8748c7d5c7253f3e4bb7402ff04db"],["node_modules/typescript/README.md","e68f19241214b1b880589ab5723eac31"],["node_modules/typescript/SECURITY.md","57f14126c1c6add76b3aef3844dfe4e3"],["node_modules/typescript/ThirdPartyNoticeText.txt","0f7b941d549aa1beafca96f84ce564e9"],["node_modules/typescript/package.json","4dc17c6a4b09659579742a293986a2a5"],["node_modules/vite-tsconfig-paths/README.md","9ff45ee26625f47f5876efb175cdc34b"],["node_modules/vite-tsconfig-paths/package.json","66a836381b29be09679364d3d83eced1"],["node_modules/vite/LICENSE.md","f7cf2db2d4c3eb87393f5a721530c551"],["node_modules/vite/README.md","8cff11f19c7176653d3fa97290c917e3"],["node_modules/vite/client.d.ts","d51e7d8f613c7f4cff6deaff73aea46e"],["node_modules/vite/package.json","6349cbb1500bf2519f031cd265f00e47"],["node_modules/zustand/README.md","bc3e9cc83634932f86b053131d2f7c1a"],["node_modules/zustand/index.d.ts","93146d31852c5948b9b6a080ab956510"],["node_modules/zustand/index.js","f58a5846b1245543f26cd39ecf5ce77c"],["node_modules/zustand/middleware.d.ts","2290a5b7633459e60bdc24e84c8683e2"],["node_modules/zustand/middleware.js","9cc27d129fc27ef2a1f60f1de8bd3b8d"],["node_modules/zustand/package.json","26b4f3cb4ef1a655480802f2325d4ee5"],["node_modules/zustand/react.d.ts","09073b921b09f431a27e5a1291f649d7"],["node_modules/zustand/react.js","929f63fef4fc7ee30eb8f5ad34c247c6"],["node_modules/zustand/shallow.d.ts","febc4f16a477d0da0abfd28cd82d90da"],["node_modules/zustand/shallow.js","2720d841c9f76bedcd2b9874d95ea03d"],["node_modules/zustand/traditional.d.ts","196f713b0368ba4ae646cae9f13d4475"],["node_modules/zustand/traditional.js","6d3ae9892c0b4e28ecf51fdd3d596b51"],["node_modules/zustand/ts_version_4.5_and_above_is_required.d.ts","d41d8cd98f00b204e9800998ecf8427e"],["node_modules/zustand/vanilla.d.ts","286cb64a161d033936ffe20ba699f064"],["node_modules/zustand/vanilla.js","ea248746ddc169f6b8432cb71f390f01"],["package.json","c11b5a50259be63ea1787d52f5cc1d81"],["src/api/client.tsx","506a2cde22bc20490121bc707268daee"],["src/components/ui/alert-dialog.tsx","ee1a69f2377bb98b456afa407a8898d6"],["src/components/ui/button.tsx","1337d13f89911f18ee9dfcd83c2534a4"],["src/components/ui/field.tsx","1bfdfb81c1e05cbc704e5d1e2131268d"],["src/components/ui/input.tsx","0607b02d99a2e92f9509223f36ccc6ec"],["src/components/ui/item.tsx","bb1ec04575866291e8f741b543c3ed1c"],["src/components/ui/label.tsx","92c6cf712c42f55463403a9241294aa0"],["src/components/ui/separator.tsx","3de2dca3e47ab29c4b1f632671545628"],["src/components/ui/sheet.tsx","88780518e1f410c03aa766824b784be7"],["src/components/ui/sidebar.tsx","059085db1f57ee0dec66b7cb08f10726"],["src/components/ui/skeleton.tsx","0e6e825c43d858d98c9903f4da975382"],["src/components/ui/table.tsx","5141a7db7f49a81242b3bdc213cdf895"],["src/components/ui/tooltip.tsx","1da205d74f7f9762f1b118d6acaa6818"],["src/hooks/use-mobile.ts","209b5193af16624cdd89d3591480dd48"],["src/lib/utils.ts","5a6fd53fdcf2be529e9cc0b718fde352"],["src/main.tsx","0554dd67858f42387c9f1597dfaf50c2"],["src/routeTree.gen.ts","ff6bf12f3c4c0d3dfa230777e5861c20"],["src/routes/__root.tsx","210dc03af5ca37d47f41062d63b378ab"],["src/routes/about.tsx","9eb7ddefa170d9d109461d01ad02b0e6"],["src/routes/dashboard/account/-utils.tsx","f6373cdc200e996963b737678a4e0492"],["src/routes/dashboard/account/emails.tsx","2e187cef9df45299db7962e591015c32"],["src/routes/dashboard/account/passkeys.tsx","ad35a0b71ec5687a904e5eb50007f898"],["src/routes/dashboard/account/route.tsx","8db838d680b18a4846fc40ded48595f0"],["src/routes/dashboard/account/sessions.tsx","d86c62e1898c9885f6b2e41ceff66288"],["src/routes/dashboard/route.tsx","8c6cf4454bd7ade817ed3ad398caac5c"],["src/routes/index.tsx","640758a04821bc25f5fc1726950fb2ca"],["src/routes/login.tsx","dff855baf84ccff3ea5492576fb98875"],["src/routes/register.tsx","aa80b6316e4724d67b81263cadff153a"],["src/store/auth.ts","cd096eedb481b39a26f05ccf0231df15"],["src/store/count.ts","46c5a1472af31735fcb35abd8cf8f804"],["src/store/user.ts","37ae9bcad8bf32b2a493535f3270aef7"],["src/styles.css","2cdce8413db6b868ca818c8e48c00fb6"],["src/types.ts","8b82ecea2633a726313aa2e6ef20979e"],["src/utils/dashboard.ts","c8d1ec81c50c48e08d4fbd50a45afce5"],["src/utils/mobileDebug.ts","beb0304b8cf472747f2818d8f3780298"],["src/utils/query.ts","2053a475c52edaf7c53f7c9b3460f681"],["tailwind.config.ts","147c8e33cc97c2fcccb76618a4b5d4b9"],["tsconfig.json","2329a641e9673acc09af78e315602790"],["vite.config.ts","3cb5fb024299dd2d1e40c4478a1fcbfb"]];
var cacheName = 'sw-precache-v3-sw-precache-' + (self.registration ? self.registration.scope : '');


var ignoreUrlParametersMatching = [/^utm_/];



var addDirectoryIndex = function(originalUrl, index) {
    var url = new URL(originalUrl);
    if (url.pathname.slice(-1) === '/') {
      url.pathname += index;
    }
    return url.toString();
  };

var cleanResponse = function(originalResponse) {
    // If this is not a redirected response, then we don't have to do anything.
    if (!originalResponse.redirected) {
      return Promise.resolve(originalResponse);
    }

    // Firefox 50 and below doesn't support the Response.body stream, so we may
    // need to read the entire body to memory as a Blob.
    var bodyPromise = 'body' in originalResponse ?
      Promise.resolve(originalResponse.body) :
      originalResponse.blob();

    return bodyPromise.then(function(body) {
      // new Response() is happy when passed either a stream or a Blob.
      return new Response(body, {
        headers: originalResponse.headers,
        status: originalResponse.status,
        statusText: originalResponse.statusText
      });
    });
  };

var createCacheKey = function(originalUrl, paramName, paramValue,
                           dontCacheBustUrlsMatching) {
    // Create a new URL object to avoid modifying originalUrl.
    var url = new URL(originalUrl);

    // If dontCacheBustUrlsMatching is not set, or if we don't have a match,
    // then add in the extra cache-busting URL parameter.
    if (!dontCacheBustUrlsMatching ||
        !(url.pathname.match(dontCacheBustUrlsMatching))) {
      url.search += (url.search ? '&' : '') +
        encodeURIComponent(paramName) + '=' + encodeURIComponent(paramValue);
    }

    return url.toString();
  };

var isPathWhitelisted = function(whitelist, absoluteUrlString) {
    // If the whitelist is empty, then consider all URLs to be whitelisted.
    if (whitelist.length === 0) {
      return true;
    }

    // Otherwise compare each path regex to the path of the URL passed in.
    var path = (new URL(absoluteUrlString)).pathname;
    return whitelist.some(function(whitelistedPathRegex) {
      return path.match(whitelistedPathRegex);
    });
  };

var stripIgnoredUrlParameters = function(originalUrl,
    ignoreUrlParametersMatching) {
    var url = new URL(originalUrl);
    // Remove the hash; see https://github.com/GoogleChrome/sw-precache/issues/290
    url.hash = '';

    url.search = url.search.slice(1) // Exclude initial '?'
      .split('&') // Split into an array of 'key=value' strings
      .map(function(kv) {
        return kv.split('='); // Split each 'key=value' string into a [key, value] array
      })
      .filter(function(kv) {
        return ignoreUrlParametersMatching.every(function(ignoredRegex) {
          return !ignoredRegex.test(kv[0]); // Return true iff the key doesn't match any of the regexes.
        });
      })
      .map(function(kv) {
        return kv.join('='); // Join each [key, value] array into a 'key=value' string
      })
      .join('&'); // Join the array of 'key=value' strings into a string with '&' in between each

    return url.toString();
  };


var hashParamName = '_sw-precache';
var urlsToCacheKeys = new Map(
  precacheConfig.map(function(item) {
    var relativeUrl = item[0];
    var hash = item[1];
    var absoluteUrl = new URL(relativeUrl, self.location);
    var cacheKey = createCacheKey(absoluteUrl, hashParamName, hash, false);
    return [absoluteUrl.toString(), cacheKey];
  })
);

function setOfCachedUrls(cache) {
  return cache.keys().then(function(requests) {
    return requests.map(function(request) {
      return request.url;
    });
  }).then(function(urls) {
    return new Set(urls);
  });
}

self.addEventListener('install', function(event) {
  event.waitUntil(
    caches.open(cacheName).then(function(cache) {
      return setOfCachedUrls(cache).then(function(cachedUrls) {
        return Promise.all(
          Array.from(urlsToCacheKeys.values()).map(function(cacheKey) {
            // If we don't have a key matching url in the cache already, add it.
            if (!cachedUrls.has(cacheKey)) {
              var request = new Request(cacheKey, {credentials: 'same-origin'});
              return fetch(request).then(function(response) {
                // Bail out of installation unless we get back a 200 OK for
                // every request.
                if (!response.ok) {
                  throw new Error('Request for ' + cacheKey + ' returned a ' +
                    'response with status ' + response.status);
                }

                return cleanResponse(response).then(function(responseToCache) {
                  return cache.put(cacheKey, responseToCache);
                });
              });
            }
          })
        );
      });
    }).then(function() {
      
      // Force the SW to transition from installing -> active state
      return self.skipWaiting();
      
    })
  );
});

self.addEventListener('activate', function(event) {
  var setOfExpectedUrls = new Set(urlsToCacheKeys.values());

  event.waitUntil(
    caches.open(cacheName).then(function(cache) {
      return cache.keys().then(function(existingRequests) {
        return Promise.all(
          existingRequests.map(function(existingRequest) {
            if (!setOfExpectedUrls.has(existingRequest.url)) {
              return cache.delete(existingRequest);
            }
          })
        );
      });
    }).then(function() {
      
      return self.clients.claim();
      
    })
  );
});


self.addEventListener('fetch', function(event) {
  if (event.request.method === 'GET') {
    // Should we call event.respondWith() inside this fetch event handler?
    // This needs to be determined synchronously, which will give other fetch
    // handlers a chance to handle the request if need be.
    var shouldRespond;

    // First, remove all the ignored parameters and hash fragment, and see if we
    // have that URL in our cache. If so, great! shouldRespond will be true.
    var url = stripIgnoredUrlParameters(event.request.url, ignoreUrlParametersMatching);
    shouldRespond = urlsToCacheKeys.has(url);

    // If shouldRespond is false, check again, this time with 'index.html'
    // (or whatever the directoryIndex option is set to) at the end.
    var directoryIndex = 'index.html';
    if (!shouldRespond && directoryIndex) {
      url = addDirectoryIndex(url, directoryIndex);
      shouldRespond = urlsToCacheKeys.has(url);
    }

    // If shouldRespond is still false, check to see if this is a navigation
    // request, and if so, whether the URL matches navigateFallbackWhitelist.
    var navigateFallback = '';
    if (!shouldRespond &&
        navigateFallback &&
        (event.request.mode === 'navigate') &&
        isPathWhitelisted([], event.request.url)) {
      url = new URL(navigateFallback, self.location).toString();
      shouldRespond = urlsToCacheKeys.has(url);
    }

    // If shouldRespond was set to true at any point, then call
    // event.respondWith(), using the appropriate cache key.
    if (shouldRespond) {
      event.respondWith(
        caches.open(cacheName).then(function(cache) {
          return cache.match(urlsToCacheKeys.get(url)).then(function(response) {
            if (response) {
              return response;
            }
            throw Error('The cached response that was expected is missing.');
          });
        }).catch(function(e) {
          // Fall back to just fetch()ing the request if some unexpected error
          // prevented the cached response from being valid.
          console.warn('Couldn\'t serve response for "%s" from cache: %O', event.request.url, e);
          return fetch(event.request);
        })
      );
    }
  }
});







