const express = require('express')
const https = require('https');
var Cookie = require('request-cookies').Cookie;

const app = express()

let credentials = JSON.stringify({userName: '{YOUR_USER_NAME}}',systemCode: '{YOUR_PASSCODE}'});

let port = process.env.PORT || 3000
let cookies = '';
let xsrfTokenHeader = '';
let stationCodeBody = '';


app.get('/getStationRealKpi', async (req, res) => {
	const result = await getStationRealKpi()
	res.send(result);
	res.end();
});

app.get('/getKpiStationHour', async (req,res) => {
	const result = await getKpiStationHour()
	res.write(result);
	res.end();
});

app.get('/getKpiStationDay', async(req,res) => {
	const result = await getKpiStationDay();
	res.send(result);
	res.end();
});

app.get('/getKpiStationMonth', async(req,res) => {
	const result = await getKpiStationMonth();
	res.send(result);
	res.end();
});

app.get('/getKpiStationYear', async(req,res) => {
	const result = await getKpiStationYear();
	res.send(result);
	res.end();
});


async function login() {
	const authValues = await makeRequest('POST', '/thirdData/login',true, credentials , '', '');

		for (const [key, value] of Object.entries(authValues)) {
			console.log(key, value);
			if(value.key == 'XSRF-TOKEN')
			{
				xsrfTokenHeader = value.value;
			}
			cookies = value.key + '=' + value.value + ';';
		}

		const stationCodeObj = await makeRequest('POST', '/thirdData/getStationList', false, '{}', xsrfTokenHeader, cookies);
		var stationCodeJson = JSON.parse(stationCodeObj);
		var stationCode = stationCodeJson.data[0][`stationCode`];
		stationCodeBody = JSON.stringify({
			stationCodes: stationCode,
			collectTime: Date.now()
		})
}

async function getKpiStationYear(){
	const consumption = await makeRequest('POST', '/thirdData/getKpiStationYear', false, stationCodeBody, xsrfTokenHeader, cookies);
	if(JSON.parse(consumption)["failCode"] === 306) { // relogin
		await login()
		consumption = await makeRequest('POST', '/thirdData/getKpiStationYear', false, stationCodeBody, xsrfTokenHeader, cookies);
	}
	console.log(consumption)
	return consumption;
}

async function getKpiStationMonth() {
	const consumption = await makeRequest('POST', '/thirdData/getKpiStationMonth', false, stationCodeBody, xsrfTokenHeader, cookies);
	if(JSON.parse(consumption)["failCode"] === 306) { // relogin
		await login()
		consumption = await makeRequest('POST', '/thirdData/getKpiStationMonth', false, stationCodeBody, xsrfTokenHeader, cookies);
	}
	console.log(consumption)
	return consumption;
}

async function getKpiStationDay() {
	const consumption = await makeRequest('POST', '/thirdData/getKpiStationDay', false, stationCodeBody, xsrfTokenHeader, cookies);
	if(JSON.parse(consumption)["failCode"] === 306) { // relogin
		await login()
		consumption = await makeRequest('POST', '/thirdData/getKpiStationDay', false, stationCodeBody, xsrfTokenHeader, cookies);
	}
	console.log(consumption)
	return consumption;
}

async function getKpiStationHour() {
	const consumption = await makeRequest('POST', '/thirdData/getKpiStationHour', false, stationCodeBody, xsrfTokenHeader, cookies);
	if(JSON.parse(consumption)["failCode"] === 306) { // relogin
		await login()
		consumption = await makeRequest('POST', '/thirdData/getKpiStationHour', false, stationCodeBody, xsrfTokenHeader, cookies);
	}
	console.log(consumption)
	return consumption;
}


async function getStationRealKpi() {
	let consumption = await makeRequest('POST', '/thirdData/getStationRealKpi', false, stationCodeBody, xsrfTokenHeader, cookies);
	if(JSON.parse(consumption)["failCode"] === 306) { // relogin
		await login()
		consumption = await makeRequest('POST', '/thirdData/getStationRealKpi', false, stationCodeBody, xsrfTokenHeader, cookies);
	}
    return consumption;
};



async function makeRequest(request_method, path, isAuth, body, xsrfToken, cookies) {
	return new Promise((resolve,reject) => {

		const options = {
			hostname: 'eu5.fusionsolar.huawei.com',
			path: path,
			method: request_method,
			headers: {
			  'Content-Type': 'application/json',
			  'Content-Length': body.length
			}
		  }

		  if(xsrfToken != '') {
			options.headers['XSRF-TOKEN'] = xsrfToken;
		  }
		  if(cookies != '') {
			  options.headers['Cookie'] = cookies;
		  }

		const req = https.request(options, res => {
			let data = '';
			res.on('data', (chunk) => {
				data += chunk;
			});
	
			res.on('end', () => {
				if(isAuth)
				{
					var rawcookies = res.headers['set-cookie'];
					const authenticationValues = [];
					for (var i in rawcookies) {
						var cookie = new Cookie(rawcookies[i]);
						if(cookie.key == 'XSRF-TOKEN') {
						authenticationValues.push({key:cookie.key, value: cookie.value});
						}
						else if (cookie.key =='JSESSIONID') {
						authenticationValues.push({key:cookie.key, value: cookie.value});
						}
					}
					resolve(authenticationValues)
				}
				resolve(data);
			});
		})
	
		req.on('error', error => {
			console.log("Error: " + err.message);
			reject(error);
		})
	
		req.write(body)
		req.end()
	});
  }


app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})