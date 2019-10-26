
function getStyle(themeInfo) 
{
  if (themeInfo.colors) {
   
    document.body.style.backgroundColor= themeInfo.colors.toolbar;
    document.body.style.color=themeInfo.colors.tab_background_text;
  
    const link_button=document.getElementsByClassName("highlight-on-hover");
    for(var i=0;i<link_button.length;i++){
      link_button[i].style.color =themeInfo.colors.tab_background_text;
    }
    }
 
}


async function getCurrentThemeInfo() 
{
  var themeInfo = await browser.theme.getCurrent();

  getStyle(themeInfo);
}

getCurrentThemeInfo();


