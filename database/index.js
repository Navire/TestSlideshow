const bodyParser = require('body-parser');
const express = require('express');
const app = express();
const lineByLine = require('n-readlines');

const mysql      = require('mysql');
const connection = mysql.createConnection({
  host     : 'localhost',
  user     : 'root',
  password : '',
});

const sql = `CREATE TABLE IF NOT EXISTS products (
    id INT NOT NULL AUTO_INCREMENT, 
    PRIMARY KEY(id), 
    name VARCHAR(255), 
    price VARCHAR(50), 
    oldPrice VARCHAR(50), 
    status VARCHAR(50), 
    categories VARCHAR(50), 
    image VARCHAR(255)
)`;

connection.connect(function(err) {
    if (err) {
        throw err
    };
    console.log("Connected!");

    connection.query("CREATE DATABASE IF NOT EXISTS catalogTest", function (err, result) {
        if (err) {
            throw err
        };
        console.log("Database created if not exits");
    });                        

    connection.query('USE catalogTest', (err) => {        
        if (err) {
            throw err
        };

        connection.query(sql, function (err, result) {
            if (err) {
              throw err
            };
            console.log("Table products created if not exits");
        });

        console.log('Using catalogTest')
    })

  });

app.use(bodyParser.urlencoded({extended: true}));

app.listen(3001, ()=> {
    console.log('running')
})


app.get('/', (req,res) => {
    const datasource = [];
    const liner = new lineByLine('catalog.json');

    for(let i=0; i<3;i++){
        line = liner.next();
        const dataObj =JSON.parse(line)
        datasource.push(dataObj); 
    }


    // connection.query('SELECT 1 + 1 AS solution', function(err, rows, fields) {
    //     if (err) throw err;
    //     console.log('The solution is: ', rows[0].solution);
    //   });

    res.send({ value1: datasource[2]})
    connection.end();
})

