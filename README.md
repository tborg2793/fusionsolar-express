# fusionsolar-express

## NodeJs express client for Huawei FusionSolar API

### Setup

*****Attention, you need a FusionSolar OpenAPI user account to activate this integration. Your personal FusionSolar user account will not work!*****

#### Request your FusionSolar OpenAPI user account  
Contact the Huawei Solar Service Center at eu_inverter_support@huawei.com and request the following:
```
Hi, I hereby request an OpenAPI user account to access the data from my inverter(s) through the new FusionSolar API:

System name: [Enter your device name]
Username: [Enter your personal FusionSolar username]
Plant Name: [Enter your plant name]
SN Inverter: [Enter the serial number of your inverter]
```
You can find the serial number of your inverter in the FusionSolar portal. Go to PV System Overview > Your plant > Settings and click the Device tab. Copy the value from the column 'SN'.  
Once your service request is approved you’ll get the credentials for your OpenAPI account.

You need to add these credentials in `app.js`:  
`let credentials = JSON.stringify({userName: '{YOUR_USER_NAME}',systemCode: '{YOUR_PASSCODE}'});`

### Endpoints

#### /getStationRealKpi  
Interface for Real-time Plant Data  
This interface is used to obtain the real-time statistics of the plant. You can query statistics by
plant ID. A maximum of 100 plants can be queried at a time.


#### /getKpiStationHour  
Interface for Hourly Plant Data  
This interface is used to obtain the hourly statistics of the plant. You can query the hourly
statistics by plant ID and time range. You can query hourly statistics of a day for a maximum
of 100 plants at a time.

#### /getKpiStationDay
Interface for Daily Plant Data  
This interface is used to obtain the daily statistics of the plant. You can query the daily
statistics by plant ID and time range. You can query daily statistics of a month for a maximum
of 100 plants at a time.

#### /getKpiStationMonth
Interface for Monthly Plant Data  
This interface is used to obtain the monthly statistics of the plant. You can query the monthly
statistics by plant ID and time range. You can query monthly statistics of a year for a
maximum of 100 plants at a time.

#### /getKpiStationYear
Interface for Yearly Plant Data  
This interface is used to obtain the yearly statistics of the plant. You can query the monthly
statistics by plant ID and time range. You can query yearly statistics of 25 years for a
maximum of 100 plants at a time.



