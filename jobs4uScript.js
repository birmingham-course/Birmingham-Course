// Your web app's Firebase configuration
var firebaseConfig = {
    apiKey: "AIzaSyBeNOU7hAI3uCR6ArTjdf2CZWF7rs7qbYg",
    authDomain: "job-listings-8897c.firebaseapp.com",
    databaseURL: "https://job-listings-8897c.firebaseio.com",
    projectId: "job-listings-8897c",
    storageBucket: "job-listings-8897c.appspot.com",
    messagingSenderId: "684092257257",
    appId: "1:684092257257:web:5aacc8cc8b204f65"
};
// Initialize Firebase
firebase.initializeApp(firebaseConfig);

var db = firebase.firestore();

var submitJobBtn = document.getElementById('submitJobBtn');

var company = document.getElementById('companyTxt');
var contactNumber = document.getElementById('contactNumTxt');
var description = document.getElementById('descriptionTxt');
var salary = document.getElementById('salaryTxt');
var title = document.getElementById('jobTitleTxt');
var category = document.getElementById('categoryTxt');

var adminKeyInp = document.getElementById('adminKeyInp');

var app = angular.module('app', []);

app.controller('controller', function ($scope) {
    $scope.isAdmin = false;
    $scope.jobsData = [];
    $scope.jobCategories = [];



    /*
                $scope.getJobsData = function () {
                    console.log("getJobsData ran")
                    db.collection("jobs").get().then((querySnapshot) => {
                        querySnapshot.forEach((doc) => {
                            console.log(`${doc.id} => ${doc.data()}`);
                            $scope.jobsData.push(doc.data());
                        });
                    });
                }
    */
    db.collection("jobs")
        .onSnapshot(function (querySnapshot) {
            $scope.jobsData = [];
            
            querySnapshot.forEach(function (doc) {
                var addCat = true;
                $scope.jobsData.push(doc.data());
                if ($scope.jobCategories.length == 0) {
                    $scope.jobCategories.push(doc.data().category);
                } else {
                    for (category in $scope.jobCategories) {
                        if (doc.data().category == category) {
                            addCat = false;
                            break;
                        }
                    }
                    if(addCat){
                        console.log("cat added: "+doc.data().category);
                        $scope.jobCategories.push(doc.data().category);
                    }
                }

            });
            console.log("jobs: ", $scope.jobsData.join(", "));
            $scope.$apply();
        });
    $scope.onAdminChecked = function () {
        var checkbox = document.getElementById("adminBox")
        $scope.isAdmin = checkbox.checked;
        console.log('is Admin: ' + $scope.isAdmin);
    }

    $scope.adminSubmitBtnPress = function () {
        if (adminKeyInp.value == "key") {
            console.log("key correct")
        }
    }

    $scope.adminLogin = function () {
        if (adminKeyInp.value == "key") {
            console.log("correct key!");
            $scope.isAdmin = true;
        } else {
            console.log("incorrect key!")
        }
        adminKeyInp.value = "";
    }

    $scope.logout = function () {
        $scope.isAdmin = false;
        console.log("admin logged out")
    }

    $scope.showAddListingBox = function () {

    }

    $scope.addListing = function () {
        console.log("Adding listing");
        db.collection("jobs").add({
            company: company.value,
            contactNumber: contactNumber.value,
            description: description.value,
            salary: salary.value,
            title: title.value,
            category: category.value,
            timestamp: + new Date()
        })
            .then(function (docRef) {
                console.log("Document written with ID: ", docRef.id);
                company.value = ""
                contactNumber.value = ""
                description.value = ""
                salary.value = ""
                title.value = ""
                category.value = ""
            })
            .catch(function (error) {
                console.error("Error adding document", error);
            })
    }

    $scope.validateFormInfo = function () {

    }

})
