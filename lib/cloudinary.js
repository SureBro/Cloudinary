// Write your package code here!
//Upload
//Delete
//Rename

CloudinaryObject = function(){
	this._apiKey = undefined;
	this._appSecret = undefined;
	this._cloudName = undefined;

	this.initialized = false;
	this.useSecure = true;

	this.secureBaseUrls = {
		api: 'https://api.cloudinary.com/v1_1/',
		cdn: 'https://res.cloudinary.com/'
	};
	this.insecureBaseUrls = {
		api: 'http://api.cloudinary.com/v1_1/',
		cdn: 'http://res.cloudinary.com/'	
	}

}

CloudinaryObject.prototype.initialize= function(apiKey, appSecret, cloudName){
	//Check if Cloudinary is already initialized
	if(this.initialized){
		throw new Meteor.Error('InitializationError', 'Cloudinary is already initialized.');	
	}

	//Check if all parameters are there to initialize Cloudinary properly
	if(apiKey){
		if(apiKey.trim().length < 1){
			throw new Meteor.Error('InitializationError', 'You either forgot to set the API Key or you enjoy looking at errors pop. Call initialize(apiKey, appSecret, cloudName)');	
		}
	}else{
		throw new Meteor.Error('InitializationError', 'You either forgot to set the API Key or you enjoy looking at errors pop. Call initialize(apiKey, appSecret, cloudName)');	
	}
	if(appSecret){
		if(appSecret.trim().length < 1){
			throw new Meteor.Error('InitializationError', 'You either forgot to set the APP Secret or you enjoy looking at errors pop. Call initialize(apiKey, appSecret, cloudName)');	
		}
	}else{
		throw new Meteor.Error('InitializationError', 'You either forgot to set the APP Secret or you enjoy looking at errors pop. Call initialize(apiKey, appSecret, cloudName)');	
	}
	if(cloudName){
		if(cloudName.trim().length < 1){
			throw new Meteor.Error('InitializationError', 'You either forgot to set the Cloudname or you enjoy looking at errors pop. Call initialize(apiKey, appSecret, cloudName)');	
		}
	}else{
		throw new Meteor.Error('InitializationError', 'You either forgot to set the Cloudname or you enjoy looking at errors pop. Call initialize(apiKey, appSecret, cloudName)');	
	}

	this._apiKey = apiKey;
	this._appSecret = appSecret;
	this._cloudName = cloudName;
	this.initialized = true;

	console.log('Cloudinary is ready to use');

	return true;
}
CloudinaryObject.prototype.switchSecurityMode = function(){
	this.useSecure = !this.useSecure;
}
CloudinaryObject.prototype.apiBaseUrl = function(){
	var urlObject = this.secureBaseUrls;
	if(!this.useSecure){
		urlObject = this.insecureBaseUrls;
	}

	return urlObject.api+this._cloudName;
}
CloudinaryObject.prototype.cdnBaseUrl = function(){
	var urlObject = this.secureBaseUrls;
	if(!this.useSecure){
		urlObject = this.insecureBaseUrls;
	}

	return urlObject.cdn;
}
//This function returns a cdn url for the image. The param required
//are the publicId of the image and the version. 
//Url looks like BaseUrl/cloudname/"image"/"upload"/"v"version/publicId
CloudinaryObject.prototype.imageUrl = function(publicId, version){
	var baseUrl = this.cdnBaseUrl();

	return baseUrl+this._cloudName+'/image/upload/v'+version+'/'+publicId;
}
//Returns a url for the resized image
CloudinaryObject.prototype.resizedImageUrl = function(publicId, width, height){
	var baseUrl = this.cdnBaseUrl();
	var tranformationParams = '';

	if(height && width){
		if((typeof width !== 'number') || (typeof height !== 'number')){
			throw new Meteor.Error('ParamsIssue', 'Width & Height should be numbers.  The Api is "Cloudinary.resizedImageUrl(publicId, width, height)"');	
		}
		tranformationParams = 'w_'+width+',h_'+height;
	}else if(!height){
		if(typeof width !== 'number'){
			throw new Meteor.Error('ParamsIssue', 'Width should be a number.  The Api is "Cloudinary.resizedImageUrl(publicId, width, height)"');		
		}	
		tranformationParams = 'w_'+width;
	}else if(!width){
		if(typeof height !== 'number'){
			throw new Meteor.Error('ParamsIssue', 'Height should be a number.  The Api is "Cloudinary.resizedImageUrl(publicId, width, height)"');	
		}
		tranformationParams = 'h_'+height;
	}else if(!width && !height){
		throw new Meteor.Error('ParamsIssue', 'You should specify either a width or height. The Api is "Cloudinary.resizedImageUrl(publicId, width, height)"');	
	}

	return baseUrl+this._cloudName+'/image/upload/'+tranformationParams+'/'+publicId;
}
CloudinaryObject.prototype.isInitialized = function(){
	if(this.initialized){
		if((this._apiKey.trim().length > 0) && (this._appSecret.trim().length > 0) && (this._cloudName.trim().length > 0)){
			return true;
		}
	}
	return false
}
//This function uploads an image to your cloudinary Cloud only
//if you have initialized Cloudinary with you API KEY, APP SECRET
//& cloud name. If not, you will receive an error.
CloudinaryObject.prototype.uploadImage = function(data, callback){
	if(!this.isInitialized){
		throw new Meteor.Error('InitializationError', 'Either Cloudinary is not initialized at all or something is wrong with the API_KEY or the APP_SECRET or the CLOUD_NAME provided. They cannot be empty or contain only whitespaces. Call initialize(apiKey, appSecret, cloudName)');	
	}
	var baseUrl = this.apiBaseUrl();
	var requestUrl = baseUrl + '/image/upload';	
	var timestamp = this.timestamp();

	//NOTE: Keys should be in alphabetical order
	//Except for the 'file' & the 'api_key'
	var params = {
		file: data,
		api_key: this._apiKey,
		timestamp: timestamp
	};

	var signature = createSignature(params, this._appSecret);
	params.signature = signature;

	sendPostRequest(requestUrl, params, callback);

}
//Similar to the uploadImage function except you can specify the folder
//you want to add this image to.
CloudinaryObject.prototype.uploadImageToFolder = function(data,folder,callback){
	if(!this.isInitialized){
		throw new Meteor.Error('InitializationError', 'Either Cloudinary is not initialized at all or something is wrong with the API_KEY or the APP_SECRET or the CLOUD_NAME provided. They cannot be empty or contain only whitespaces. Call initialize(apiKey, appSecret, cloudName)');	
	}
	var baseUrl = this.apiBaseUrl();
	var requestUrl = baseUrl + '/image/upload';	
	var timestamp = this.timestamp();

	//NOTE: Keys should be in alphabetical order
	//Except for the 'file' & the 'api_key'
	var params = {
		file: data,
		api_key: this._apiKey,
		folder:folder,
		timestamp: timestamp
	};

	var signature = createSignature(params, this._appSecret);
	params.signature = signature;

	sendPostRequest(requestUrl, params, callback);

}

//Call this function if you want to set more options that provided by
//upload image. Set options param according to your requirements.
//Go to http://cloudinary.com/documentation/image_upload_api_reference#upload
//to see what params are recognized by the Cloudinary endpoint
CloudinaryObject.prototype.uploadImageWithOptions = function(options, callback){
	var baseUrl = this.apiBaseUrl();
	var requestUrl = baseUrl + '/image/upload';	

	var signature = createSignature(options, this._appSecret);
	params.signature = signature;

	sendPostRequest(requestUrl, options, callback);
}

//Generates a UNIX timestamp
CloudinaryObject.prototype.timestamp = function(){
	return Math.floor(Date.now() / 1000);
}

/*
	UTILS SECTION
*/
//Send a post request with this function. 
function sendPostRequest(requestUrl, params, callback){
	HTTP.call('POST', requestUrl, {data: params}, function(error, result){
		if(error){
			console.log('Error while uploading image ' + error);
			// throw new Meteor.Error('InitializationError', 'Either Cloudinary is not initialized at all or something is wrong with the API_KEY or the APP_SECRET or the CLOUD_NAME provided. They cannot be empty or contain only whitespaces. Call initialize(apiKey, appSecret, cloudName)');	
		}
		console.log('Got Result while uploading image ' + result.statusCode);
		if(callback){
			if(typeof callback == 'function'){
				callback(error, result);	
			}
		}
	});
}
//To upload directly to cloudinary, you need to create a signature 
//using the parameters being sent with the request to clodinary except 
//the api_key param and the file param. This function creates the signature
//for you. You need to supply this function with an object of keys & values
//and the app secret
function createSignature(objs, secret){
	var serializedStringArray = [];
	var serializedString = '';
	var hashSerializedHash = '';
	var hexHashSerializedString = '';

	var keys = Object.keys(objs);

	for(var i=0; i<keys.length; i++){
		var key = keys[i];
		if((key !== 'api_key') && (key !== 'file')){
			if(objs.hasOwnProperty(key)){
				var addSign = '';
				var value = objs[key];	
				
				var objString =key+'='+value;

				serializedStringArray.push(objString);
			}		
		}
	}
	//Join String array to form 1 string
	serializedString = serializedStringArray.join('&');

	//Append the app secret
	serializedString = serializedString + secret;

	//convert to SHA-1. Create Hash
	hashSerializedHash = CryptoJS.SHA1(serializedString);
		
	//Convert to Hex.
	hexHashSerializedString = hashSerializedHash.toString(CryptoJS.enc.Hex);

	//return signature
	return hexHashSerializedString;
}