const mysql = require('mysql');
// const mysql2 = require('mysql2/promise');
const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const port = 3000;

const dotenv = require('dotenv');
dotenv.config();

//Parses json
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());


//configuration of database using mysql
const connection =  mysql.createConnection({
    host: process.env.DB_HOSTNAME.toString(),
    user: process.env.DB_USERNAME.toString(),
    password: process.env.DB_PASSWORD.toString(),
    database: process.env.DB_DATABASENAME.toString()
})

//connect to database
connection.connect((err) => {
    if (err) {
        console.error(err);
    }
    else {
        console.log("database conected successfully.");
    }
})

//get all pizzas
app.get('/pizzas', (req, res) => {
    console.log("REQ");
    let sql = 'SELECT * FROM pizzatb';
     connection.query(sql, (err, results) => {
        if (err) {
            res.send(err);
        } else {
            console.log(results);
            res.send(results);
        }
    })
});

//insert pizza
app.post('/pizzas', (req, res) => {
    let pizza = { id: null, name: req.body.name, desc: req.body.description, type: req.body.type, image_url: req.body.image_url };
    console.log(pizza);
    let sql = `INSERT INTO pizzatb VALUES(${pizza.id},'${pizza.name}','${pizza.desc}','${pizza.type}','${pizza.image_url}')`;
     connection.query(sql, pizza, (err, result) => {
        if (err) {
            console.error(err);
            res.send('something went wrong');
        }
        else {
            if (result.affectedRows == 1) {
                res.send('pizza inserted successfully.');
            } else {
                res.send('pizza cpuldn\'t inserted successfully!');
            }
        }
    })
})

//update pizza
app.put('/pizzas', (req, res) => {
    let pizza = { id: req.body.id, name: req.body.name, desc: req.body.description, type: req.body.type, image_url: req.body.image_url };
    let pid = pizza.id;
    let sql = `SELECT count(*) as cnt FROM pizzatb WHERE pizzaid= ${pid}`;
    console.log(sql);
     connection.query(sql, (err, result) => {
        if (err) {
            console.error(err);
            res.send('Something Went Wrong!!');
        }
        else {
            const count = result[0]['cnt'];
            if (count != 1) {
                res.send(`pizza not found with pizzaid ${pid}`);
            }
            else {
                //update data
                const u_sql = `UPDATE pizzatb SET name='${pizza.name}',description='${pizza.desc}',type='${pizza.type}',image_url='${pizza.image_url}' WHERE pizzaid=${pid}`;
                 connection.query(u_sql, (err, result) => {
                    if (err) {
                        console.log(err);
                        res.send('Can\'t update pizza details!');
                    } else {
                        console.log(result);
                        // res.send(result);
                        if (result.affectedRows == 1) {
                            res.send('pizza updated successfully.');
                        } else {
                            res.send('pizza couldn\'t updated successfully!!');
                        }
                    }
                });
            }
        }
    })
})

//delete pizza
app.delete('/pizzas/:pid', (req, res) => {
    let pid = req.params.pid;
    let sql = `SELECT count(*) as cnt FROM pizzatb WHERE pizzaid= ${pid}`;

     connection.query(sql, (err, result) => {
        if (err) {
            console.error(err);
            res.send('Something Went Wrong!!');
        } else {
            const count = result[0]['cnt'];
            if (count != 1) {
                res.send(`pizza not found with pizzaid ${pid}`);
            }
            else {
                const sql = `DELETE FROM pizzatb WHERE pizzaid=${pid}`;
                 connection.query(sql, (err, result) => {
                    if (err) {
                        console.log(err);
                        res.send('Something Went Wrong!');
                    }
                    else {
                        if (result.affectedRows == 1) {
                            res.send('pizza deleted successfully.');
                        } else {
                            res.send('pizza couldn\'t deleted successfully!');
                        }
                    }
                })
            }
        }
    })
})

app.use((req, res) => {
    res.send('404 | NOT FOUND');
}) *

    app.listen(port, () => {
        console.log(`server listening on port ${port}`);
    });