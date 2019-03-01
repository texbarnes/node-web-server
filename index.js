var http = require('http');
let state = require("./state");

let server = http.createServer(messageReceived);

server.listen(8080);

function messageReceived(req, res) {
    res.writeHead(200, {'Content-Type': 'text/plain'});
    if(req.method === "GET" && req.url === "/users"){
        res.write(JSON.stringify(state.users));
    }
    else if(req.method === "GET" && req.url.indexOf("/users/") > -1){
        let id = req.url.split("/");
        let user = state.users.find(p=>p["_id"] == id[2]);
        let usersJSON = JSON.stringify(user);
        res.write(usersJSON);
    }
    else if(req.method === "POST" && req.url === "/products"){
        postProducts(req, res);
    }
    else{
        res.write("So Sorry. No Data For You!");
    }
    res.end();
}   

function postProducts(req, res){
    let body = [];
    req.on('data', (chunk) => {
      body.push(chunk);
    }).on('end', () => {
      body = Buffer.concat(body).toString();
      let product = JSON.parse(body);
      products.push(product);
    }); 
}
