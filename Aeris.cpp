#include <iostream>
#include <cstdlib>
#include <cpr/cpr.h>
#include <nlohmann/json.hpp>
#include <fstream>
#include <algorithm>
using namespace std;
using json = nlohmann::json;

int main(){
    //string API_KEY = getenv("API_KEY");
    ifstream file("test.txt");
    string API_KEY;
    getline(file, API_KEY);
    string link; 
    string city;
    string state;
    string country;
    string unit;


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

    cpr::Response r = cpr::Get(cpr::Url{link});
    json response = json::parse(r.text);
    cout << setw(4) << "Temperature: " << response["main"]["temp"]  << endl << setw(4) << "Weather: " << response["weather"][0]["main"] << endl;
}