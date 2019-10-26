
// console.log(browser.theme.getCurrent());
//console.log("hell");
// var theme_color = browser.theme.getCurrent();
// theme_color.then(function(result){
//   console.log(result)
// });
//var theme_col;
function getStyle(themeInfo) 
{
  if (themeInfo.colors) 
  {
    //theme_col=themeInfo.colors.toolbar;
    // console.log("accent color : " +  themeInfo.colors.accentcolor);
    // console.log("toolbar : " + themeInfo.colors.toolbar);
    document.body.style.backgroundColor= themeInfo.colors.toolbar;
  document.body.style.color=themeInfo.colors.tab_background_text;
  //console.log(themeInfo.colors);
  }
 
}


async function getCurrentThemeInfo() 
{
  var themeInfo = await browser.theme.getCurrent();
  //console.log(themeInfo);
  getStyle(themeInfo);
}

getCurrentThemeInfo();
//document.body.style.backgroundColor="theme_col";

// var getting = browser.theme.getCurrent();
// console.log(getting);

//console.log(theme.Theme);
// let goodOne = Promise.resolve("Hello there");
// //console.log(goodOne);
// goodOne.then(function(result){
//     console.log(result)
// });

// "content_scripts": [
//   {
//     "matches":["*://*.mozilla.org/*"],
//     "js": ["check-theme.js"]
//   }
// ],
//console.log("hello");