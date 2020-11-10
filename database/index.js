const bodyParser = require('body-parser');
const express = require('express');
const app = express();
const lineByLine = require('n-readlines');
const hostInfos = require('./hostInfos');
const mysql = require('mysql');
const connection = mysql.createConnection(hostInfos);
const sql = `CREATE TABLE IF NOT EXISTS products (
    id VARCHAR(50) NOT NULL, 
    PRIMARY KEY(id), 
		name VARCHAR(255),
		installmentPrice VARCHAR(50),
		installmentCount VARCHAR(50),
    price VARCHAR(50), 
    oldPrice VARCHAR(50), 
    status VARCHAR(50), 
    categories VARCHAR(50), 
    brand VARCHAR(50),
    image VARCHAR(255)
)`;

const getValues = (obj) => `(
		'${obj.id}',
    '${obj.name}',
		'${obj.installment.price}',
		'${obj.installment.count}',
		'${obj.price}',
		'${obj.oldPrice}',
    '${obj.status}',
    '${obj.categories[0].name}',
    '${obj.brand}',
    '${obj.images.imagem1 ? obj.images.imagem1 : obj.images.default}'),`;

const insertData = (list) => {
    var sql = `INSERT INTO products (id, name, installmentPrice, installmentCount, price, oldPrice, status, categories, brand, image) VALUES ${list};`;
    connection.query(sql, function(err, result) {
        if (err) {
            throw err
        };
        console.log("1 record inserted");
    });
}

app.use(bodyParser.urlencoded({ extended: true }));

const migrateData = () => {
    const liner = new lineByLine('catalog.json');
    let list = '';
    let count = 0;

    while (line = liner.next()) {
        const dataObj = JSON.parse(line)
        list += getValues(dataObj);
        count++;
        if (count > 100) {
            insertData(list.slice(0, -1));
            count = 0;
            list = '';
        }
    }

    insertData(list.slice(0, -1));
};


const checkDataOnTable = () => {
    connection.query('SELECT * FROM catalogtest.products LIMIT 1;', (err, result) => {
        if (err) {
            throw err
        };

        if (result.length === 0) {
            migrateData();
        }
    })
}

app.get('/compact/:id', function(req, res, next) {
    connection.query(`SELECT name, price, status, categories FROM catalogtest.products WHERE id='${req.params.id}'`, (err, result) => {
        if (err) {
            throw err
        };

        if (result.length !== 0) {
            res.send(result[0])
        }
    })

});

app.get('/complete/:id', function(req, res, next) {
    connection.query(`SELECT * FROM catalogtest.products WHERE id='${req.params.id}'`, (err, result) => {
        if (err) {
            throw err
        };

        if (result.length !== 0) {
            res.send(result[0])
        }
    })
});

app.get('/', function(req, res, next) {
    const liner = new lineByLine('catalog.json');
    line = liner.next();
    const dataObj = JSON.parse(line);
    res.send(dataObj)
});

app.get('/list/:list', function(req, res) {
    const list = JSON.parse(req.params.list);

    let resultObj = {
        mostpopular: null,
        pricereduction: null,
    }

    let aux = `${list.mostpopular[0]}`;
    list.mostpopular.forEach((item, index) => {
        if (index !== 0) {
            aux += `,${item}`;
        }
    });

    connection.query(`SELECT * FROM catalogtest.products WHERE id IN (${aux})`, (err, result) => {
        if (err) {
            throw err
        };

        if (result.length !== 0) {
            resultObj.mostpopular = result;

            let aux = `${list.pricereduction[0]}`;
            list.pricereduction.forEach((item, index) => {
                if (index !== 0) {
                    aux += `,${item}`;
                }
            });
            connection.query(`SELECT * FROM catalogtest.products WHERE id IN (${aux})`, (err, result) => {
                if (err) {
                    throw err
                };

                if (result.length !== 0) {
                    resultObj.pricereduction = result;
                    res.send(JSON.stringify(resultObj));
                }
            })
        }
    })
});



app.listen(3001, () => {
    connection.connect((err) => {
        if (err) {
            throw err
        };
        console.log("Connected!");

        connection.query("CREATE DATABASE IF NOT EXISTS catalogTest", (err) => {
            if (err) {
                throw err
            };
            console.log("Database created if not exits");
        });

        connection.query('USE catalogTest', (err) => {
            if (err) {
                throw err
            };

            connection.query(sql, (err, result) => {
                if (err) {
                    throw err
                };
                console.log("Table products created if not exits");

                checkDataOnTable();
            });
            console.log('Using catalogTest')
        })
    });

    console.log('running')
})