#include <iostream>
#include <cstdlib>
#include <cpr/cpr.h>
#include <nlohmann/json.hpp>
#include <fstream>
#include <algorithm>
#include "crow.h"
using namespace std;
using json = nlohmann::json;

int main(){
    crow::SimpleApp app;
    //string API_KEY = getenv("API_KEY");
    ifstream file("test.txt");
    string API_KEY;
    getline(file, API_KEY);
    string link; 
    string city;
    string state;
    string country;
    string unit;

    CROW_ROUTE(app, "/")([](){
        return "Hello world";
    });

    CROW_ROUTE(app, "/yo")([](){
        return "yo what's up";
    });

    app.port(18080).multithreaded().run();

    cout << "Enter a city: ";                                               // Format the city to be link friendly, as cpr seems to not automatically handle spaces
    getline(cin, city);
    for (int i = 0; i < city.length(); i++){
        if (city[i] == ' '){
            city[i] = '+';
        }
    }

    cout << "Enter a state code (only for US, type -1 to disregard): ";     // Enter the state code (NY, CA, etc.)
    getline(cin, state);

    cout << "Enter a country code: ";
    getline(cin, country);                                                  // Enter the country code (CN, QA, MX, etc.)

    cout << "Metric or imperial?: ";                                        // User must input metric or imperial
    getline(cin, unit);
    transform(unit.begin(), unit.end(), unit.begin(), ::tolower);

    if (unit == "metric" || unit == "imperial"){
        if (state == "-1"){
            link = "http://api.openweathermap.org/data/2.5/weather?q=" + city + "," + country + "&units=" + unit + "&lang=en&appid=" + API_KEY;
        }
        else{
            link = "http://api.openweathermap.org/data/2.5/weather?q=" + city + "," + state + "," + country + "&units=" + unit + "&lang=en&appid=" + API_KEY;
        }
    }
    else{
        cout << "Invalid unit!" << endl;
    }

    char temp;
    if (unit == "metric"){
        temp = 'C';
    }
    else{
        temp = 'F';
    }

    string wind;
    if (unit == "metric"){
        wind = "m/s";
    }
    else{
        wind = "mi/h";
    }

    bool jsonError = false;
    cpr::Response r = cpr::Get(cpr::Url{link});
    json response;
    try {
        response = json::parse(r.text);
    }
    catch (json::parse_error& ex) {
        cout << "JSON Parse error! Please make sure you are giving proper inputs." << endl;
        jsonError = true;
    }
    if (!jsonError){
        cout << endl << setw(4) << "Here is the weather information for " << response["name"].get<string>() << ": " << endl;
        cout << "The temperature is: " << response["main"]["temp"] << " " << temp << ", but it feels like " << response["main"]["feels_like"] << " " << temp << "." << endl;
        cout << "The weather is currently: " << response["weather"][0]["main"].get<string>() << "." << endl;
        cout << "The percentage of clouds today are: " << response["clouds"]["all"] << "%." << endl;
        cout << "The wind speed is: " << response["wind"]["speed"] << " " << wind << "." << endl;
    }
}