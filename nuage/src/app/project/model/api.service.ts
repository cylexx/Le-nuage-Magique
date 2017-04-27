import { Injectable } from '@angular/core';
import { Http, Response } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import { FileDrive } from '../model/FileDrive';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/map';

@Injectable()
export class APIService {
	private nuageUrl = 'http://localhost:8080/'

	constructor(private http: Http){
	}

	public getFiles(){
		console.log("Reaching "+this.nuageUrl+"listFiles/");
		return this.http.get(this.nuageUrl+"listFiles/")
                  .map(this.extractJson)
                  .catch(this.handleError);
	}

	public getSpaceUsage(){
		console.log("Reaching "+this.nuageUrl+"spaceUsage/");
		return this.http.get(this.nuageUrl+"spaceUsage/")
                  .map(this.extractJson)
                  .catch(this.handleError);
	}

	public getAccountInfos(){
		console.log("Reaching "+this.nuageUrl+"accountInfos/");
		return this.http.get(this.nuageUrl+"accountInfos/")
                  .map(this.extractJson)
                  .catch(this.handleError);
	}

	public removeFile(file:FileDrive){
		let url:string;
		for(let i=0;i<file.sources.length;i++){
			let src = file.sources[i];
			if(src.name === "GoogleDrive"){
				url = "delete/GoogleDrive?id="+src.id;
			} else if (src.name === "Dropbox" ){
				url = "delete/Dropbox?path="+src.id;
			}
		}

		//url = url.replace(/ /g,"+");

		console.log("Reaching "+this.nuageUrl+url);
		return this.http.get(this.nuageUrl+url)
                  .map(this.snackbarMsg)
                  .catch(this.handleError);
	}

	public success(){
		console.log("Reaching "+this.nuageUrl+"success/");
		return this.http.get(this.nuageUrl+"success/")
                  .map(this.snackbarMsg)
                  .catch(this.handleError);
	}

	public error(){
		console.log("Reaching "+this.nuageUrl+"error/");
		return this.http.get(this.nuageUrl+"error/")
                  .map(this.snackbarMsg)
                  .catch(this.handleError);
	}

	private extractJson(res: Response) {
		console.log("Response retrieved");
    	let theFiles  = res.json();
    	return theFiles;
	}

	private snackbarMsg(res: Response) {
		let msg  = res.json();
		let x = document.getElementById("snackbar");
		let y = document.getElementById("snackbarMsg");
		let z = document.getElementById("snackbarImg");

      	// Add the "show" class to DIV
      	x.className = "show";
      	z.className = msg.result;
      	y.innerHTML = msg.message;

     	 // After 3 seconds, remove the show class from DIV
      	setTimeout(function(){ x.className = x.className.replace("show", ""); }, 3000);
	}

  	private handleError (error: Response | any) {
  		console.log("ERROR\n");
	    let errMsg: string;
	    if (error instanceof Response) {
	      const body = error.json() || '';
	      const err = body.error || JSON.stringify(body);
	      errMsg = `${error.status} - ${error.statusText || ''} ${err}`;
	    } else {
	      errMsg = error.message ? error.message : error.toString();
	    }
	    console.error(errMsg);
	    return Observable.throw(errMsg);
	}
}
