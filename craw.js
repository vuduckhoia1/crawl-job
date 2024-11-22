const puppeteer = require('puppeteer');

async function crawlJobData() {
    const browser = await puppeteer.launch({ headless: true });
    const page = await browser.newPage();

    try {
        // Set User-Agent to simulate a browser
        await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36');
        await page.setRequestInterception(true);
        page.on('request', request => {
            if (request.resourceType() === 'image') {
                request.abort();
            } else {
                request.continue();
            }
        });

        await page.goto('https://www.topcv.vn/viec-lam-it');
        await page.waitForSelector('div.job-item-2');

        let jobLinks = await crawlLink(page);

        page.close();
        let data = await crawlDetailData(jobLinks, page);
    } catch (error) {
        console.error('Error while crawling job data:', error.message);
    } finally {
        await browser.close();
    }
}

async function crawlLink(page) {
    // Extract the page content
    return await page.evaluate(() => {
        let jobs = [];
        var els = document.querySelectorAll(".job-item-2");
        [].forEach.call(els, function (job) {
            const url = job.querySelector('.title a')?.href;

            if (url) {
                jobs.push(url);
            }
        });
        return jobs;
    });
}

async function crawlDetailData(jobLinks, page) {
    for (let link of jobLinks) {
        await page.goto(link);

    }
}

crawlJobData();
