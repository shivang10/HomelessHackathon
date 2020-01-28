//jshint esversion:6

const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const saltRounds = 10;

const app = express();

app.set("view engine", "ejs");

app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(express.static("public"));

mongoose.connect("mongodb://localhost:27017/dducDB", {
        useNewUrlParser: true,
        useUnifiedTopology: true
    }).then(() => console.log("MongoDB successfully connected"))
    .catch(err => console.log(err));


const donationSchema = {
    fullname: String,
    email: String,
    paymentids: String,
    amount: Number,
    phnumber: Number,
};

const accessDonationSchema = {
    fullname: String,
    phnumber: Number,
    food: String,
    clothes: String,
    medicines: String,
    others: String,
    donationID: String,
    status: Number
};

const volunteer = {
    firstName: String,
    lastName: String,
    phnumber: Number,
    email: String,
    gender: String
};

const Donation = mongoose.model("Donation", donationSchema);

const DonationAccess = mongoose.model("DonationAccess", accessDonationSchema);

const Volunteer = mongoose.model("Volunteer", volunteer);

app.get("/", function (req, res) {
    res.render("home");
});

app.get("/home", function(req, res){
    res.render("home");
})

app.get("/try", function(req, res){
    res.render("try");
});

app.get("/aboutus", function(req, res){
    res.render("aboutus");
});

app.get("/contactus", function(req, res){
    res.render("contactus");
})

app.get("/donation", function (req, res) {
    res.render("donation");
});

app.get("/moneydonation", function (req, res) {
    res.render("moneydonation");
});

app.get("/donationidexist", function (req, res) {
    res.render("moneydonation");
});

app.get("/accessdonation", function (req, res) {
    res.render("accessdonation");
});

app.get("/volunteerreg", function (req, res) {
    res.render("volunteerreg");
})

app.post("/moneydonation", function (req, res) {

    const fnameRec = req.body.fullname;
    const emailRec = req.body.email;
    const paymentidRec = req.body.paymentid;
    const amountRec = req.body.amount;
    const phnumberRec = req.body.phnum;

    const addDetails = new Donation({
        fullname: fnameRec,
        email: emailRec,
        paymentids: paymentidRec,
        amount: amountRec,
        phnumber: phnumberRec
    });


    Donation.findOne({
        paymentids: paymentidRec
    }, function (err, idFound) {
        if (!err) {
            if (!idFound) {
                addDetails.save(function (err, details) {
                    if (err) {
                        console.log(err);
                    } else {
                        //console.log("yes");
                        res.render("donationsuccessfull", {
                            uniqueIDvalue: paymentidRec
                        });
                    }
                });
            } else {
                res.render("donationidexist");
            }
        }
    });

});

app.post("/accessdonation", function (req, res) {

    const fnameRec = req.body.fullname;
    const phnumberRec = req.body.phnum;
    const medicineRec = req.body.medicine;
    const foodRec = req.body.food;
    const clothesRec = req.body.clothes;
    const othersRec = req.body.others;

    var f = 0;

    //while(f != 1)
    //for(var ix = 0; ix<3; ix++)
    while (1) {
        var id = Math.random().toString(36).substr(2, 10);
        DonationAccess.findOne({
            donationID: id
        }, function (err, idFound) {
            if (!err) {
                if (!idFound) {
                    f = 1;
                    //console.log(id);
                } else {
                    f = 0;
                }
            }
        });
        //console.log(id);
        f = 1;
        if (f == 1) {
            break;
        }
    }

    const addDetails = new DonationAccess({
        fullname: fnameRec,
        phnumber: phnumberRec,
        food: foodRec,
        clothes: clothesRec,
        medicines: medicineRec,
        others: othersRec,
        status: 0,
        donationID: id
    });

    addDetails.save(function (err, details) {
        if (err) {
            console.log(err);
        } else {
            res.render("donationsuccessfull", {
                uniqueIDvalue: id
            });
        }
    });
});

app.post("/volunteerreg", function (req, res) {

    const FirstName = req.body.fnamev;
    const LastName = req.body.lnamev;
    const Email = req.body.emailv;
    const PhNumber = req.body.phnumv;
    const Gender = req.body.genderv;

    const newVolunteer = new Volunteer({
        firstName: FirstName,
        lastName: LastName,
        email: Email,
        phnumber: PhNumber,
        gender: Gender
    });

    Volunteer.findOne({
        email: Email
    }, function (err, findem) {
        if (!err) {
            if (!findem) {
                newVolunteer.save(function (err) {
                    if (err) {
                        res.send(err);
                    } else {
                        res.render("volunteerregistration", {username: FirstName});
                    }
                });
            } else {
                res.render("volunteerexist");
            }
        }
    });

})



app.listen(3000, function () {
    console.log("Server is running");
});