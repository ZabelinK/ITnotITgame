from http import server
import json
import cgi

path_to_records = "./records.json"
data_file = open(path_to_records, 'r')
data_str = ""
for line in data_file:
    data_str += line
data = json.loads(data_str)
data_file.close()

MAX_SENDING_ITEMS = 10

class my_handler(server.BaseHTTPRequestHandler):
    def do_GET(self):
        self.send_response(200)
        self.send_header("Access-Control-Allow-Origin", "*")
        self.send_header("Content-type", "application/json")
        self.end_headers()
        self.wfile.write(bytes(json.dumps(data).encode('utf-8')))

    def do_POST(self):
        content_len = int(self.headers.get('Content-Length'))
        body = self.rfile.read(content_len)
        self.send_response(200)
        self.send_header("Access-Control-Allow-Origin", "*")
        self.end_headers()

        newItem = json.loads(body)
        for i, item in zip(range(len(data)), data):
            if newItem['score'] >= item['score']:
                data.insert(i, newItem)
                break
        data_file = open(path_to_records, 'w')
        data_file.write(json.dumps(data, indent=4))
        data_file.close()

my_server = server.HTTPServer(('127.0.0.1', 6060), 
                my_handler)


my_server.serve_forever()