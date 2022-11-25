from flask import Flask, request
import json


app = Flask(__name__)

@app.route('/add/<int:a>/<int:b>', methods=['GET'])
def add(a, b):
    return str(a + b)

@app.route('/test', methods=['POST'])
def test():
    print(request.data)
    parseData = json.loads(request.data.decode('utf-8'))
    print(parseData)
    return parseData['name']

app.run(host='0.0.0.0', port=8080)
