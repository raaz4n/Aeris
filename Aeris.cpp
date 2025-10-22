#include <iostream>
#include <cstdlib>
#include <cpr/cpr.h>
using namespace std;

int main(){
    string API_KEY = getenv("API_KEY");
    string link; 
    string city;
    string state;
    string country;
    cout << "Enter a city: ";
    cin >> city;
    cout << "Enter a state (only for US, type -1 to disregard): ";
    cin >> state;
    cout << "Enter a country: ";
    cin >> country;
    if (state == "-1"){
        link = "http://api.openweathermap.org/geo/1.0/direct?q=" + city + "," + country + "&limit=1&appid=" + API_KEY;
    }
    else{
        link = "http://api.openweathermap.org/geo/1.0/direct?q=" + city + "," + state + "," + country + "&limit=1&appid=" + API_KEY;
    }
    cpr::Response r = cpr::Get(cpr::Url{link});
    cout << r.text;
}