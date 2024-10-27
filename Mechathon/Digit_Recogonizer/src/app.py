from flask import Flask, request, render_template, jsonify
from flask_cors import CORS
import numpy as np
import tensorflow as tf

app = Flask(__name__)
CORS(app)

# Load your trained model
model = tf.keras.models.load_model("Mechathon/Digit_Recogonizer/models/DIGITZ_best.h5")

@app.route("/", methods=["GET", "POST"])
def index():
    return render_template("index.html")

@app.route('/predict', methods=['POST'])
def predict():
    # Get the data from the JSON request
    data = request.get_json().get('data', [])
    
    
    # Ensure data is the correct length and reshape for the model
    if len(data) != 28 * 28:
        return jsonify({"error": "Invalid input size"}), 400
    
    # Convert to a NumPy array and reshape to fit model's input shape
    input_data = np.array(data).reshape(1, 28, 28, 1).astype('float32')
    
    # Predict the digit
    predictions = model.predict(input_data)
    predicted_digit = np.argmax(predictions)
    # print(predictions)

    # Return the prediction as JSON
    return jsonify({"digit": int(predicted_digit)})

if __name__ == '__main__':
    app.run(debug=True, port=8001)
