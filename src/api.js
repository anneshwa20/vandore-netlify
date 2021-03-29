const express = require("express");
const serverless= require('serverless-http');
const app= express();
const shortid = require('shortid')
const Razorpay = require('razorpay')
const cors = require('cors')
const bodyParser = require('body-parser')
const unirest= require('unirest');
const nodemailer= require('nodemailer');
var request = unirest("POST", "https://www.fast2sms.com/dev/bulkV2");
var FCM = require('fcm-node');
var serverKey = 'YAAAASVgkMfU:APA91bHfhiBNTQ1J0lDHLvArcICihFYF-WDBermLe5DaLHD1-aRMt73nS0iX8IfP5qmLatduurjoWapV19v_4ZcnsOC3j-sdMfIkkadFlrjKJ9qqfe1awc3b9_Z07FRy5bHvlMXAm4lv'; // put your server key here
var fcm = new FCM(serverKey);



var admin = require("firebase-admin");

var serviceAccount = require("./vandore-ac2b8-firebase-adminsdk-67n7n-75919a5e94.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});






app.use(cors({ origin: true}));
app.use(bodyParser.json())
app.use(express.json());

request.headers({
	authorization: '6ohvTa8gpjsAdEJCrHOkZn245XuKmSc703UwifeIqMDtPVl1FQsIoz6X9l3Jy4qmTx0MABD7kLtQRfGa'
  });


const razorpay = new Razorpay({
	key_id: 'rzp_live_wlIDmWLjbK9t9Q',
	key_secret: 'PEDVVWDUrnNBNjJ43zNWOqLH'
})



 
   var transporter = nodemailer.createTransport({
	host: "smtp-pulse.com",
	port: 2525,
	auth: {
	  user: "vandoreofficial@gmail.com",
	  pass: "pEcSkMiPp7624"
	}
  });   

  /* var transporter = nodemailer.createTransport({
	service: 'gmail',
	auth: {
		   user: 'vandoreofficial@gmail.com',
		   pass: 'il0vemyc0untry119424'
	   }
   }) */
  
  // verifying the connection configuration
  transporter.verify(function(error, success) {
	if (error) {
	  console.log(error);
	} else {
	  console.log("Server is ready to take our messages!");
	}
  });


const router= express.Router();


router.get('/', (req,res) =>{
    res.status(200).send('hii');
})

router.get('/test', (req,res) =>{
    res.status(200).send('test');
})

router.post('/orderEmail', async (req, res) => {
	 
	var email = req.query.email
	var message = req.query.message
	var business= req.query.business
	var subject= req.query.subject
  
	var mail = {
	  from: `${business} <web@vandore.in>`, 
	  to: email, 
	  subject: subject,
	  text: message
	}
  
   await transporter.sendMail(mail, (err, data) => {
	
	  if (err) {
		res.json({
		  status: 'fail',
		  err: err
		})
	
	  } else {
		res.json({
		 status: 'success'
		})
	
	  }
	})
  })



  router.post('/feedbackEmail', async (req, res) => {
	 
	var email = req.query.email
	var message = req.query.message
	var business= req.query.business
	var subject= req.query.subject
  
	var mail = {
	  from: `${business} <web@vandore.in>`, 
	  to: email, 
	  subject: subject,
	  text: message
	}
  
   await transporter.sendMail(mail, (err, data) => {
	
	  if (err) {
		res.json({
		  status: 'fail',
		  err: err
		})
	
	  } else {
		res.json({
		 status: 'success'
		})
	
	  }
	})
  })




/* app.post('/verification', (req, res) => {
	// do a validation
	const secret = '12345678'

	console.log(req.body)

	const crypto = require('crypto')

	const shasum = crypto.createHmac('sha256', secret)
	shasum.update(JSON.stringify(req.body))
	const digest = shasum.digest('hex')

	console.log(digest, req.headers['x-razorpay-signature'])

	if (digest === req.headers['x-razorpay-signature']) {
		console.log('request is legit')
		// process it
		require('fs').writeFileSync('payment1.json', JSON.stringify(req.body, null, 4))
	} else {
		// pass it
	}
	res.json({ status: 'ok' })
}) */

router.post("/orderSMS", (req, res) => {
	request.form({
		"route" : "dlt",
        "sender_id" : "VANDOR", 
		"message": req.query.messageId,
		"language": "english",
		
        "variables_values": req.query.message,
		"numbers": req.query.phone,
        "flash": '0'
	  });
	  
	  request.end(function (res) {
		if (res.error) throw new Error(res.error);
	    
		   
	  });

      res.status(200).json({
		  status: 'success'
	  })
	  
  });


router.post('/sendNotification',(req,res) => {
	  console.log(req.body);
	  // These registration tokens come from the client FCM SDKs.
var registrationTokens = req.body.tokens;
  
  // Subscribe the devices corresponding to the registration tokens to the
  // topic.
 /*  var payload= {
	notification: {
		title: "this is a test",
		body: 'test description'
	 }
  };

  var options={
	  priority: 'high',
	  timeToLive: 60*60*24
  } */
  var message={
	notification: {
		title: req.body.title,
		body: req.body.desc,
		image: req.body.image
	 },
	 tokens: req.body.tokens
  }
  admin.messaging().sendMulticast(message)
	.then(function(response) {
	  // See the MessagingTopicManagementResponse reference documentation
	  // for the contents of response.
	  console.log('Successfully subscribed to topic:', response);
	  res.status(200).json({
		  status: 'success'
	  })
	})
	.catch(function(error) {
	  console.log('Error subscribing to topic:', error);
	  res.status(200).json({
		err: error
	})
	});
  
  })







router.post('/razorpay', async (req, res) => {
	const payment_capture = 1
	const amount = req.query.total * 1
	const currency = 'INR'

	const options = {
		amount: amount * 100,
		currency,
		receipt: shortid.generate(),
		payment_capture
	}

	try {
		const response = await razorpay.orders.create(options)
		console.log(response)
		res.json({
			id: response.id,
			currency: response.currency,
			amount: response.amount
		})
	} catch (error) {
		console.log(error)
	}
})



app.use('/.netlify/functions/api',router);

module.exports.handler= serverless(app);