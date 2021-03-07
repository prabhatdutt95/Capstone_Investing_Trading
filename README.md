# Data Scientist Nanodegree

## MLND Capstone Project

## Project: Investment and Trading

## Table of Contents

- [Project Overview](#project-overview)
- [Project Components](#project-components)
  - [Price Prediction using LSTM](#python)
  - [Creating Web APIs with Flask](#flask)
  - [Angular Web App](#angular)
- [Prerequisite](#prereq)
- [Running](#project-running)
  - [Price Prediction using LSTM pipeline(Data Processing and Storing stage)](#process_generate)
  - [Creating Web APIs with Flask Pipeline](#api-creation)
  - [Running the Angular Web App](#run-flask)
- [Files](#files)

***

<a id='project-overview'></a>

## 1. Project Overview
In this project using data engineering, I have analyzed historic prices (around 600 days old) of stocks listed in NIFTY50. The NIFTY50 is a benchmark Indian stock market index that represents the weighted average of 50 of the largest Indian companies listed on the National Stock Exchange. I have taken data-source as YAHOO and analyzed the Close-price. For this task, I have used <a href="https://colah.github.io/posts/2015-08-Understanding-LSTMs/" target="_blank"> LSTM model</a>, which is a variation of Recurrent Neural Network.

Additionally, I have performed Twitter Sentiment Analysis for a list of tweets using <a href="https://textblob.readthedocs.io/en/dev/" target="_blank">TextBlob</a>. On this I have calculated polarity for each tweet and provided a polarity-status i.e., Whether the list of tweet are: Positive/Negative/Neutral.

Combining Future price prediction of a stock along with the Twitter sentiment analysis for that particular stock can be an efficient medium in filtering stocks or any other securities. Thereby it can help in potential of growth for both traders and investor, in short as well as long term. 

<a id='project-components'></a>

## 2. Project Components

There are three components of this project:

<a id='python'></a>

### 2.1. Price Prediction using LSTM
File _data/Generate_Database_Stocks.ipynb.py_ contains data processing pipeline which will:

- Creating the dataframe by using YAHOO as datasource, today's date and 600 days from current day's dates.
- Split the dataframe into train and test dataset.
- Build the LSTM model.
- Fit the model by using train dataset
- Predict the stock prices based on test dataset
- Finally store the Date, Actual Price and Prediction price in the **SQLite database** named after each Stock

<a id='flask'></a>

### 2.2. Creating Web APIs with Flask

File _models/api.py_ contains various web api which perform the following:

- In order to access Twitter data, authentication are required. You can get your keys from <a href="https://developer.twitter.com/en/docs/twitter-api/getting-started/guide" target="_blank">here</a>. I am using my _key_ from env file.
- At initial load, stock_list is prepared by converting data from csv file to json format. Also all the database are generated from previous step (#python) are further used here.
- To get data for all the stocks in nifty50, i.e., Company_Name/Symbol/Industry/Twitter_handle/Logo/Low/Open/High/Close/Volume
- To get past data i.e., 30/90/180/365 days for a particular stock
- To get the prediction of prices stored in database for each stock in Nifty50
- To get tweets from Twitter for a particular keyword and total count of tweets.(In this project, I have kept count of tweets as 150)
- To get Twitter sentiment analysis for particular stock based on their symbol and provide a Polarity status


<a id='flask'></a>

### 2.3. Angular Web App

Inside the _app_ directory, I have created a web application based on Angular framework. This is where I am displaying the entire data with which a user can easily interact.
Following the list of interactions:

- The slideshow panel on top contains the list of stocks in Nifty50 with their respective name, price and percentage change. Hovering over any card, stops the moving animation. Selecting the card will result in display of charts in format of line and candle-sticks.
- Search bar to select a stock. Type the name of the listed stock and click on _Go_ to access their chart details.
- Table containing the stock data with view button to access their chart details.
- The right-hand side of screen consists of live twitter embedded. Initially, tweets from @NSEIndia will be displayed.
- On selecting a stock, chart of Line and Candlestick are displayed, along with Twitter Sentiment Analysis of the stock symbol.
- Line chart contains actual data(in blue) of last 60days along with predictions(in red) obtained using LSTM.
- Candle chart has 4 parameters: 30/90/180/365 days to range the date.
- Also, on selection of the particular stock, Twitter feed changes to that particular stock. On this data, _Twitter Sentiment Analysis_ is performed and data is displayed as the polarity-status of that particular stock.

<a id="prereq"></a>
## 3. Prerequisite:
To run the code, you need to have the following:

- Python (More Details: https://www.python.org/downloads/)
- Colab (More Details: https://colab.research.google.com/notebooks/)
- Angular 10+ (More Details: https://angular.io/docs)
- Node.js (More Details: https://nodejs.org/en/docs/)

<a id='project-running'></a>

## 4. Running

The application requires to be started from Price-Prediction-using-LSTM pipeline stage.

<a id='process_generate'></a>

### 4.1. Stage 1: Price Prediction using LSTM pipeline(Data Processing and Storing stage)

**Go to the project directory** and the run the following command:

- Download/Clone this repository in your local system.
- Inside data folder, open _Generate_Database_Stocks.ipynb_ and run all the cells.(Note: Please avoid running cell #6 if using any code editor) Once everything is done, you will get the list of database of stocks. Please copy all the database and keep it inside models/DatabaseStock directory.
- In case you want to use Colab Notebook, upload the file and run all the cells. Once done, you will be notified of downloading the zipped folder of all the database file. Please download the zipped folder inside models/DatabaseStock directory and extract it there.

![zipping_files](https://github.com/prabhatdutt95/Capstone_Investing_Trading/blob/main/Screenshot/Step1_zipping_files.JPG?raw=true)

<a id='api-creation'></a>
### 4.2. Stage 2: Creating Web APIs with Flask Pipeline

After Stage 1 is complete

**Go to the project directory** and the run the following command:

First create and activate a virtual-environment by following command
```
virtualenv <Name of your environment>
<Name of your environment>/Scripts/activate
```

Install from requirements.txt inside model directory using command:
```
pip install -r requirements.txt
```
![Installing_lib](https://github.com/prabhatdutt95/Capstone_Investing_Trading/blob/main/Screenshot/Stage2_Installing_lib.JPG?raw=true)
Now inside the models directory, run the following command:
```bat
python api.py
```

Application will start running locally!

![Running_locally_2](https://github.com/prabhatdutt95/Capstone_Investing_Trading/blob/main/Screenshot/Step2_running_locally.JPG?raw=true)


<a id='run-flask'></a>
### 4.3. Stage 3: Running the Angular Web App

After Stage 2 is running (application is running locally)

**Go the app directory** and run the following command to install the node_modules:

<a id='web-cmd'></a>

```bat
npm i
```
After node_modules are installed, run the application locally by running the following command:
```bat
ng serve --open
```
This will start running application on your web browser.

![Running_locally_3](https://github.com/prabhatdutt95/Capstone_Investing_Trading/blob/main/Screenshot/Step3_running_locally.JPG?raw=true)

**_Screenshot 1_**

![Home Page](https://github.com/prabhatdutt95/Capstone_Investing_Trading/blob/main/Screenshot/Step3_Home.JPG?raw=true)

**_Screenshot 2_**

![Search_result](https://github.com/prabhatdutt95/Capstone_Investing_Trading/blob/main/Screenshot/Step3_Search_result.JPG?raw=true)

**_Screenshot 3_**

![Twitter_Analysis_negative](https://github.com/prabhatdutt95/Capstone_Investing_Trading/blob/main/Screenshot/Step3_Twitter_analysis.JPG?raw=true)


**_Screenshot 4_**

![Twitter_Analysis_positive](https://github.com/prabhatdutt95/Capstone_Investing_Trading/blob/main/Screenshot/Step3_Twitter_analysis_positive.JPG?raw=true)

**_Screenshot 5_**

![Search_candle](https://github.com/prabhatdutt95/Capstone_Investing_Trading/blob/main/Screenshot/Step3_candle.JPG?raw=true)


## 5. Files

<pre>
.
├── app
│   ├── templates
│   │   ├── assets
│   │   │   ├── favicon.ico-----------# FAVICON FOR THE WEB APP
│   │   │   └── logo.png--------------# LOGO FOR THE WEB APP
│   │   ├── go.html-------------------# CLASSIFICATION RESULT PAGE OF WEB APP
│   │   └── master.html---------------# MAIN PAGE OF WEB APP
│   └── run.py------------------------# FLASK FILE THAT RUNS APP
│
├── data
│   ├── disaster_categories.csv-----------# CSV DATA CONTAINING CATEGORIES DATA
│   ├── disaster_messages.csv-------------# CSV DATA CONTAINING MESSAGES DATA
│   ├── DisasterResponse.db---------------# DATABASE IN WHICH WE SAVE THE CLEANED DATA
│   └── process_data.py-------------------# PERFORMS ETL PROCESS
│   └── ETL Pipeline Preparation.ipynb----# JUPYTER NOTEBOOK CONTAINING ETL PIPELINE
│
├── models
│   ├── classifier.pkl -------------------# PICKLE FILE TO SAVE THE EXPORT THE FINAL MODEL-PIPELINE
│   ├── ML Pipeline Preparation.ipynb-----# JUPYTER NOTEBOOK CONTAINING ML PIPELINE
│   └── train_classifier.py---------------# PERFORMS CLASSIFICATION TASK
|
└── Screenshots ----------------------# CONTAINS SCREENSHOTS FOR VARIOUS STEPS IN APPLICATION

</pre>

