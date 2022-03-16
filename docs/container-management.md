# Manage non-Facebook sites that are loaded inside the Facebook Container

### Add a site

To **add** a site to the Facebook Container, open the panel on whichever page you wish to include, and click "Allow site in Facebook Container" button. First, it will confirm this action and then add it and reload the page.

_Note that `about:` system pages cannot be added_. 

![image](https://user-images.githubusercontent.com/2692333/74570315-f891e180-4f41-11ea-8523-a3e22e647861.png)

### Remove a site

To **remove** a site from the Facebook Container, you can do the inverse, by navigating to a page within the Facebook Container<sup>*</sup>, open the panel and click: 

![image](https://user-images.githubusercontent.com/2692333/74570952-c92fa480-4f42-11ea-99ee-b88578d934dc.png)

Additionally, you can manage all the custom sites that have been added by clicking on "Sites Allowed in Facebook Container".  

_*Note that [Facebook-owned domains](https://github.com/mozilla/contain-facebook/blob/main/src/background.js#L7-L23)_ cannot be removed. 

Once on that panel page, click the `X` next to the domain you would like to remove. 

![image](https://user-images.githubusercontent.com/2692333/74570327-fc256880-4f41-11ea-9ef3-d96786e949d3.png)
