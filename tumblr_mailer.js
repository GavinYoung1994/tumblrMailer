var mandrill = require('mandrill-api/mandrill');
var mandrill_client = new mandrill.Mandrill('3VY-01HAZDtbva2rfXWVjg');

var fs = require('fs');
var ejs = require('ejs');
var tumblr = require('tumblr.js');

var csvFile = fs.readFileSync("friend_list.csv","utf8");
var htmlFile = fs.readFileSync('email_template.html', 'utf-8');
var ejsFile = fs.readFileSync('email_template.ejs', 'utf-8');

function csvParse(file){
	var lines = [];
	// var headings = [];
	var record_num = 4;
	var fileLines = file.split("\r\n").join(',').split(',');
	// for(var i=0; i<record_num; i++){
	// 	headings.push(fileLines[i]);
	// }
	while(record_num<fileLines.length){
		var new_contact = {
			firstName: fileLines[record_num],
			lastName: fileLines[record_num+1],
			numMonthsSinceContact: fileLines[record_num+2],
			emailAddress: fileLines[record_num+3],
		}
		lines.push(new_contact);
		record_num += 4;
	}
    return lines;
}

// function customizeHtml(friendlist){
// 	for(var i = 0; i<friendlist.length; i++){
// 		var new_file = htmlFile.replace(/FIRST_NAME/,friendlist[i].firstName).replace(/NUM_MONTHS_SINCE_CONTACT/,friendlist[i].numMonthsSinceContact);
// 		console.log(new_file);
// 	}
// }


function sendEmail(to_name, to_email, from_name, subject, message_html){
    var message = {
        "html": message_html,
        "subject": subject,
        "from_email": "gavinyoung1994@gmail.com",
        "from_name": from_name,
        "to": [{
                "email": to_email,
                "name": to_name
            }],
        "important": false,
        "track_opens": true,    
        "auto_html": false,
        "preserve_recipients": true,
        "merge": false,
        "tags": [
            "Fullstack_Tumblrmailer_Workshop"
        ]    
    };
    var async = false;
    var ip_pool = "Main Pool";
    mandrill_client.messages.send({"message": message, "async": async, "ip_pool": ip_pool}, function(result) {
        // console.log(message);
        // console.log(result);   
    }, function(e) {
        // Mandrill returns the error as an object with name and message keys
        console.log('A mandrill error occurred: ' + e.name + ' - ' + e.message);
        // A mandrill error occurred: Unknown_Subaccount - No subaccount exists with the id 'customer-123'
    });
 }

var friendlist = csvParse(csvFile);
// customizeHtml(friendlist);
var htmls = [];
for(var i = 0; i<friendlist.length; i++){
	htmls.push(ejs.render(htmlFile, friendlist[i]));
}

for(var i = 0; i<friendlist.length; i++){
	sendEmail(friendlist[i].firstName, friendlist[i].emailAddress,"Gavin","It Worked!",htmls[i]);
}

// Scott,D'Alessandro,0,scott@fullstackacademy.com




