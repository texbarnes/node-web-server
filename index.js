var http = require('http');
let state = require("./state");

let server = http.createServer(messageReceived);

server.listen(8080);

function messageReceived(req, res) {
    // I feel like there should be a way to split the path here, and
    // depending upon the path, use the same code below 1X, rather than
    // creating duplicate code per object (Users, Products) ¯\_(ツ)_/¯
    
    // I attempted to code this ^^^ but ran into difficulty... h m m m

    res.writeHead(200, {'Content-Type': 'text/plain'});
    if(req.method === "GET" && req.url === "/users"){
        res.write(JSON.stringify(state.users));
    }
    else if(req.method === "GET" && req.url === "/products"){
        res.write(JSON.stringify(state.products));
    }
    else if(req.method === "GET" && req.url.indexOf("/users/") > -1){
        let id = req.url.split("/");
        let user = state.users.find(p=>p["_id"] == id[2]);
        let usersJSON = JSON.stringify(user);
        res.write(usersJSON);
    }
    else if(req.method === "GET" && req.url.indexOf("/products/") > -1){
        let id = req.url.split("/");
        let product = state.products.find(p=>p["id"] == id[2]);
        let productsJSON = JSON.stringify(product);
        res.write(productsJSON);
    }
    else if(req.method === "PUT" && req.url.indexOf("/users/") > -1){
        let id = req.url.split("/");
        let user = state.users.find(p=>p["_id"] == id[2]);
        let body = [];
        req.on('data', (chunk) => {
        body.push(chunk);
        }).on('end', () => {
            body = Buffer.concat(body).toString();
            body = JSON.parse(body);
            user.name = body.name;
            // not sure how to update any given "key": "value" pair?
        });
    }
    else if(req.method === "PUT" && req.url.indexOf("/products/") > -1){
        let id = req.url.split("/");
        let product = state.products.find(p=>p["id"] == id[2]);
        let body = [];
        req.on('data', (chunk) => {
        body.push(chunk);
        }).on('end', () => {
            body = Buffer.concat(body).toString();
            body = JSON.parse(body);
            product.name = body.name;
            // not sure how to update any given "key": "value" pair?
        });
    }
    else if(req.method === "DELETE" && req.url.indexOf("/users/") > -1){
        let id = req.url.split("/");
        state.users.splice(Number(id[2])-1, 1);
        res.write("deleted");
    }
    else if(req.method === "DELETE" && req.url.indexOf("/products/") > -1){
        let id = req.url.split("/");
        state.products.splice(Number(id[2])-1, 1);
        res.write("deleted");
    }
    else if(req.method === "POST" && req.url === "/users"){
        postUsers(req, res);
    }
    else if(req.method === "POST" && req.url === "/products"){
        postProducts(req, res);
    }
    else{
        res.write("So Sorry. No Data For You!");
    }
    res.end();
}   

function postUsers(req, res){
    let body = [];
    req.on('data', (chunk) => {
      body.push(chunk);
    }).on('end', () => {
      body = Buffer.concat(body).toString();
      let user = JSON.parse(body);
      user._id = state.users.length+1;
      state.users.push(user);
      // Need to send newly created user object back to client ¯\_(ツ)_/¯
    }); 
}

function postProducts(req, res){
    let body = [];
    req.on('data', (chunk) => {
      body.push(chunk);
    }).on('end', () => {
      body = Buffer.concat(body).toString();
      let product = JSON.parse(body);
      product.id = state.products.length+1;
      state.products.push(product);
    }); 
}