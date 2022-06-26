# stock-boy-functions

A repo grouping all code needed for the Stock Boy fundamental analysis app. Stock Boy is a cloud function-based app that runs Python on the backend with a UI build using React. This allows it to be virtually serverless and run natively on all devices.

## code flow

Stock Boy pulls the most recent idx file from the SEC for the current year. This is a text file with all submitted 10-Ks for the year. This idx file is parsed and used to pull financial statement links and values from financial statements using the company name and cik.

Individual webpages containg each a company 10-K, income statement, balance sheet, and cash flow statement are obtained by scraping the SEC website. The links to each of these pages is stored in a database and displayed in the Stock Boy app. The SEC API is used to query for relevant stock info using the cik for the company. This retrieves all values within a company's financial statement based on how the company has used XBRL labels. This is important because it is a major factor for filing inconsistencies and missing values in the Stock Boy analysis.

```aggregate_idx_for_year.py``` pulls a year's IDX from the SEC website (year is set in file). This is saved as a text file which can then be used by other files.

```grab_simplified_financials.py``` parses the most recent 10-Ks from a certain year's IDX (year can be set from within the file) and uses the CIKs in the IDX to send a request to the SEC API. A large dictionary parses the response json and grabs the relevant data for the factors Stock Boy needs and stores them in the Stock Boy database. This information is then used by ```analyze_simple_financials.py``` to analyze relevant factors. The analysis computes the desired values for each of the years data is available and stores it in the database.

```financial_links_from_xml.py``` uses a year's idx to grab the urls for financial statements and annual reports.

```my_app``` contains front end code.

There was an attempt at logging errors for troubleshooting but it is no longer used. There are currently no tests or legitimate logs. There are also no analytics for web app usage.

## storage

A noSQL Firebase Firestore is used for storing data. This is ideal because data storage is only done on the backend (no user input) and documents can easily be grabbed containing the data necessary for displaying each company page. Storage includes financial links, simplified and analyzed data, timestamps for database updates, and known tickers (scraped from annual reports if included in them). The keys used are the company cik as company names and tickers can change, but ciks generally don't. This is important because Stock Boy pulls data as-is from the SEC. Therefore, tickers and ciks are not 1:1 correlated. This is resolved by including all different ticker/name/cik combinations that can be retrieved in search autocomplete but indexing by ciks.

Documents have been created to optimize reads and writes without making data management too convoluted. The only current issue is retrieving all tickers upon app load for autocomplete takes a few seconds. This is fixed by creating a pre-set dictionary in the js code for autocomplete to show results before tickers can be retrieved from the Firestore.

## functions

Currently only one functions exists to automate Twitter likes and create a small amount of engagement. Functions will be created to automatically pull idx files and update the database accordingly.

## important commands

```python3 file_name``` run backend script to update database. 

```npm run start``` start local react app. 

```npm run build``` create publishable react build. 

```firebase deploy``` deploy publishable react build. 

## future work

* automating the site
* more data properly pulled
* add affiliate links to pay for server costs
* proper CL tooling for pull and analyzing data
* testing/logging
* analytics
