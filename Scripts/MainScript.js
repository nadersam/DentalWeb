var CallAPI = 0;
function getParameterByName(name, url) {
    if (!url) url = window.location.href;
    name = name.replace(/[\[\]]/g, "\\$&");
    var regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)"),
        results = regex.exec(url);
    if (!results) return undefined;
    if (!results[2]) return '';
    return decodeURIComponent(results[2].replace(/\+/g, " "));
}
$(document).ready(function () {
    vm = new MainViewModel();
    //$("#BirthDateControl").datepicker({ dateFormat: 'dd-mm-yy', changeYear: true });
    //$("#BirthDateControl").mask("99-99-9999");
    ko.applyBindings(vm);
});
var MainViewModel = function () {
    var self = this;
    self.UserName = ko.observable("");
    self.PassWord = ko.observable("");
    self.CallAPI = getParameterByName('CallAPI');
    if (self.CallAPI == null || self.CallAPI == undefined) {
        self.CallAPI = 0;
    } 
    self.ValidateLogin = function () {
        if (self.UserName() == "") {
            toastr.warning("Please enter a valid user name.");
            return;
        }
        if (self.PassWord() == "") {
            toastr.warning("Please enter a valid user name.");
            return;
        }
        $.ajax({
            url: "/DentalAPI/api/Dental/ValidateLogin?UserName=" + self.UserName() + "&Password=" + self.PassWord(),
            type: 'GET',
            dataType: "json",
            contentType: "application/json; charset=utf-8",
            success: function (data) {
                if (data != 0) {
                    toastr.success("Successfull Login.");
                    window.location = "/DentalWeb/DashBoard.html?UserName=" + self.UserName() + "&UserKey=" + data;
                } else {
                    toastr.warning("Invalid user name or password.");
                }
            },
            error: function (request) {
                alert(request.responseText);
            }
        });
    };
    self.Genders = ko.observableArray([]);
    self.FillGenders = function () {
        self.Genders([]);
        self.Genders.push(new CodeDescEntity({ Code: "1", Description: "Male" }));
        self.Genders.push(new CodeDescEntity({ Code: "2", Description: "Female" }));
    }
    self.Patients = ko.observableArray([]);
    self.PatientID = ko.observable("");
    self.Name1 = ko.observable("");
    self.Name2 = ko.observable("");
    self.Name3 = ko.observable("");
    self.Phone = ko.observable("");
    self.GetPats = function () {
        var pid;
        if (self.PatientID() == "" || self.PatientID() == undefined || self.PatientID() == 0) {
            pid = "0";
        } else {
            pid = self.PatientID();
        }
        if (vm.CallAPI == 1) {
            $.ajax({
                url: "/DentalAPI/api/Dental/GetPatsList?PatientID=" + pid + "&Name1=" + self.Name1() + "&Name2=" + self.Name2() + "&Name3=" + self.Name3() + "&Phone=" + self.Phone(),
                type: "GET",
                dataType: "json",
                contentType: "application/json; charset=utf-8",
                success: function (data) {
                    var pats = ko.utils.arrayMap(data, function (item) {
                        return new PatientEntity(item)
                    });
                    self.Patients(pats);
                },
                error: function (request) {
                    alert(request.responseText);
                },
            });
        }
    }
    self.SPatientID = ko.observable("");
    self.SLName1 = ko.observable("");
    self.SLName2 = ko.observable("");
    self.SLName3 = ko.observable("");
    self.SAName1 = ko.observable("");
    self.SAName2 = ko.observable("");
    self.SAName3 = ko.observable("");
    self.SPhone = ko.observable("");
    self.SBirthDate = ko.observable("");
    self.SEmail = ko.observable("");
    self.SAddress = ko.observable("");
    self.SGender = ko.observable("");
    self.LoadPatData = function (PatientID) {
        self.FillGenders();
        if (vm.CallAPI == 1) {
            $.ajax({
                url: "/DentalAPI/api/Dental/LoadPatData?PatientID=" + PatientID,
                type: "GET",
                dataType: "json",
                contentType: "application/json; charset=utf-8",
                success: function (data) {
                    self.SPatientID(data[0].PatientKey);
                    self.SLName1(data[0].LName1);
                    self.SLName2(data[0].LName2);
                    self.SLName3(data[0].LName3);
                    self.SAName1(data[0].AName1);
                    self.SAName2(data[0].AName2);
                    self.SAName3(data[0].AName3);
                    self.SPhone(data[0].Phone);
                    self.SBirthDate(data[0].BirthDate);
                    self.SEmail(data[0].Email);
                    self.SAddress(data[0].Address);
                    self.SGender(data[0].Gender);
                },
                error: function (request) {
                    alert(request.responseText);
                },
            });
        }
    }
    self.LoadPatEdit = function (item) {
        self.LoadPatData(item.PatientKey());
        $("#PatEditModal").modal('show');
    }
    self.PatEditModalSubmit = function () {
        $("#PatEditModal").modal('hide');
    }
}
function PatientEntity(item) {
    var self = this;
    self.PatientKey = ko.observable(item.PatientKey);
    self.Phone = ko.observable(item.Phone);
    self.BirthDate = ko.observable(item.BirthDate);
    self.Gender = ko.observable(item.Gender);
    self.Address = ko.observable(item.Address);
    self.Email = ko.observable(item.Email);
    self.LName = ko.observable(item.LName);
    self.AName = ko.observable(item.AName);
}
function CodeDescEntity(item) {
    var self = this;
    self.Code = ko.observable(item.Code);
    self.Description = ko.observable(item.Description);
}