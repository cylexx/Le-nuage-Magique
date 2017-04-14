import { Component, OnInit, Input } from '@angular/core';
import { APIService } from '../model/api.service';

@Component({
  selector: 'app-connexion-drive',
  templateUrl: './connexion-drive.component.html',
  styleUrls: ['./connexion-drive.component.css']
})
export class ConnexionDriveComponent implements OnInit {

  @Input() name : string;

  constructor(private nuage : APIService) { }

  ngOnInit() { }

  /*
  * Connection to a particular drive
  */
  connect(name) {
    console.log(name)

  	console.log("Trying to get files")
  	// this.nuage.getFiles().subscribe(
  	// 	(response) => {
    // 		console.log("Displaying files");
  	// 		console.log(response[0].files[0].id);
		// });
    if(name==="GoogleDrive"){
      window.open("http://localhost:8080/connect/GoogleDrive", '_blank');
      this.addValidateImg("connectionButtonGoogleDrive","validateGoogleDrive");
    }
    else if(name==="Dropbox"){
      this.addValidateImg("connectionButtonDropbox","validateDropbox");
    }
    else if(name==="OneDrive"){
      this.addValidateImg("connectionButtonOneDrive","validateOneDrive");
    }
  }

  /*
  *Display vaidate image when connection to the drive is okay
  */
  addValidateImg(idButton, idImg){
    document.getElementById(idButton).style.display="none";
    document.getElementById(idImg).style.display="block";
  }
}
