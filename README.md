# Grant-API

### Set-up
1. Install MongoDB
2. Download grantApiDBData.json
3. In cmd,  navigate to MongoDB bin folder (e.g. cd C:\Program Files\MongoDB\Server\4.2\bin) and run

  ```
  mongoimport --db grant-api --collection households --file C:\filelocation\grantApiDBData.json
  ```
4. Download  https://github.com/latashalenus/Grant-API.git
5. In cmd,  navigate to Grant-API folder and run
```
npm install
npm start
```

### Use
1. Download Postman
2. Enter request URL:  http://localhost:3000 in Postman
3. Change URL path and HTTP verb according to needs

Editing or viewing of **households**:  http://localhost:3000/api/households
Query on eligible households for **grants**:  http://localhost:3000/api/grants

add /help for help in each

### Assumptions and Interpretations 
* Input JSON format is correct, with required fields
* Names within families are unique
* When checking if there are couples in the household, if there is a person with the name of a spouse in the household, it is assumed that they are a couple
* URL parameters include (fm_age_lt, fm_age_gt, hh_income_lt, has_couple, house_type)
* URL parameters are performed like an AND function (e.g. if fm_age_lt=40&fm_age_gt=20  --> return members who are aged 20-40)
* (has_couple) field only takes in "true" or "false", if anything else entered, filter ignored 
* If multiple of the (fm_age_lt, fm_age_gt, hh_income_lt) field entered in the URL parameters, just take the first one
* If multiple of the (house_type) field entered in the URL parameters, will find households that match any one of the options
* If only (has_couple, house_type, hh_income_lt) fields are entered, all family members will be considers qualifyingFM

