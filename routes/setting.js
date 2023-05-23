const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const db = require('../config/Database.js');
const userMiddleware = require('../middleware/UserModel.js');
var md5 = require('md5');
const fileUpload = require('express-fileupload');
const _ = require('lodash');
const mime = require('mime-types')
var bodyParser = require('body-parser');
var cors = require('cors');
var app = express();
app.use(cors());

app.use(fileUpload({
    createParentPath: true
}));
app.get('/getSetting', (req, res, next) => {
  db.query(`Select s.key_text
  ,s.description
  ,s.value
  ,s.value_type
  ,s.creation_date
  ,s.modification_date
  From setting s
  Where s.setting_id !=''`,
    (err, result) => {
      if (err) {
        console.log("error: ", err);
        return;
      } else {
            return res.status(200).send({
              data: result,
              msg:'Success'
            });

        }
 
    }
  );
});

app.post('/editSetting', (req, res, next) => {
  db.query(`UPDATE setting 
            SET key_text=${db.escape(req.body.key_text)}
            ,description=${db.escape(req.body.description)}
            ,value=${db.escape(req.body.value)}
            ,value_type=${db.escape(req.body.value_type)}
            WHERE setting_id = ${db.escape(req.body.setting_id)}`,
    (err, result) => {
     
      if (err) {
        console.log("error: ", err);
        return;
      } else {
            return res.status(200).send({
              data: result,
              msg:'Success'
            });
      }
     }
  );
});
  
app.post('/insertSetting', (req, res, next) => {

  let data = {value	: req.body.value	
    , creation_date: req.body.creation_date
    , modification_date: req.body.modification_date
    , group_name: req.body.group_name
    , value_type	: req.body.value_type
    , show_to_user	: req.body.show_to_user
    , chi_value: req.body.chi_value
    , used_for_admin: req.body.used_for_admin
    , used_for_www: req.body.used_for_www
    , flag		: req.body.flag		
    , site_id	: req.body.site_id	
  
    
 };
  let sql = "INSERT INTO setting SET ?";
  let query = db.query(sql, data,(err, result) => {
    if (err) {
      console.log("error: ", err);
      return;
    } else {
          return res.status(200).send({
            data: result,
            msg:'Success'
          });
    }
  });
});

  

app.delete('/deleteSetting', (req, res, next) => {

  let data = {description: req.body.description};
  let sql = "DELETE FROM setting WHERE ?";
  let query = db.query(sql, data,(err, result) => {
    if (err) {
      console.log("error: ", err);
      return;
    } else {
          return res.status(200).send({
            data: result,
            msg:'Success'
          });
    }
  });
});


app.get('/secret-route', userMiddleware.isLoggedIn, (req, res, next) => {
  console.log(req.userData);
  res.send('This is the secret content. Only logged in users can see that!');
});

module.exports = app;