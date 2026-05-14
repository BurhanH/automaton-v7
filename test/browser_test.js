const assert = require("assert");
const { Builder } = require("selenium-webdriver");

const config = require("../config.js");

function createDriver(browser, grid = false) {
    /**
     * 
     */
    let driver;
    if (browser === "chrome" || browser === "firefox") {
        if (grid === true) {
            driver = new Builder()
            .usingServer(config.gridUrl)
            .forBrowser(browser)
            .build();
        } else {
          driver = new Builder()
            .forBrowser(browser)
            .build();
        }
        driver
          .manage()
          .setTimeouts({ implicit: config.timeout });
        driver
          .manage()
          .window()
          .setRect({ width: 1280, height: 1024 });
      } else {
        throw new Error("Unknown '" + browser + "' browser");
      }
    return driver;
    }

describe("Browser testing", function () {
   this.timeout(0);
   let webdriver;
   
   beforeEach(async () => {
       webdriver = await createDriver(config.browser, config.grid);
   });
    
    describe("Test resolution", function() {
      const testData = [
        {width: 800, height: 600},
//         {width: 1280, height: 1024},
//         {width: 1600, height: 1200},
//         {width: 1680, height: 1050}
      ];
      
      testData.forEach(function(test) {
        it(test.width + "x" + test.height, async () => {
          await webdriver.manage().window().setRect({width: test.width, height: test.height});
          let {width, height} = await webdriver.manage().window().getRect();
          assert(width === test.width, "Expected width " + test.width + " actual is " + width);
          assert(height === test.height, "Expected height " + test.height + " actual is " + height);
        });
      });
    });

    afterEach(async () => {
        if (webdriver) {
            await webdriver.quit();
            webdriver = null;
        }
    });

});
