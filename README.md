DataScrapper
-------
Extension for Scrap data from web pages and download them as csv file. Source files are same for Chrome and Firefox, it use a new way of Firefox extension development called WebExtensions, it kind of raw and bugged, but works, for best experience use this extension in Chrome, until WebExtension in beta status.

### Installation

#### How to install on Chrome
> https://developer.chrome.com/extensions/getstarted#unpacked

#### How to install on Firefox
> https://developer.mozilla.org/en-US/Add-ons/WebExtensions/Packaging_and_installation

### Getting started
After extension installation, you will get a new button on your browser bar with claw on red background icon. It will open a new window with extension configurator(i have wanted to use detached_panel or devtools panel for this, but Firefox didn't allow to use it now). You should create a new config by pressing a "Add" button and give it some name.
Now you can assign an jQuery selector for row there data contained, you should do it, if all data in same container, like one table or something like that. If you data contained in different containers like two or more linked tables, you should skip this step.
After this step, you can set Titles and jQuery selectors for each col that you wanna scrap your data, jQuery selector should not contain your "Row jQuery selector" if you assigned any on previous step.
On final step you can press on "Download CSV" button and get your data in csv file.
At any time you want, you can press a save button, it will save your current configuration.
Also you can send your configuration to some one with "Export" button or load configuration from some one with "Import" button.
##### Example configuration
This configuration will get data from 

 1. Navigate to https://github.com/rakot/DataScrapper
 2. Open the extension.
 3. Create a new configuration
 4. Load code below via Import

> eyJ0aXRsZSI6ImdpdGh1YiIsInJvdyI6InRyLmpzLW5hdmlnYXRpb24taXRlbSIsImNvbHMiOlt7InRpdGxlIjoiRGlyIiwic2VsZWN0b3IiOiJ0ZC5jb250ZW50In0seyJ0aXRsZSI6Ik1lc3NhZ2UiLCJzZWxlY3RvciI6InRkLm1lc3NhZ2UifSx7InRpdGxlIjoiQWdlIiwic2VsZWN0b3IiOiJ0ZC5hZ2UifV19