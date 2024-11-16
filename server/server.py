from flask import Flask, request, jsonify, render_template, send_from_directory
import pickle
import json
import os
import numpy as np

app = Flask(__name__, static_folder='../client')

# Load the model and columns
model = pickle.load(open('server/artifacts/banglore_home_prices_model.pickle', 'rb'))
with open('server/artifacts/columns.json', 'r') as f:
    data_columns = json.load(f)['data_columns']
    locations = data_columns[3:]  # Assuming the first three columns are bhk, bathroom, and area

@app.route('/')
def home():
    return render_template('app.html')

@app.route('/locations', methods=['GET'])
def get_locations():
    return jsonify({'locations': locations})

@app.route('/show-locations')
def show_locations():
    return render_template('location.html')

@app.route('/static/<path:filename>')
def static_files(filename):
    return send_from_directory(app.static_folder, filename)

@app.route('/predict', methods=['POST'])
def predict():
    data = request.json
    bhk = int(data['bhk'])
    bathroom = int(data['bathroom'])
    area = float(data['area'])
    location = data['location']

    loc_index = data_columns.index(location.lower()) if location.lower() in data_columns else -1

    x = np.zeros(len(data_columns))
    x[0] = bhk
    x[1] = bathroom
    x[2] = area
    if loc_index >= 0:
        x[loc_index] = 1

    estimated_price = model.predict([x])[0]
    return jsonify({'estimated_price': estimated_price})

if __name__ == '__main__':
    app.run(debug=True)