App.info({
  id: 'ro.oroboro.omegaphi',
  name: 'Omega Phi',
  version: "0.2.0",
  description: 'Physics formulas - browsing, searching, problem solver',
  author: 'Kuip Limited',
  email: 'kuip.ltd@gmail.com',
  website: 'http://www.kuip.co.uk/'
});

App.icons({
  'android_mdpi': 'public/mobile-icons/omegaphi48.png',// (48x48)
  'android_hdpi': 'public/mobile-icons/omegaphi72.png',// (72x72)
  'android_xhdpi': 'public/mobile-icons/omegaphi96.png',// (96x96)
  'android_xxhdpi': 'public/mobile-icons/omegaphi144.png',// (144x144)
  'android_xxxhdpi': 'public/mobile-icons/omegaphi192.png'// (192x192)
});

/*App.launchScreens({
  'iphone': 'splash/Default~iphone.png',
  'iphone_2x': 'splash/Default@2x~iphone.png',
});*/

// Set PhoneGap/Cordova preferences
// App.setPreference('BackgroundColor', '0xff0000ff');
App.setPreference('HideKeyboardFormAccessoryBar', true);
App.setPreference('Orientation', 'all', 'ios');

