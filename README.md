# Cloudinary

This is the unofficial meteor package for Cloudinary. This is not a meteor wrapper around the official npm library. This is a package specifically built for meteor and therefore some functions might be missing. We only added functions that were required for our use case. Feel free to contribute to this repo if you feel like it. We will keep adding stuff.

## Getting Started

Add Cloudinary to your project:

`
meteor add gaopai:cloudinary
`

You need to initialize Cloudinary before you can use it. Use this opportuinity to set your api_key, app_secret and cloudname.
See the [Cloudinary Docs](http://cloudinary.com/documentation/api_and_access_identifiers) to find out what each of those are.

`
Cloudniary.initialize('API_KEY','APP_SECRET','CLOUD_NAME');
`

Now you are ready to use Cloudinary to upload your images to Cloudinary.

##Advanced Setup
By default the base url used by Cloudinary will be the SSL version. If you want to use the non-secure version add `Cloudinary.switchSecurityMode()`

> Call the same method to switch back to secure mode. 

##Uploading Images to Cloudinary
To upload an image call `Cloudinary.uploadImage(image, callback)`. These images will be added to any of your folders. To add an image to a particular folder use `uploadImageToFolder()` instead. There are a lot of optional parameters you can set when you upload an image and there are cases where you might have to set these. If yes then use `uploadImageWithOptions()`. All these functions will take care of the [authentication signature](http://cloudinary.com/documentation/upload_images#creating_api_authentication_signatures) for you.

 
###*Cloudinary.uploadImage(image, callback);*
- **image** : Image here could be in any format recognized by the Cloudinary API. So image can either be a byte array buffer, data URI (Base 64 encoded), remote FTP, HTTP or HTTPS URL of an image or an S3 URL. For more detail check [this](http://cloudinary.com/documentation/image_upload_api_reference#upload) out.


- **callback** : A callback function that should be called when the upload process is complete. Your callback should be prepared to receive 2 parameters, 

  - *error* : An error object as per the specifications listed [here.](http://cloudinary.com/documentation/admin_api#error_handling)
  - *data* : An response object from the Cloudinary API. Information about the uploaded image can be found in *data.data*. Your *data.data* should look like [this.](http://cloudinary.com/documentation/upload_images#upload_response) You should also check the *data.statusCode* is actually 200 in your callback before you assume that your upload was successful.  


###*Cloudinary.uploadImageToFolder(image, folder, callback);*
- **image** : *Similar to the one posted above*

- **folder** : A name *(String)* of a folder where the image should be uploaded. Make sure that you have created the folder beforehand.


- **callback** : *Similar to the one posted above*

###*Cloudinary.uploadImageWithOptions(options, callback);*
- **options** : Your parameter object that includes both optional and required parameters as per the API [specifications](http://cloudinary.com/documentation/image_upload_api_reference#upload).

- **callback** : *Similar to the one posted above*

##Generating image urls
You can choose to save the image url in your database for later use or you can use the package t generate the url for you. Using the package to generate the url is a better solution because this way you can really take advantage of one of Cloudinary's awesome features, image editing right in the URL. Right now the package only supports re-sizing the image. 

If you want to the url of the original image use `imageUrl()`. If you want to fetch the url of a resized image use, `resizedImageUrl()`. If you plan on using these methods you will have to find a way to retrieve the public id and the version of the image you want the url for. So either store it in your database or file or whatever.

###*Cloudinary.imageUrl(publicId, version);*
- **publicId** : The public id of the image
- **version** : The version of the image

This function returns the url of the image in string format.
> This function does not verify that the image actually exists. This is a convenience function that concats the values to build the semantically correct url. So even if you provide information for a non-existing image, you still will get a result.

###*Cloudinary.resizedImageUrl(publicId, width, height);*
- **publicId** : The public id of the image
- **width** : The required width of the image. Should be a number.
- **height** : The required height of the image. Should also be a number.

**You can either specify both or you can choose to specify the height or width**. If you specify only one of either the width or the height, the other param will be calculated to keep intact the aspect ratio of the image. 

To only specify the width call, *Cloudinary.resizeImageUrl('randomPublicId', 100, 0);* or *Cloudinary.resizeImageUrl('randomPublicId', 100, '')*  or *Cloudinary.resizeImageUrl('randomPublicId', 100, null)*

To only specify the height call, *Cloudinary.resizeImageUrl('randomPublicId', 0, 100);* or *Cloudinary.resizeImageUrl('randomPublicId',  '', 100)*  or *Cloudinary.resizeImageUrl('randomPublicId', null,100)* 

They all work but I prefer to be super explicit and therefore just use the `null` version. 

And of course, to retrieve a url of your image with resized height and width call, *Cloudinary.resizeImageUrl('randomPublicId', 100, 100);* 

> 100 in the above examples can be any number > 0. Similar to imageUrl() methods, this method too does not verify the existence of the actual image.

##TODOs
1. Add Unit-Tests,
2. Add More image editing capabilities,
3. Add Support to Delete Images,
4. Add Support for Image versioning

##Licence
Cloudinary is available under the MIT license. See the LICENSE file for more information.

###With ♥ by [Surebro](http://surebro.com)
