from flask import Flask, request, render_template
from requests.exceptions import HTTPError
from dotenv import load_dotenv
import json, requests
import os

load_dotenv()
api_key = os.getenv("API_KEY")
app = Flask(__name__)

@app.route("/search", methods=["GET"])
def search():
    query = request.args.get('q')
    
    if not query:
        return '[]'
    
    geourl = f"http://api.openweathermap.org/geo/1.0/direct?q={query}&limit=10&appid={api_key}"
    response = requests.request("GET", geourl)
    
    return response.text


@app.route("/", methods=["GET", "POST"])
def aeris():
    if request.method == "POST":
        city = request.form.get("city")
        state = request.form.get("state")
        country = request.form.get("country")
        unit = request.form.get("unit")
        
        if state:
            url = f"http://api.openweathermap.org/data/2.5/weather?q={city},{state},{country}&units={unit}&lang=en&appid={api_key}"
        else:
            url = f"http://api.openweathermap.org/data/2.5/weather?q={city},{country}&units={unit}&lang=en&appid={api_key}"
        
        response = json.loads(requests.request("GET", url).text)

        temperature = response["main"]["temp"]
        desc = response["weather"][0]["main"]
        
        if (unit.lower() == "imperial"):
            tempChar = "°F"
        elif (unit.lower() == "metric"):
            tempChar = "°C"
        else:
            tempChar = ""
            
        return render_template("Aeris.html", city=city, state=state, country=country, tempChar=tempChar, 
                                 unit=unit, temperature=temperature, desc=desc, api_key=api_key)
    
    return render_template("Aeris.html")

app.run(host="0.0.0.0", port = 80)