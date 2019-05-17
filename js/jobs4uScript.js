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

var searchInp = document.getElementById('searchBar');
var company = document.getElementById('companyTxt');
var contactNumber = document.getElementById('contactNumTxt');
var description = document.getElementById('descriptionTxt');
var salary = document.getElementById('salaryTxt');
var title = document.getElementById('jobTitleTxt');
var locationTxt = document.getElementById('locationTxt');

var adminKeyInp = document.getElementById('adminKeyInp');

var app = angular.module('app', []);

app.controller('controller', function ($scope) {
    $scope.isAdmin = false;
    $scope.jobsData = [];
    $scope.jobCategories = ["hairdressing", "construction", "technology", "teaching", "management", "retail", "other"];
    $scope.currentCategories = ["all"];
    $scope.selectedCategory = "";
    $scope.filterByCat;
    $scope.filterBySearch;

    db.collection("jobs")
        .onSnapshot(function (querySnapshot) {
            $scope.jobsData = [];
            $scope.currentCategories = ["all"];

            querySnapshot.forEach(function (doc) {
                var addCat = true;
                $scope.jobsData.push(Object.assign({ uid: doc.id }, doc.data()));
                if (!$scope.currentCategories.includes(doc.data().category)) {
                    $scope.currentCategories.push(doc.data().category);
                    console.log("cat added: " + doc.data().category);
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

    $scope.searchEntered = function (search){
        if(search == undefined){
            search = "";
        }
        console.log("Search: "+search)
        $scope.filterBySearch = search;
        searchInp.value = "";
    }

    $scope.categoryClicked = function (cat) {
        if (cat == "all") {
            $scope.filterByCat = "";
        } else {
            $scope.filterByCat = cat;
        }
    }

    $scope.addListing = function () {
        console.log("Adding listing");
        console.log("company: " + company.value + " | contactNum: " + contactNumber.value + " | description: " + description.value + " | salary: " + salary.value + " | title: " + title.value + " | category: " + $scope.selectedCategory + " | timestamp: " + new Date() + " | location: " + locationTxt.value);
        $scope.addToDb();
    }

    $scope.addToDb = function () {
        db.collection("jobs").add({
            company: company.value,
            contactNumber: contactNumber.value,
            description: description.value,
            salary: salary.value,
            title: title.value,
            category: $scope.selectedCategory,
            location: locationTxt.value,
            timestamp: + new Date()
        })
            .then(function (docRef) {
                console.log("Document written with ID: ", docRef.id);
                company.value = ""
                contactNumber.value = ""
                description.value = ""
                salary.value = ""
                title.value = ""
                locationTxt.value = ""
                $scope.selectedCategory = ""
            })
            .catch(function (error) {
                console.error("Error adding document", error);
            })
    }

    $scope.deleteListing = function(uid){
        console.log("deleting doc with id: "+uid);
        db.collection("jobs").doc(uid).delete().then(function() {
            console.log("Document successfully deleted!");
        }).catch(function(error) {
            console.error("Error removing document: ", error);
        });
    }

    $scope.validateFormInfo = function () {

    }

})