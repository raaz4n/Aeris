from flask import Flask, request, render_template, jsonify
from dotenv import load_dotenv
import json, requests, os

load_dotenv()
api_key = os.getenv("API_KEY")
location_api_key = os.getenv("LOCATION_API_KEY")
mapbox_api = os.getenv("MAPBOX_API")
app = Flask(__name__)

@app.route("/about", methods=["GET"])
def about():
    return render_template("about.html")

@app.route("/search", methods=["GET"])
def search():
    query = request.args.get('q')
    
    if not query:
        return '[]'
    
    geourl = f"https://api.mapbox.com/search/geocode/v6/forward?q={query}&access_token={mapbox_api}&language=en&limit=20&types=place"
    response = requests.request("GET", geourl)
    
    return response.text

@app.route("/weather", methods=["GET"])
def weather():
    city = request.args.get("city")
    state = request.args.get("state")
    country = request.args.get("country")
    unit = request.args.get("unit")
    
    if state and state.strip():
        url = f"http://api.openweathermap.org/data/2.5/weather?q={city},{state},{country}&units={unit}&lang=en&appid={api_key}"
    else:
        url = f"http://api.openweathermap.org/data/2.5/weather?q={city},{country}&units={unit}&lang=en&appid={api_key}"
    
    response = json.loads(requests.request("GET", url).text)
    temperature = response["main"]["temp"]
    desc = response["weather"][0]["description"]
    icon = response["weather"][0]["icon"]

        
    if (unit.lower() == "imperial"):
        tempChar = "°F"
    elif (unit.lower() == "metric"):
        tempChar = "°C"
    else:
        tempChar = ""

    return {"temperature": temperature, "desc": desc, "tempChar": tempChar, "icon": icon}


@app.route("/", methods=["GET", "POST"])
def aeris():
    if request.method == "POST":
        city = request.form.get("city")
        state = request.form.get("state")
        country = request.form.get("country")
        unit = request.form.get("unit")
        
        if state and state.strip():
            url = f"http://api.openweathermap.org/data/2.5/weather?q={city},{state},{country}&units={unit}&lang=en&appid={api_key}"
        else:
            url = f"http://api.openweathermap.org/data/2.5/weather?q={city},{country}&units={unit}&lang=en&appid={api_key}"
        
        response = json.loads(requests.request("GET", url).text)

        temperature = response["main"]["temp"]
        desc = response["weather"][0]["description"]
        icon = response["weather"][0]["icon"]
        
        if (unit.lower() == "imperial"):
            tempChar = "°F"
        elif (unit.lower() == "metric"):
            tempChar = "°C"
        else:
            tempChar = ""
            
        return render_template("Aeris.html", city=city, state=state, country=country, tempChar=tempChar, 
                                 unit=unit, temperature=temperature, desc=desc, icon=icon)
    
    return render_template("Aeris.html")

app.run(host="0.0.0.0", port = 5000)