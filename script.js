const {
    Configuration,
    OpenAIApi
} = require("openai");

const puppeteer = require('puppeteer-extra')
const path = require('path')
const fs = require('fs');
//These two are to prevent automation
const chromePaths = require('chrome-paths');
const StealthPlugin = require("puppeteer-extra-plugin-stealth");
puppeteer.use(StealthPlugin());
const credentials = JSON.parse(fs.readFileSync('./Storage/configs.json', 'utf-8'));
//Colors
var colors = require('colors');
//Fake data
var Fakerator = require("fakerator");
const { pathToFileURL } = require("url");
var fakerator = Fakerator();
// const RecaptchaPlugin = require('puppeteer-extra-plugin-recaptcha')

/*
puppeteer.use(
    RecaptchaPlugin({
      provider: {
        id: '2captcha',
        token: credentials.twocaptcha // REPLACE THIS WITH YOUR OWN 2CAPTCHA API KEY ⚡
      },
      visualFeedback: true // colorize reCAPTCHAs (violet = detected, green = solved)
    })
)
*/

function sleep(milliseconds) {
    const date = Date.now();
    let currentDate = null;
    do {
      currentDate = Date.now();
    } while (currentDate - date < milliseconds);
}  
//Sleeping for error code

console.log(
`
░█████╗░███╗░░░███╗███████╗████████╗░█████╗░░█████╗░██╗░░░░░░██████╗
██╔══██╗████╗░████║╚════██║╚══██╔══╝██╔══██╗██╔══██╗██║░░░░░██╔════╝
███████║██╔████╔██║░░███╔═╝░░░██║░░░██║░░██║██║░░██║██║░░░░░╚█████╗░
██╔══██║██║╚██╔╝██║██╔══╝░░░░░██║░░░██║░░██║██║░░██║██║░░░░░░╚═══██╗
██║░░██║██║░╚═╝░██║███████╗░░░██║░░░╚█████╔╝╚█████╔╝███████╗██████╔╝
╚═╝░░╚═╝╚═╝░░░░░╚═╝╚══════╝░░░╚═╝░░░░╚════╝░░╚════╝░╚══════╝╚═════╝░`.red.bold
)
console.log('')
console.log('')

mainScript();
/*
Puppeteer script will run below to generate and enter random data for the first forms. Then it will fill the third form with responded openAI
data. The puppeteer potion will be with a proxy to ensure that there will be no blocks. 
*/

async function mainScript() {

    function random(arr) {
        return arr[Math.floor(Math.random() * arr.length)];
    }

    const list = fs
        .readFileSync("./Storage/proxies.txt", "utf8")
        .split("\n")
        .filter(String);
    const raw = random(list);
    const splitproxy = raw.split(":");

    let emailCount = 0

    const email = fs
        .readFileSync("./Storage/emails.txt", "utf8")
        .split("\n")
        .filter(String);

    const theRealEmail = email[emailCount];

    emailCount = emailCount++;

    //Filtering emails

    if(theRealEmail == ""){
        console.log('All Threads Finished'.green.bold);
        sleep(2000);
        process.exit();
    }
    else if(theRealEmail == "undefined"){
        console.log('All Threads Finished'.green.bold);
        sleep(2000);
        process.exit();
    }
    else if(theRealEmail == false){
        console.log('All Threads Finished'.green.bold);
        sleep(2000);
        process.exit();
    }

    const args = [
        `--proxy-server=http://${splitproxy[0]}:${splitproxy[1]}`,
        `--window-size=1080,1080`,
        '--no-sandbox',
        '--disable-accelerated-2d-canvas',
        '--enable-automation',
        '--disable-gpu',
        '--disable-infobars',
        '--disable-dev-shm-usage',
        "--disable-blink-features",
        '--disable-blink-features=AutomationControlled'
    ]

    puppeteer.launch({
        headless: false,
        args: args,
        executablePath: chromePaths.chrome
    }).then(async browser => {
        var [page] = await browser.pages();
        await page.authenticate({
            username: splitproxy[2],
            password: splitproxy[3],
        })        
        await page.goto('https://reviews.capterra.com/new/129067');
        console.log(`PAGE LOADED [0] STATUS 200: ${theRealEmail}`.bold);
        await page.waitForSelector('#reviewerFirstName');
        await page.waitForTimeout(500);
        await page.type('#reviewerFirstName', fakerator.names.firstName(), {delay: 25});
        await page.waitForTimeout(50);
        await page.type('#reviewerLastName', fakerator.names.firstName(), {delay: 25});
        await page.waitForTimeout(50);
        await page.type('#reviewerEmailAddress', theRealEmail, {delay: 25});
        await page.waitForTimeout(50);
        await page.type('#reviewerJobTitle', fakerator.company.name(), {delay: 25});
        await page.waitForTimeout(50);
        await page.type('#reviewerCompanyName', fakerator.company.name(), {delay: 25});
        await page.waitForTimeout(50);
        await page.click('#reviewerIndustry');
        await page.waitForTimeout(50);
        await page.keyboard.press('ArrowDown');
        await page.waitForTimeout(50);
        await page.keyboard.press('Enter');
        await page.waitForTimeout(50);
        await page.click('#reviewerCompanySize');
        await page.waitForTimeout(50);
        await page.keyboard.type('11', {delay: 25});
        await page.waitForTimeout(50);
        await page.keyboard.press('Enter');
        await page.waitForTimeout(50);
        await page.click('#timeUsedProduct');
        await page.waitForTimeout(50);
        await page.keyboard.press('ArrowDown');
        await page.waitForTimeout(50);
        await page.keyboard.press('Enter');
        await page.waitForTimeout(50);
        await page.click('#categories');
        await page.waitForSelector('#root > div > div.crf__sc-1t2be2p-1.blCzCV > div.crf__sc-1jv1usi-0.KBsRF > div > form > div:nth-child(1) > div.crf__sc-133jp8o-0.NHIwF > div > div:nth-child(3) > div.crf__sc-1h52sxz-2.gYkCbm > div.crf__sc-1h52sxz-3.kRIMnp > div > div > div:nth-child(1) > button');
        await page.waitForTimeout(50);
        await page.click('#root > div > div.crf__sc-1t2be2p-1.blCzCV > div.crf__sc-1jv1usi-0.KBsRF > div > form > div:nth-child(1) > div.crf__sc-133jp8o-0.NHIwF > div > div:nth-child(3) > div.crf__sc-1h52sxz-2.gYkCbm > div.crf__sc-1h52sxz-3.kRIMnp > div > div > div:nth-child(1) > button');
        await page.waitForTimeout(50);
        await page.click('#frequencyOfUsing');
        await page.waitForTimeout(50);
        await page.keyboard.press('ArrowDown');
        await page.waitForTimeout(50);
        await page.keyboard.press('Enter');
        await page.waitForTimeout(50);
        await page.click('#root > div > div.crf__sc-1t2be2p-1.blCzCV > div.crf__sc-1jv1usi-0.KBsRF > div > form > div:nth-child(1) > div:nth-child(8) > div:nth-child(3) > div:nth-child(1) > label:nth-child(1) > input');
        await page.waitForTimeout(50);
        await page.click('#root > div > div.crf__sc-1t2be2p-1.blCzCV > div.crf__sc-1jv1usi-0.KBsRF > div > form > div:nth-child(2) > div > div.crf__sc-1eaiybs-0.fHIIIM > button');
        try{
            await page.waitForSelector("img[src='data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEwAAABMCAYAAADHl1ErAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAABSxJREFUeNrsnF9oE0kcx9NW2jwULlJSioqmRiGtBeOfh+idNuqDfxDSHp5WERpFRUSJhUN8Oazcg+gdVFHE/7VoS/1zXvNi63Fq6j/6oFIV04jUxqpFLhbz0AdbRO83darJZNfO7k53Jtn9QdjN7Mzkl89+ZzK/2ZlkWQSz7t7XFXD4G7+tdE6e1CKSf9kW8WyPzLkQliWYuhxw6CGSi0FlUVNh0hagTDOBYfNTppnAcGdvk7hkw9dMYIRVq7xmvE5fprO3iNj5i6KwCkZ5DAMswChP5gOD5uiFg4MiqwPnNbzCqscob+Z1+qAYNIx4r7DYeOj840ZVWIVOZTIGWECnMukPDJqjGw5uFUXduKzhFFbNqWzaAvNzKpt+wKBJ+WUCbVqz4ToMozCfIHWIPw6jDLRpTfeAnIfC/ILWJSywakHrEg+YgkCb1nQPyLPTWF1cVJalo7rUBNrCBeR6KqwiTeuWVhgo4CYcvBbTpCwECl5EKsyEJW9eqSYZN7nIWjwF2JPHjyqHhoY+mGySDTFBbEbe54ycPH7UWdXb+/KlZ978spycnHEmqi+w/ti/r6Gh/nR+LBa7QzZJa8e9u29RBlNp32AhJohNisLshXY0Tip6/erVACit28hKI2Ah6wSFRZKAoQQTmjSs8NNwS4rCTGijw0oBZmRoNLAkgRkRGi0sWWBGgqYE1neBGQGaUlijAstkaGpgUQHLRGhqYVEDyyRoWmApApYJ0LTCUgwsnaGxgKUKWDpCYwVLNbB0gsYSliZgUtA+f/7UP9M9q0wkYI3nGv76p601ygIWOR+myrADneh8qnNakWjNMcEnzbCYAEuEVlBQ8INowLBPTGAhY/ogN/y8uysvL88lErDBwcFI6XRnCav6mD7IFQ3WWPjEDJgIuzT08I2lwtwWcc0tIrApAgObYiosAxTmFRiYWH0Yz50ZevuYbYDmyNRHVsAcLL/Zwwf3O9CLMTAmPrKaWShnUcnAwED87JlTwWutV4eD5aXLVzzzb9zky8/Pt4niYxaj/gGtXdX0pe7cvtV+5uSJjljsv6SFMHZ7oXXj5i2enxYs1PqF487Jk8ZzB6Z1Z0d/f//bY0ePBBPmqyTNM//Hoq3btvsgmNYyI6J550g2z74Bqcq/fu1xAhY6P4ZfX9NRHpQXleHZj7FQWK1F4d9W9fW9idb9eSAY6eoil4mGwk/DocSE0hmlXnIc5SopsdX8uss3YcJEpQD2gsJqeQNDf45GtewbTReHblxvP3yojvwFREpqAViSzRKgFeHPSGqOOwI1Hu/iJeW5ublWSndbAFglb2A9NFKXUdUHrCqqIQSA82C1WVWqLQrAirkBo9ndgVTV3HQ+eOlCc4R0HqtK0eptgGbDaksC9MuaKlfVuvU+CrVp2jWiFRi62zflrve86I78XrsnSAwVFKlKidrQEOS32r2+4qnO700aLgJgIV7AdsKhTmoAeuXyxWsSqopgVTFZdAzQrFhtLlJtP69avVRmwFsDwA7yAlZvITZ5opDmyKGD7RKqQqAiYxEkAjgXBpektu2BneWz58z1ENnPArAN3BVGhjUJhh7BtbFS1ShqW0YG2RBeOYjwip/C0J2Fn/bhD29uauwkVBXHqopadDTwyYHVZktU20qfb7jZ1p86uVuL0rUCSxlUjgzMccfOZYMEVhvyyyNxOWVwrOdsBRnXcVEVafhGtQG4CKk2CZ8Vmaa1FfZC+0c4lCXcueZYLCbMrjjkC7w6wM/EOPJfSHunts7/BRgAqddh6q354uUAAAAASUVORK5CYII=']");
            console.log(`PAGE NAVIGATED [1] STATUS 200: ${theRealEmail}`.bold);
        }
        catch (e){
            console.log('Error Code: ' + err);
            await browser.close();
            return mainScript();
        }
        await page.waitForTimeout(50);
        await page.click(`#reviewOverallRating > button:nth-child(${JSON.stringify(fakerator.date.age(3, 5))}) > img`);
        await page.waitForTimeout(50);
        await page.click(`#reviewEaseOfUseRating > button:nth-child(${JSON.stringify(fakerator.date.age(3, 5))}) > img`);
        await page.waitForTimeout(50);
        await page.click(`#reviewFunctionalityRating > button:nth-child(${JSON.stringify(fakerator.date.age(3, 5))}) > img`);
        await page.waitForTimeout(50);
        await page.click(`#reviewCustomerSupportRating > button:nth-child(${JSON.stringify(fakerator.date.age(3, 5))}) > img`);
        await page.waitForTimeout(50);
        await page.click(`#reviewValueForMoneyRating > button:nth-child(${JSON.stringify(fakerator.date.age(3, 5))}) > img`);
        await page.waitForTimeout(50);
        await page.click(`#reviewEaseOfDeploymentRating > button:nth-child(${JSON.stringify(fakerator.date.age(3, 5))}) > img`);
        await page.waitForTimeout(50);
        await page.click(`#rating-fff79e73-bc6a-408d-ad60-ce3fff70d80a > button:nth-child(${JSON.stringify(fakerator.date.age(3, 5))}) > img`);
        await page.waitForTimeout(50);
        await page.click(`#rating-10165b2b-48b6-4664-9a40-f95731597d68 > button:nth-child(${JSON.stringify(fakerator.date.age(3, 5))}) > img`);
        await page.waitForTimeout(50);
        await page.click(`#rating-1565b075-f8df-47a2-842b-caafb7de5842 > button:nth-child(${JSON.stringify(fakerator.date.age(3, 5))}) > img`);
        await page.waitForTimeout(50);
        await page.click(`#rating-1565b075-f8df-47a2-842b-caafb7de5842 > button:nth-child(${JSON.stringify(fakerator.date.age(3, 5))}) > img`);
        await page.waitForTimeout(50);
        await page.click(`#rating-97efb0d3-9a23-4408-90d4-4db1e3830fbd > button:nth-child(${JSON.stringify(fakerator.date.age(3, 5))}) > img`);
        await page.waitForTimeout(50);
        await page.click(`#rating-b0c186d0-0194-4300-abba-ca3bc2474bbe > button:nth-child(${JSON.stringify(fakerator.date.age(3, 5))}) > img`);
        await page.waitForTimeout(50);
        await page.click('#reviewPricingRating');
        await page.waitForTimeout(50);
        await page.click('#reviewRecommendationRating');
        await page.waitForTimeout(50);
        await page.click('#root > div > div.crf__sc-1t2be2p-1.blCzCV > div.crf__sc-1jv1usi-0.KBsRF > div > form > div:nth-child(2) > div > div.crf__sc-1eaiybs-0.fHIIIM > button')
        try{
            await page.waitForSelector('#reviewTitle');
            console.log(`PAGE NAVIGATED [2] STATUS 200: ${theRealEmail}`.bold);
        }
        catch (e){
            console.log('Error Code: ' + err);
            await browser.close();
            return mainScript();
        }
        openAI();
        async function openAI() {
            const configuration = new Configuration({
                apiKey: credentials.apiKey,
            });
            const openai = new OpenAIApi(configuration);
        
            openAIQuestions();
            async function openAIQuestions() {

                /*
                Sending requests to OpenAI, it will respons with a JSON response which can be parsed to get text. Once text
                is recieved, it can be typed into the form.
                */
        
                const response = await openai.createCompletion({
                    model: "text-davinci-002",
                    //Specify characters and lines in prompt
                    prompt: "Why is Github a Good Product (One Line)",
                    temperature: 0.9,
                    max_tokens: 150,
                    top_p: 1,
                    frequency_penalty: 0.0,
                    presence_penalty: 0.6,
                    stop: [" Human:", " AI:"],
                });

                //Parsing responses below+
        
                this.reviewTitle = response.data.choices[0].text;
                await page.type('#reviewTitle', this.reviewTitle, {delay: 25})

                const response2 = await openai.createCompletion({
                    model: "text-davinci-002",
                    prompt: "What features do you like most about Github (At least 100 characters and one line)",
                    temperature: 0.9,
                    max_tokens: 150,
                    top_p: 1,
                    frequency_penalty: 0.0,
                    presence_penalty: 0.6,
                    stop: [" Human:", " AI:"],
                });

                this.reviewBody = response2.data.choices[0].text;
                await page.type('#reviewProsText', this.reviewBody, {delay: 25})

                const response3 = await openai.createCompletion({
                    model: "text-davinci-002",
                    prompt: "What features do you like least about Github (At least 100 characters and one line)",
                    temperature: 0.9,
                    max_tokens: 150,
                    top_p: 1,
                    frequency_penalty: 0.0,
                    presence_penalty: 0.6,
                    stop: [" Human:", " AI:"],
                });
                this.reviewBodyBad = response3.data.choices[0].text;
                await page.type('#reviewConsText', this.reviewBodyBad, {delay: 25});

                const response4 = await openai.createCompletion({
                    model: "text-davinci-002",
                    prompt: "What is your overall experience with Github (At least 100 characters and one line)",
                    temperature: 0.9,
                    max_tokens: 150,
                    top_p: 1,
                    frequency_penalty: 0.0,
                    presence_penalty: 0.6,
                    stop: [" Human:", " AI:"],
                });
                this.reviewOverall = response4.data.choices[0].text;
                /*
                Make sure to continue puppeteer code down below. This is because it will be executed before the AI requests if put in the main
                function. The main function is no longer in use.
                */
                await page.type('#reviewGeneralComments', this.reviewOverall, {delay: 25});
                await page.waitForTimeout(50);
                await page.click('#userSwitchedProductNo');
                await page.waitForTimeout(50);
                await page.click('#userIntegratedWithOtherProductsNo');
                await page.waitForTimeout(50);
                await page.click('#disclaimer-0');
                await page.waitForTimeout(50);
                await page.click('#root > div > div.crf__sc-1t2be2p-1.blCzCV > div.crf__sc-1jv1usi-0.KBsRF > div > form > div:nth-child(2) > div > div.crf__sc-1eaiybs-0.fHIIIM > button');
                await page.waitForTimeout(1500);
                console.log(`CAPTCHA ENCOUNTERED [3] STATUS 200: ${theRealEmail}`.bold);
                try{
                    /*
                    The user will have 60 seconds to solve the captcha. If it is not solved, it will resume to the next thread and throw an error. Increase timeout if you wish to hav your delay at a higher
                    pase.
                    */
                    await page.waitForSelector('#root > div > div.crf__sc-1t2be2p-1.blCzCV > div.crf__sc-slsxx7-0.irhRAs > div:nth-child(2) > div > h1', {timeout: 60000});
                    //If the selector loads, it will log success as true
                    console.log(`SUCCESS TRUE [4] STATUS 200: ${theRealEmail}`.bold);
                    //Also returning because success is true
                    await browser.close();
                    return mainScript();
                }
                catch (e){
                    console.log('Error Code: ' + e);
                    //Script will restart upon error
                    await browser.close();
                    return mainScript();
                }
            }
        
        }



    }).catch(err => {
        console.log('Error Code: ' + err);
        return mainScript();
    });
}