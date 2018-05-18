#!/usr/bin/env node

const	{Builder, By, Key, until} = require('selenium-webdriver'),
		readline = require('readline');

var driver, mainURL;

async function checkHeaders()
{
	await driver.quit();
}

async function getProvider()
{
	await driver.wait(until.elementLocated(By.xpath('//li[strong[contains(text(), "Web Hosting Provider")]]')));

	let hostingProvider = await driver.findElement(By.xpath('//li[strong[contains(text(), "Web Hosting Provider")]]')).getText();

	console.log(`The hosting provider is ${hostingProvider}`);
	await driver.quit();
}

async function main()
{
	let siteParam = mainURL.replace(/(http:\/\/|https:\/\/)/, '');
	let hostLookupURI = 'https://www.webhostinghero.com/who-is-hosting/%tempURL%/';
	hostLookupURI = hostLookupURI.replace(/%tempURL%/, encodeURI(siteParam));

	try
	{
		await driver.get(hostLookupURI);

		try
		{
			getProvider();
		}

		catch (error)
		{
			console.log(error);	
		}
	}

	catch (error)
	{
		console.log(error);
	}

}

function getSiteParam()
{
	const prompt1 = readline.createInterface({
		input: process.stdin,
		output: process.stdout
	});

	prompt1.question('Please enter the URL of the site you want to perform a scan on: ', (site) =>
	{
		if (String(site.trim()).length < 1)
		{
			console.log('URL cannot be empty!');
			process.exit(1);
		}

		if (!String(site).match(/(http|https)/))
		{
			console.log('Please include either the HTTP or HTTPS protocol.');
			process.exit(1);
		}

		let chrome = require('selenium-webdriver/chrome');

		driver = new Builder()
			.forBrowser('chrome')
			.setChromeOptions(new chrome.Options().headless())
			.build();

		mainURL = site;

		main();
		prompt1.close();
	});
}

getSiteParam();
